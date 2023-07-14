import BigNumber from "bignumber.js";
import { IAllPoolsDataResponse, IMyPoolsDataResponse } from "./types";
import { store } from "../../redux";

export const getAllPoolsDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const allData: any[] = [];

    for (var key in AMMS) {
      if (AMMS.hasOwnProperty(key)) {
        const val = AMMS[key];
        const tokenA = val.tokenX?.symbol;
        const tokenB = val.tokenY?.symbol;
        const feeTier = Number(val.feeBps) / 100;
        const apr = 0;
        const volume = 0;
        const tvl = 0;
        const fees = 0;
        allData.push({
          tokenA: tokenA,
          tokenB: tokenB,
          feeTier: feeTier,
          apr: apr,
          volume: volume,
          tvl: tvl,
          fees: fees,
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

export const getMyPoolsData = async (
  userTezosAddress: string,
): Promise<IMyPoolsDataResponse> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKENS = state.config.tokens;

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

    for (let i = startIndex; i < endIndex; i++) {
      const positonData = allPositionsData[i];
      const AMM = AMMS[positonData.amm];

      const poolsObject = poolsDataObject[positonData.amm] || { ...EMPTY_VE_INDEXER_POOLS_OBJECT };
      const analyticsObject = analyticsDataObject[positonData.amm] || { ...EMPTY_POOLS_OBJECT };
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];
      const bribesObj: { [key: string] : Bribes} = {};

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