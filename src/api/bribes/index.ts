import { store } from "../../redux";
import axios from "axios";
import Config from "../../config/config";
import { IUserBribeIndexerData, IUserBribeDataResponse, IUserBribeData } from "./types";
import { BigNumber } from "bignumber.js";
import { ITokenPriceList } from "../util/types";

/**
 * Returns all the bribes created by a provider(user).
 * @param address - Provider wallet address
 * @param tokenPrice - List of all tokens price
 */
export const getUserBribeData = async (
  address: string,
  tokenPrice: ITokenPriceList
): Promise<IUserBribeDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKEN = state.config.tokens;

    const userBribeResponse = await axios.get(
      `${Config.VE_INDEXER}bribes-provider?address=${address}`
    );
    const myBribesData: IUserBribeIndexerData[] = userBribeResponse.data;

    const allData: IUserBribeData[] = [];

    for (const bribe of myBribesData) {
      const AMM = AMMS[bribe.amm];
      const bribeValue = new BigNumber(bribe.value);
      allData.push({
        ammAddress: AMM.address,
        tokenA: AMM.token1.symbol,
        tokenB: AMM.token2.symbol,
        poolType: AMM.type,
        bribeValue: bribeValue
          .dividedBy(new BigNumber(10).pow(TOKEN[bribe.name].decimals))
          .multipliedBy(tokenPrice[bribe.name]),
        bribeToken: bribe.name,
        epoch: Number(bribe.epoch),
      });
    }

    return {
      success: true,
      userBribesData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      userBribesData: [],
      error: error.message,
    };
  }
};