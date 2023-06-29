import axios from "axios";
import { IAllPoolsDataResponse } from "./types";
import { store } from "../../redux";

export const getAllPoolsDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKENS = state.config.tokens;
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
