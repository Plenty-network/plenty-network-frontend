import { AMM_TYPE } from "../../config/types";
import { getDexType } from "../util/fetchConfig";
import {
  calculateTokensOutGeneralStable,
  calculateTokensOutTezCtez,
  loadSwapDataGeneralStable,
  loadSwapDataTezCtez,
} from "./stableswap";
import { calculateTokenOutputVolatile, loadSwapDataVolatile } from "./volatile";
import { BigNumber } from "bignumber.js";
import { ISwapDataResponse, ICalculateTokenResponse, IRouterResponse } from "./types";
import { computeAllPaths } from "./router";
import { store } from "../../redux";
import axios from "axios";
import Config from "../../config/config";

export const loadSwapDataWrapper = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const type = getDexType(tokenIn, tokenOut);
    let swapData: ISwapDataResponse;

    if (type === AMM_TYPE.VOLATILE) {
      swapData = await loadSwapDataVolatile(tokenIn, tokenOut);
    } else {
      if (
        (tokenIn === "tez" && tokenOut === "ctez") ||
        (tokenIn === "ctez" && tokenOut === "tez")
      ) {
        swapData = await loadSwapDataTezCtez(tokenIn, tokenOut);
      } else {
        swapData = await loadSwapDataGeneralStable(tokenIn, tokenOut);
      }
    }
    return swapData;
  } catch (error) {
    console.log({ message: "swap data error", error });
    return {
      success: false,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      tokenInSupply: new BigNumber(0),
      tokenOutSupply: new BigNumber(0),
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
    };
  }
};

export const calculateTokensOutWrapper = (
  tokenInAmount: BigNumber,
  Exchangefee: BigNumber,
  slippage: BigNumber,
  tokenIn: string,
  tokenOut: string,
  tokenInSupply: BigNumber,
  tokenOutSupply: BigNumber,
  tokenInPrecision?: BigNumber,
  tokenOutPrecision?: BigNumber,
  target?: BigNumber
): ICalculateTokenResponse => {
  try {
    const type = getDexType(tokenIn, tokenOut);
    let outputData: ICalculateTokenResponse;

    if (type === AMM_TYPE.VOLATILE && tokenInSupply && tokenOutSupply) {
      outputData = calculateTokenOutputVolatile(
        tokenInAmount,
        tokenInSupply,
        tokenOutSupply,
        Exchangefee,
        slippage,
        tokenOut
      );
    } else {
      if (tokenIn === "tez" && tokenOut === "ctez" && target) {
        outputData = calculateTokensOutTezCtez(
          tokenInSupply,
          tokenOutSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenIn === "ctez" && tokenOut === "tez" && target) {
        outputData = calculateTokensOutTezCtez(
          tokenOutSupply,
          tokenInSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenInSupply && tokenOutSupply && tokenInPrecision && tokenOutPrecision) {
        outputData = calculateTokensOutGeneralStable(
          tokenInSupply,
          tokenOutSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          tokenIn,
          tokenOut,
          tokenInPrecision,
          tokenOutPrecision
        );
      } else {
        throw new Error("Invalid Parameter");
      }
    }

    return outputData;
  } catch (error) {
    console.log({ message: "swap data error", error });
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc: new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error,
    };
  }
};

export const computeAllPathsWrapper = (
  paths: string[],
  tokenInAmount: BigNumber,
  slippage: BigNumber,
  swapData: ISwapDataResponse[][],
  tokenPrice: { [id: string]: number }
): IRouterResponse => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    const bestPath = computeAllPaths(paths, tokenInAmount, slippage, swapData);

    const isStable: boolean[] = [];
    let finalPriceImpact = new BigNumber(0);
    let finalFeePerc = new BigNumber(0);

    for (var x of bestPath.priceImpact) {
      finalPriceImpact = finalPriceImpact.plus(x);
    }

    for (var x of bestPath.feePerc) {
      finalFeePerc = finalFeePerc.plus(x);
      if (x.isEqualTo(new BigNumber(0.1))) isStable.push(true);
      else isStable.push(false);
    }

    const exchangeRate = new BigNumber(
      new BigNumber(tokenPrice[bestPath.path[0]]).dividedBy(
        tokenPrice[bestPath.path[bestPath.path.length - 1]]
      )
    ).decimalPlaces(TOKEN[bestPath.path[bestPath.path.length - 1]].decimals);

    return {
      path: bestPath.path,
      tokenOutAmount: bestPath.tokenOutAmount,
      finalMinimumTokenOut: bestPath.minimumTokenOut[bestPath.minimumTokenOut.length - 1],
      minimumTokenOut: bestPath.minimumTokenOut,
      finalPriceImpact: finalPriceImpact,
      finalFeePerc: finalFeePerc,
      feePerc: bestPath.feePerc,
      isStable: isStable,
      exchangeRate: exchangeRate,
    };
  } catch (error) {
    console.log(error);
    return {
      path: [],
      tokenOutAmount: new BigNumber(0),
      finalMinimumTokenOut: new BigNumber(0),
      minimumTokenOut: [],
      finalPriceImpact: new BigNumber(0),
      finalFeePerc: new BigNumber(0),
      feePerc: [],
      isStable: [],
      exchangeRate: new BigNumber(0),
    };
  }
};

