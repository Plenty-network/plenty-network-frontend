import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { IPoolsDataWrapperResponse, VolumeVeData } from './types';
import { IAMM, IAmmContracts } from '../../config/types';
import { getPnlpBalance, getStakedBalance } from '../util/balance';
import Config from '../../config/config';

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

    // TODO: Make URL dynamic. Fetch all base urls from Config.
    // const poolsResponse = await axios.get(`${Config.VE_INDEXER}pools`);
    const poolsResponse = await axios.get(
      'https://62d80fa990883139358a3999.mockapi.io/api/v1/ve'
    );
    const poolsData = poolsResponse.data;

    // const analyticsResponse = await axios.get(`${Config.PLY_INDEXER}ve/pools`);
    const analyticsResponse = await axios.get(
      'https://62d80fa990883139358a3999.mockapi.io/api/v1/config'
    );
    const analyticsData = analyticsResponse.data;

    const allData: { [id: string]: IPoolsDataWrapperResponse } = {};

    for (var poolData of poolsData) {
      const AMM = AMMS[poolData.pool];
      const analyticsObject = getAnalyticsObject(poolData.pool, analyticsData);
      let bribe: BigNumber = new BigNumber(0);
      // Add type
      let bribes: any = [];

      if (!poolData.bribes || poolData.bribes.length === 0) {
        bribe = new BigNumber(0);
        bribes = [];
      } else {
        for (var y of poolData.bribes) {
          bribe = bribe.plus(new BigNumber(tokenPrice[y.token] * y.value));
          bribes.push({ tokenName: y.token, value: y.value });
        }
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

        volume:
          new BigNumber(analyticsObject.volume24H.value) ?? new BigNumber(0),
        volumeTokenA:
          new BigNumber(analyticsObject.volume24H.token1) ?? new BigNumber(0),
        volumeTokenB:
          new BigNumber(analyticsObject.volume24H.token2) ?? new BigNumber(0),

        tvl: new BigNumber(analyticsObject.tvl.value) ?? new BigNumber(0),
        tvlTokenA:
          new BigNumber(analyticsObject.tvl.token1) ?? new BigNumber(0),
        tvlTokenB:
          new BigNumber(analyticsObject.tvl.token2) ?? new BigNumber(0),

        fees: new BigNumber(analyticsObject.fees7D.value) ?? new BigNumber(0),
        feesTokenA:
          new BigNumber(analyticsObject.fees7D.token1) ?? new BigNumber(0),
        feesTokenB:
          new BigNumber(analyticsObject.fees7D.token2) ?? new BigNumber(0),

        bribeUSD: bribe,
        bribes: bribes,

        isLiquidityAvailable: address
          ? await doesLiquidityExistForUser(address, AMM)
          : false,
        isStakeAvailable: address
          ? await doesStakeExistForUser(address, AMM)
          : false,
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
) => {
  // Add Try Catch and Data Types

  let analyticsObject;

  for (var poolData of analyticsData) {
    if (poolData.pool === ammAddress) {
      analyticsObject = poolData;
      break;
    }
  }

  if (analyticsObject) return analyticsObject;
  else throw new Error('No Analytics Data Available');
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
