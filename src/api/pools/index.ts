import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import {
  Bribes,
  IAnalyticsDataObject,
  IIndexerPoolsDataObject,
  IPoolsDataWrapperResponse,
  VolumeV1Data,
  VolumeVeData,
} from './types';
import { IConfigPool } from '../../config/types';
import { getPnlpBalance, getStakedBalance } from '../util/balance';
import Config from '../../config/config';
import { EMPTY_POOLS_OBJECT, EMPTY_VE_INDEXER_POOLS_OBJECT } from '../../constants/global';
import { store } from '../../redux';
import { connectedNetwork } from '../../common/walletconnect';

export const poolsDataWrapperV1 = async (
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
      axios.get(`${Config.VE_INDEXER[connectedNetwork]}pools`),
      axios.get(`${Config.PLY_INDEXER[connectedNetwork]}ve/pools`),
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
              .multipliedBy(tokenPrice[y.name] ?? 0)
          );
          bribes.push({
            name: y.name,
            value: new BigNumber(y.value).dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals)),
            price: new BigNumber(tokenPrice[y.name] ?? 0),
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

      if(AMM) {
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
          isGaugeAvailable: AMM.gauge ? true : false,
        };
      }
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
  amm: IConfigPool
): Promise<boolean> => {
  try {
    // const lpTokenSymbol: string = amm.lpToken.symbol;
    const tokenOneSymbol: string = amm.token1.symbol;
    const tokenTwoSymbol: string = amm.token2.symbol;
    const lpTokenBalanceResponse = await getPnlpBalance(
      tokenOneSymbol,
      tokenTwoSymbol,
      userTezosAddress
      // lpTokenSymbol
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
  amm: IConfigPool
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
      axios.get(`${Config.VE_INDEXER[connectedNetwork]}pools`),
      axios.get(`${Config.PLY_INDEXER[connectedNetwork]}ve/pools`),
    ]);

    const poolsData: VolumeV1Data[] = poolsResponse.data;

    const analyticsData: VolumeVeData[] = analyticsResponse.data;
    
    // const analyticsDataObject: IAnalyticsDataObject = analyticsData.reduce(
    //   (finalAnalyticsObject: IAnalyticsDataObject, data) => (
    //     (finalAnalyticsObject[data.pool] = data), finalAnalyticsObject
    //   ),
    //   {}
    // );

    const poolsDataObject: IIndexerPoolsDataObject = poolsData.reduce(
      (finalPoolsObject: IIndexerPoolsDataObject, data) => (
        (finalPoolsObject[data.pool] = data), finalPoolsObject
      ),
      {}
    );

    const allData: { [id: string]: IPoolsDataWrapperResponse } = {};
    
    for (var poolData of analyticsData) {
      const AMM = AMMS[poolData.pool];
      
      // const analyticsObject = analyticsDataObject[poolData.pool] || {...EMPTY_POOLS_OBJECT};
      const poolsObject = poolsDataObject[poolData.pool] || {...EMPTY_VE_INDEXER_POOLS_OBJECT};
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];

      // if (!poolData.bribes || poolData.bribes.length === 0) {
      if (poolsObject.bribes) {
      //   bribe = new BigNumber(0);
      //   bribes = [];
      // } else {
        for (const pool of poolsObject.bribes) {
          bribe = bribe.plus(
            new BigNumber(pool.value)
              .dividedBy(new BigNumber(10).pow(TOKENS[pool.name].decimals))
              .multipliedBy(tokenPrice[pool.name] ?? 0)
          );
          bribes.push({
            name: pool.name,
            value: new BigNumber(pool.value).dividedBy(new BigNumber(10).pow(TOKENS[pool.name].decimals)),
            price: new BigNumber(tokenPrice[pool.name] ?? 0),
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

      if(AMM) {
        allData[poolData.pool] = {
          tokenA: AMM.token1.symbol,
          tokenB: AMM.token2.symbol,
          poolType: AMM.type,
          apr:
          poolsObject.apr != 'NaN' && new BigNumber(poolsObject.apr).isFinite()
              ? new BigNumber(poolsObject.apr)
              : new BigNumber(0),
          futureApr: new BigNumber(poolsObject.futureApr).isFinite() ? new BigNumber(poolsObject.futureApr) : new BigNumber(0),
          boostedApr:
          poolsObject.apr != 'NaN' && new BigNumber(poolsObject.apr).isFinite()
              ? new BigNumber(poolsObject.apr).multipliedBy(2.5)
              : new BigNumber(0), //Check formula
  
          volume: new BigNumber(poolData.volume24H.value),
          volumeTokenA: new BigNumber(poolData.volume24H.token1),
          volumeTokenB: new BigNumber(poolData.volume24H.token2),
  
          tvl: new BigNumber(poolData.tvl.value),
          tvlTokenA: new BigNumber(poolData.tvl.token1),
          tvlTokenB: new BigNumber(poolData.tvl.token2),
  
          fees: new BigNumber(poolData.fees7D.value),
          feesTokenA: new BigNumber(poolData.fees7D.token1),
          feesTokenB: new BigNumber(poolData.fees7D.token2),
  
          bribeUSD: bribe,
          bribes: bribes,
  
          isLiquidityAvailable,
          isStakeAvailable,
          isGaugeAvailable: AMM.gauge ? true : false,
        };
      }
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
