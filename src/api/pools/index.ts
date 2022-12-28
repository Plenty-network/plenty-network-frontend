import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import {
  Bribes,
  IAllPoolsData,
  IAllPoolsDataResponse,
  IAnalyticsDataObject,
  IIndexerPoolsDataObject,
  IMyPoolsData,
  IMyPoolsDataResponse,
  IPoolsDataWrapperResponse,
  VolumeV1Data,
  VolumeVeData,
} from './types';
import { IConfigPool } from '../../config/types';
import { getPnlpBalance, getStakedBalance } from '../util/balance';
import Config from '../../config/config';
import { EMPTY_POOLS_OBJECT, EMPTY_VE_INDEXER_POOLS_OBJECT, POOLS_PAGE_LIMIT } from '../../constants/global';
import { store } from '../../redux';
import { IPnlpBalanceResponse, ITokenPriceList } from '../util/types';
import { IPositionsIndexerData } from '../portfolio/types';

/** @deprecated */
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

/** @deprecated */
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

/** @deprecated */
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

/** @deprecated */
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


/**
 * Returns the detailed list of all the pools available in the protocol.
 * Returns all pools if page is not passed or 0.
 * @param tokenPrice - List of prices of all tokens from redux
 * @param page - Page number to fetch(1 and above)[Optional]
 */
export const getAllPoolsData = async (
  tokenPrice: ITokenPriceList,
  page?: number
): Promise<IAllPoolsDataResponse> => {
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

    const poolsDataObject: IIndexerPoolsDataObject = poolsData.reduce(
      (finalPoolsObject: IIndexerPoolsDataObject, data) => (
        (finalPoolsObject[data.pool] = data), finalPoolsObject
      ),
      {}
    );

    const allData: IAllPoolsData[] = [];
    
    const analyticsDataLength = analyticsData.length;
    const startIndex = page
      ? (page - 1) * POOLS_PAGE_LIMIT < analyticsDataLength
        ? (page - 1) * POOLS_PAGE_LIMIT
        : analyticsDataLength
      : 0;
    const endIndex =
      page && startIndex + POOLS_PAGE_LIMIT < analyticsDataLength
        ? startIndex + POOLS_PAGE_LIMIT
        : analyticsDataLength;
    console.log(startIndex, endIndex);
    for(let i = startIndex; i < endIndex; i++) {
      const poolData = analyticsData[i];
      const AMM = AMMS[poolData.pool];
      
      const poolsObject = poolsDataObject[poolData.pool] || {...EMPTY_VE_INDEXER_POOLS_OBJECT};
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];

      if (poolsObject.bribes) {
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

      if(AMM) {
        allData.push({
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

          isGaugeAvailable: AMM.gauge ? true : false,
        });
      }
    }
    
    return {
      success: true,
      allData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: [],
      error: error.message,
    };
  }
};

/**
 * Returns the detailed list of pools which the user has liquidity or stake page wise.
 * Returns all pools if page is not passed or 0. 
 * @param userTezosAddress - Tezos wallet address of user
 * @param tokenPrice - List of prices of all tokens from redux
 * @param page - Page number to fetch(1 and above)[Optional]
 */
