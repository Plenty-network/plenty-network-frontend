import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import {
  Bribes,
  IAnalyticsDataObject,
  IPoolsDataWrapperResponse,
  VolumeV1Data,
  VolumeVeData,
} from './types';
import { IAMM, IAmmContracts } from '../../config/types';
import { getPnlpBalance, getStakedBalance } from '../util/balance';
import Config from '../../config/config';
import { EMPTY_POOLS_OBJECT } from '../../constants/global';

export const poolsDataWrapper = async (
  address: string | undefined,
  tokenPrice: { [id: string]: number }
): Promise<{
  success: boolean;
  allData: { [id: string]: IPoolsDataWrapperResponse };
}> => {
  try {
    // TODO : UnComment when launching
    // const state = store.getState();
    // const AMMS = state.config.AMMs;

    // TODO: Remove this get call
    const AMMResponse = await axios.get(
      'https://config.plentydefi.com/v1/config/amm'
    );
    const AMMS: IAmmContracts = AMMResponse.data;

    const [poolsResponse, analyticsResponse] = await Promise.all([
      axios.get(`${Config.VE_INDEXER}pools`),
      axios.get(`${Config.PLY_INDEXER}ve/pools`),
    ]);

    // const poolsResponse = await axios.get(`${Config.VE_INDEXER}pools`);
    // const poolsResponse = await axios.get(
    //   'https://62d80fa990883139358a3999.mockapi.io/api/v1/ve'
    // );
    const poolsData: VolumeV1Data[] = poolsResponse.data;

    // const analyticsResponse = await axios.get(`${Config.PLY_INDEXER}ve/pools`);
    // const analyticsResponse = await axios.get(
    //   'https://62d80fa990883139358a3999.mockapi.io/api/v1/config'
    // );
    const analyticsData: VolumeVeData[] = analyticsResponse.data;
    
    const analyticsDataObject: IAnalyticsDataObject = analyticsData.reduce(
      (finalAnalyticsObject: IAnalyticsDataObject, data) => (
        (finalAnalyticsObject[data.pool] = data), finalAnalyticsObject
      ),
      {}
    );

    const allData: { [id: string]: IPoolsDataWrapperResponse } = {};
    
    for (var poolData of poolsData) {
      const AMM = AMMS[poolData.pool];
      // TODO: Optimise this O(2n) loop
      // const analyticsObject = getAnalyticsObject(poolData.pool, analyticsData);
      const analyticsObject = analyticsDataObject[poolData.pool] || {...EMPTY_POOLS_OBJECT};
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];

      if (!poolData.bribes || poolData.bribes.length === 0) {
        bribe = new BigNumber(0);
        bribes = [];
      } else {
        for (var y of poolData.bribes) {
          bribe = bribe.plus(
            new BigNumber(
              new BigNumber(y.value).multipliedBy(y.price)
            )
          );
          bribes.push({
            name: y.name,
            value: new BigNumber(y.value),
            price : new BigNumber(y.price)
          });
        }
      }

      let isLiquidityAvailable: boolean = false, isStakeAvailable: boolean = false;
      if(address) {
        const [liquidityResponse, stakeResponse] = await Promise.all([
          doesLiquidityExistForUser(address, AMM),
          doesStakeExistForUser(address, AMM),
        ]);
        isLiquidityAvailable = liquidityResponse;
        isStakeAvailable = stakeResponse;
      }

      allData[poolData.pool] = {
        tokenA: AMM.token1.symbol,
        tokenB: AMM.token2.symbol,
        poolType: AMM.type,

        apr:
          poolData.apr != 'NaN'
            ? new BigNumber(poolData.apr)
            : new BigNumber(0),
        prevApr: new BigNumber(poolData.previousApr) ?? new BigNumber(0),
        boostedApr:
          poolData.apr != 'NaN'
            ? new BigNumber(poolData.apr).multipliedBy(2.5)
            : new BigNumber(0), //Check formula

        volume: new BigNumber(analyticsObject.volume24H.value),
        volumeTokenA: new BigNumber(analyticsObject.volume24H.token1),
        volumeTokenB: new BigNumber(analyticsObject.volume24H.token2),

        tvl: new BigNumber(analyticsObject.tvl.value),
        tvlTokenA: new BigNumber(analyticsObject.tvl.token1),
        tvlTokenB: new BigNumber(analyticsObject.tvl.token2),

        fees: new BigNumber(analyticsObject.fees7D.value),
        feesTokenA: new BigNumber(analyticsObject.fees7D.token1),
        feesTokenB: new BigNumber(analyticsObject.fees7D.token2),

        bribeUSD: bribe,
        bribes: bribes,

        isLiquidityAvailable,
        isStakeAvailable,
      };
    }
    
    return {
      success: true,
      allData: allData,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      allData: {},
    };
  }
};

const getAnalyticsObject = (
  ammAddress: string,
  analyticsData: VolumeVeData[]
): VolumeVeData => {
  try {
    let analyticsObject: VolumeVeData | undefined;

    for (var poolData of analyticsData) {
      if (poolData.pool === ammAddress) {
        analyticsObject = poolData;
        break;
      }
    }

    if (analyticsObject) return analyticsObject;
    else throw new Error('No Analytics Data Available');
  } catch (error) {
    console.log(error);
    return {
      pool: '',
      volume24H: { value: '0', token1: '0', token2: '0' },
      volume7D: { value: '0', token1: '0', token2: '0' },
      fees24H: { value: '0', token1: '0', token2: '0' },
      fees7D: { value: '0', token1: '0', token2: '0' },
      feesEpoch: { value: '0', token1: '0', token2: '0' },
      tvl: { value: '0', token1: '0', token2: '0' },
    };
  }
};

const doesLiquidityExistForUser = async (
  userTezosAddress: string,
  amm: IAMM
): Promise<boolean> => {
  try {
    const lpTokenSymbol: string = amm.lpToken.symbol;
    const tokenOneSymbol: string = amm.token1.symbol;
    const tokenTwoSymbol: string = amm.token2.symbol;
    const lpTokenBalanceResponse = await getPnlpBalance(
      tokenOneSymbol,
      tokenTwoSymbol,
      userTezosAddress
      // lpTokenSymbol  //TODO: Uncomment when moving to mainnet
    );
    if (new BigNumber(lpTokenBalanceResponse.balance).isGreaterThan(0)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const doesStakeExistForUser = async (
  userTezosAddress: string,
  amm: IAMM
): Promise<boolean> => {
  try {
    const tokenOneSymbol: string = amm.token1.symbol;
    const tokenTwoSymbol: string = amm.token2.symbol;
    const stakedBalanceResponse = await getStakedBalance(
      tokenOneSymbol,
      tokenTwoSymbol,
      userTezosAddress
    );
    if (new BigNumber(stakedBalanceResponse.balance).isGreaterThan(0)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
