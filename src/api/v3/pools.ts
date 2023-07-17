import axios from "axios";
import { IAllPoolsDataResponse, IMyPoolsDataResponse } from "./types";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { store } from "../../redux";
import {
  POOLS_PAGE_LIMIT,
} from "../../constants/global";

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

export const getMyPoolsDataV3 = async (
  userTezosAddress: string,
  page?: number
): Promise<IMyPoolsDataResponse> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const v3PositionsResponse = await axios.get(`${Config.VE_INDEXER[connectedNetwork]}v3-positions?address=${userTezosAddress}`);
    const v3IndexerPositionsData: any[] = v3PositionsResponse.data;

    const allData: any[] = [];
    const allPositionsLength = v3IndexerPositionsData.length;

    const startIndex = page
      ? (page - 1) * POOLS_PAGE_LIMIT < allPositionsLength
        ? (page - 1) * POOLS_PAGE_LIMIT
        : allPositionsLength
      : 0;
    const endIndex =
      page && startIndex + POOLS_PAGE_LIMIT < allPositionsLength
        ? startIndex + POOLS_PAGE_LIMIT
        : allPositionsLength;

    for (let i = startIndex; i < endIndex; i++) {

      const positonData = v3IndexerPositionsData[i];
      const AMM = AMMS[positonData.amm];

      const tokenA = AMM.tokenX?.symbol;
      const tokenB = AMM.tokenY?.symbol;
      const feeTier = Number(AMM.feeBps) / 100;
      const apr = 0;
      const volume = 0;
      const tvl = 0;
      const fees = 0;
      if (AMM) {
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