export const getMyPoolsData = async (
  userTezosAddress: string,
  tokenPrice: ITokenPriceList,
  page?: number
): Promise<IMyPoolsDataResponse> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKENS = state.config.tokens;

    const [poolsResponse, analyticsResponse, positionsResponse, nonVePositionsResponse] =
      await Promise.all([
        axios.get(`${Config.VE_INDEXER}pools`),
        axios.get(`${Config.PLY_INDEXER}ve/pools`),
        axios.get(`${Config.VE_INDEXER}positions?address=${userTezosAddress}`),
        getMyNonVEPoolsData(userTezosAddress),
      ]);

    const poolsData: VolumeV1Data[] = poolsResponse.data;
    const analyticsData: VolumeVeData[] = analyticsResponse.data;
    const indexerPositionsData: IPositionsIndexerData[] = positionsResponse.data;
    const allPositionsData: IPositionsIndexerData[] =
      indexerPositionsData.concat(nonVePositionsResponse);

    const poolsDataObject: IIndexerPoolsDataObject = poolsData.reduce(
      (finalPoolsObject: IIndexerPoolsDataObject, data) => (
        (finalPoolsObject[data.pool] = data), finalPoolsObject
      ),
      {}
    );

    const analyticsDataObject: IAnalyticsDataObject = analyticsData.reduce(
      (finalAnalyticsObject: IAnalyticsDataObject, data) => (
        (finalAnalyticsObject[data.pool] = data), finalAnalyticsObject
      ),
      {}
    );

    const allData: IMyPoolsData[] = [];

    const allPositionsLength = allPositionsData.length;
    const startIndex = page
      ? (page - 1) * POOLS_PAGE_LIMIT < allPositionsLength
        ? (page - 1) * POOLS_PAGE_LIMIT
        : allPositionsLength
      : 0;
    const endIndex =
      page && startIndex + POOLS_PAGE_LIMIT < allPositionsLength
        ? startIndex + POOLS_PAGE_LIMIT
        : allPositionsLength;
    console.log(startIndex, endIndex);
    
    for(let i = startIndex; i < endIndex; i++) {
      const positonData = allPositionsData[i];
      const AMM = AMMS[positonData.amm];

      const poolsObject = poolsDataObject[positonData.amm] || { ...EMPTY_VE_INDEXER_POOLS_OBJECT };
      const analyticsObject = analyticsDataObject[positonData.amm] || { ...EMPTY_POOLS_OBJECT };
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];

      if (poolsObject.bribes.length > 0) {
        for (const pool of poolsObject.bribes) {
          bribe = bribe.plus(
            new BigNumber(pool.value)
              .dividedBy(new BigNumber(10).pow(TOKENS[pool.name].decimals))
              .multipliedBy(tokenPrice[pool.name] ?? 0)
          );
          bribes.push({
            name: pool.name,
            value: new BigNumber(pool.value).dividedBy(
              new BigNumber(10).pow(TOKENS[pool.name].decimals)
            ),
            price: new BigNumber(tokenPrice[pool.name] ?? 0),
          });
        }
      }

      if (AMM) {
        allData.push({
          tokenA: AMM.token1.symbol,
          tokenB: AMM.token2.symbol,
          poolType: AMM.type,
          apr: new BigNumber(poolsObject.apr).isFinite()
            ? new BigNumber(poolsObject.apr)
            : new BigNumber(0),
          futureApr: new BigNumber(poolsObject.futureApr).isFinite()
            ? new BigNumber(poolsObject.futureApr)
            : new BigNumber(0),
          boostedApr: new BigNumber(poolsObject.apr).isFinite()
            ? new BigNumber(poolsObject.apr).multipliedBy(2.5)
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

          isLiquidityAvailable: new BigNumber(positonData.lqtBalance).isGreaterThan(0),
          isStakeAvailable: new BigNumber(positonData.stakedBalance).isGreaterThan(0),
          isGaugeAvailable: AMM.gauge ? true : false,
        });
      }
    }

    return {
      success: true,
      allData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: [],
      error: error.message,
    };
  }
};

/**
 * Returns the positions data of the user for all the non VE pools.
 * @param userTezosAddress - Tezos account address of the user
 */
const getMyNonVEPoolsData = async (userTezosAddress: string): Promise<IPositionsIndexerData[]> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;

    const positionsData: IPositionsIndexerData[] = [];

    // Filter all the pools from config which doesn't have gauge (not part of VE system).
    // Assuming that rest all pools with gauge data is handled by indexer.
    const poolsWithoutGauge: IConfigPool[] = Object.values(AMM).filter(
      (pool: IConfigPool) => pool.gauge === undefined
    );

    const lpBalancesData: IPnlpBalanceResponse[] = await Promise.all(
      poolsWithoutGauge.map((pool: IConfigPool) =>
        getPnlpBalance(pool.token1.symbol, pool.token2.symbol, userTezosAddress)
      )
    );

    poolsWithoutGauge.forEach((pool: IConfigPool, index: number) => {
      const pnlpBalanceData: IPnlpBalanceResponse = lpBalancesData[index];
      if (pnlpBalanceData.success && new BigNumber(pnlpBalanceData.balance).isGreaterThan(0)) {
        positionsData.push({
          amm: pool.address,
          lqtBalance: pnlpBalanceData.balance,
          stakedBalance: "0",
          derivedBalance: "0",
          boostTokenId: "0",
          poolAPR: {
            current: "0",
            future: "0",
          },
        });
      }
    });

    return positionsData;
  } catch (error: any) {
    console.log(error);
    return [];
  }
};