// TODO : Check this api for large amounts
export const reverseCalculation = (
  tokenIn: string,
  tokenOut: string,
  paths: string[],
  tokenOutAmount: BigNumber,
  slippage: BigNumber,
  swapData: ISwapDataResponse[][],
  tokenPrice: { [id: string]: number }
) => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    let tokenInAmount = new BigNumber(Infinity);

    for (var i in paths) {
      const path = paths[i].split(" ");
      const tempAmountIn = new BigNumber(
        tokenOutAmount
          .multipliedBy(tokenPrice[path[path.length - 1]])
          .dividedBy(tokenPrice[path[0]])
      );
      if (tempAmountIn.isLessThan(tokenInAmount)) {
        tokenInAmount = tempAmountIn.decimalPlaces(TOKEN[path[0]].decimals, 1);
      }
    }

    const priceDifferential = new BigNumber(tokenPrice[tokenOut]).minus(tokenPrice[tokenIn]).abs();

    // Round Up Works in general case
    tokenInAmount = new BigNumber(tokenInAmount.toFixed(5, BigNumber.ROUND_UP));
    let res = computeAllPathsWrapper(paths, tokenInAmount, slippage, swapData, tokenPrice);

    // For high value and precision tokens
    let counter = 0;
    // max 100 iterations
    while (res.tokenOutAmount.isLessThan(tokenOutAmount) && counter <= 100) {
      counter++;
      // Token with high price differential need higher plus factor
      if (priceDifferential.isGreaterThan(1000)) {
        tokenInAmount = tokenInAmount.plus(1);
      } else {
        tokenInAmount = tokenInAmount.plus(0.01);
      }
      res = computeAllPathsWrapper(paths, tokenInAmount, slippage, swapData, tokenPrice);
    }

    let insufficientLiquidity = false;
    if (res.tokenOutAmount.isLessThan(tokenOutAmount)) insufficientLiquidity = true;

    return {
      path: res.path,
      tokenInAmount: tokenInAmount,
      tokenOutAmount: res.tokenOutAmount,
      finalMinimumTokenOut: res.finalMinimumTokenOut,
      minimumTokenOut: res.minimumTokenOut,
      finalPriceImpact: res.finalPriceImpact,
      finalFeePerc: res.finalFeePerc,
      feePerc: res.feePerc,
      isStable: res.isStable,
      exchangeRate: res.exchangeRate,
      insufficientLiquidity: insufficientLiquidity,
    };
  } catch (error) {
    console.log(error);
    return {
      path: [],
      tokenInAmount: new BigNumber(0),
      tokenOutAmount: new BigNumber(0),
      finalMinimumTokenOut: new BigNumber(0),
      minimumTokenOut: [],
      finalPriceImpact: new BigNumber(0),
      finalFeePerc: new BigNumber(0),
      feePerc: [],
      isStable: [],
      exchangeRate: new BigNumber(0),
      insufficientLiquidity: false,
    };
  }
};

export const topTokensList = async (): Promise<{
  success: boolean;
  topTokens: { [id: string]: number };
}> => {
  try {
    const tokenTvlResponse = await axios.get(`${Config.PLY_INDEXER}analytics/tokens`);
    const tokenTvl = tokenTvlResponse.data;
    const topTokens: { [id: string]: number } = {};

    for (var x of tokenTvl) {
      topTokens[x.token] = Number(x.tvl.value);
    }

    const sortable = Object.entries(topTokens)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    return {
      success: true,
      topTokens: sortable,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      topTokens: {},
    };
  }
};
