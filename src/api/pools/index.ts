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
import { store } from '../../redux';

export const poolsDataWrapper = async (
  address: string | undefined,
  tokenPrice: { [id: string]: number }
): Promise<{
  success: boolean;
  allData: { [id: string]: IPoolsDataWrapperResponse };
}> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKENS = state.config.tokens;

    const [poolsResponse, analyticsResponse] = await Promise.all([
      axios.get(`${Config.VE_INDEXER}pools`),
      axios.get(`${Config.PLY_INDEXER}ve/pools`),
    ]);

    const poolsData: VolumeV1Data[] = poolsResponse.data;

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
      const analyticsObject = analyticsDataObject[poolData.pool] || {...EMPTY_POOLS_OBJECT};
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];

      if (!poolData.bribes || poolData.bribes.length === 0) {
        bribe = new BigNumber(0);
        bribes = [];
      } else {
        for (var y of poolData.bribes) {
          bribe = bribe.plus(
            new BigNumber(y.value)
              .dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
              .multipliedBy(tokenPrice[y.name])
          );
          bribes.push({
            name: y.name,
            value: new BigNumber(y.value).dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals)),
            price: new BigNumber(tokenPrice[y.name]),
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
        futureApr: new BigNumber(poolData.futureApr) ?? new BigNumber(0),
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
        isGaugeAvailable: AMM.gaugeAddress ? true : false,
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
