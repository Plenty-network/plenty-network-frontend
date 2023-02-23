import { BigNumber } from "bignumber.js";
import { store } from "../../redux";
import { getDexAddress } from "../util/fetchConfig";
import { getStorage } from "../util/storageProvider";
import { ISwapDataResponse, tezPairsStorageType } from "./types";

/**
 * Returns the swap data required for the pair of tokens during swap.
 * @param tokenIn - Input token symbol during swap
 * @param tokenOut - Output token symbol during swap
 */
export const loadSwapDataTezPairs = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.tokens;
    const AMM = state.config.AMMs;

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    if (dexContractAddress === "false") {
      throw new Error("No dex found");
    }

    const storageResponse = await getStorage(dexContractAddress, tezPairsStorageType);

    const token1Pool = new BigNumber(storageResponse.token1_pool);
    const token2Pool = new BigNumber(storageResponse.token2_pool);
    let lpTokenSupply = new BigNumber(storageResponse.totalSupply);
    const lpFee = new BigNumber(storageResponse.lpFee);

    const lpToken = AMM[dexContractAddress].lpToken;

    let tokenInSupply = new BigNumber(0);
    let tokenOutSupply = new BigNumber(0);
    if (tokenOut === AMM[dexContractAddress].token2.symbol) {
      tokenOutSupply = token2Pool;
      tokenInSupply = token1Pool;
    } else if (tokenOut === AMM[dexContractAddress].token1.symbol) {
      tokenOutSupply = token1Pool;
      tokenInSupply = token2Pool;
    }

    tokenInSupply = tokenInSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
    tokenOutSupply = tokenOutSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    lpTokenSupply = lpTokenSupply.dividedBy(new BigNumber(10).pow(lpToken.decimals));

    const exchangeFee = new BigNumber(1).dividedBy(lpFee);

    return {
      success: true,
      tokenIn,
      tokenInSupply,
      tokenOut,
      tokenOutSupply,
      exchangeFee,
      lpTokenSupply,
      lpToken,
    };
  } catch (error) {
    console.log({ message: "Tez pair swap data error", error });
    return {
      success: true,
      tokenIn,
      tokenInSupply: new BigNumber(0),
      tokenOut,
      tokenOutSupply: new BigNumber(0),
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
    };
  }
};
