import { IAllPoolsDataResponse } from "./types";
import { store } from "../../redux";

export const getAllPoolsData = async (): Promise<IAllPoolsDataResponse> => {
    try {
      const state = store.getState();
      const AMMS = state.config.AMMs;
      const TOKENS = state.config.tokens;

      const allData = {
        tokenA : "USDC.e",
        tokenB : "DAI.e",
        feeTier: 0,
        apr : 0,
        volume : 0,
        tvl : 0,
        fees : 0,
      };
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