import { AMM_TYPE } from "../../config/types";
import { getDexType } from "../util/fetchConfig";
import {
  calculateTokensInGeneralStable,
  calculateTokensInTezCtez,
  calculateTokensOutGeneralStable,
  calculateTokensOutTezCtez,
  loadSwapDataGeneralStable,
  loadSwapDataTezCtez,
} from "./stableswap";
import { calculateTokenInputVolatile, calculateTokenOutputVolatile, loadSwapDataVolatile } from "./volatile";
import { BigNumber } from "bignumber.js";
import { ISwapDataResponse, ICalculateTokenResponse, IRouterResponse } from "./types";
import { computeAllPaths, computeAllPathsReverse } from "./router";
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

export const calculateTokensInWrapper = (
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
      outputData = calculateTokenInputVolatile(
        tokenInAmount,
        tokenInSupply,
        tokenOutSupply,
        Exchangefee,
        slippage,
        tokenIn,
        tokenOut
      );
    } else {
      if (tokenIn === "tez" && tokenOut === "ctez" && target) {
        outputData = calculateTokensInTezCtez(
          tokenInSupply,
          tokenOutSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenIn === "ctez" && tokenOut === "tez" && target) {
        outputData = calculateTokensInTezCtez(
          tokenOutSupply,
          tokenInSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenInSupply && tokenOutSupply && tokenInPrecision && tokenOutPrecision) {
        outputData = calculateTokensInGeneralStable(
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

    for (var y of bestPath.feePerc) {
      finalFeePerc = finalFeePerc.plus(y);
    }

    for( var z = 0 ; z < bestPath.path.length-1 ; z++){
      const dexType = getDexType(bestPath.path[z] , bestPath.path[z+1]);
      if(dexType === AMM_TYPE.STABLE) isStable.push(true);
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

export const computeReverseCalculationWrapper = (
  paths: string[],
  tokenInAmount: BigNumber,
  slippage: BigNumber,
  swapData: ISwapDataResponse[][],
  tokenPrice: { [id: string]: number },
  paths2 : string[],
  swapData2 : ISwapDataResponse[][]
): IRouterResponse => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    const bestPath = computeAllPathsReverse(paths, tokenInAmount, slippage, swapData);
    let temp = computeAllPaths(paths2 , bestPath.tokenOutAmount , slippage , swapData2);

    //BINARY SEARCH FOR USER AMOUNT
    let low = bestPath.tokenOutAmount;
    while(temp.tokenOutAmount.isGreaterThan(tokenInAmount) && temp.tokenOutAmount.isGreaterThan(new BigNumber(0))){
      low = low.minus(1);
      temp = computeAllPaths(paths2 , low , slippage , swapData2);
    }
    
    let high = low.plus(1);
    let mid = new BigNumber(0);

    const path = paths[0].split(" ");
    const tokenIn = path[0];
    const tokenInData = TOKEN[tokenIn];

    while(low.isLessThanOrEqualTo(high)){
      mid = (low.plus(high)).dividedBy(2).decimalPlaces(tokenInData.decimals , 1);
      let currAns = computeAllPaths(paths2 , mid , slippage , swapData2);

      if(currAns.tokenOutAmount.isEqualTo(tokenInAmount)){
        break;
      }
      else if(tokenInAmount.isGreaterThan(currAns.tokenOutAmount)){
        low = mid.plus(new BigNumber(1).dividedBy(new BigNumber(10).pow(tokenInData.decimals)));
      }else{
        high = mid.minus(new BigNumber(1).dividedBy(new BigNumber(10).pow(tokenInData.decimals)));
      }

    } 


    const forwardPass = computeAllPaths(paths2 , mid , slippage , swapData2);

    const isStable: boolean[] = [];
    let finalPriceImpact = new BigNumber(0);
    let finalFeePerc = new BigNumber(0);

    for (var x of forwardPass.priceImpact) {
      finalPriceImpact = finalPriceImpact.plus(x);
    }

    for (var x of forwardPass.feePerc) {
      finalFeePerc = finalFeePerc.plus(x);
    }

    for( var z = 0 ; z < forwardPass.path.length-1 ; z++){
      const dexType = getDexType(forwardPass.path[z] , forwardPass.path[z+1]);
      if(dexType === AMM_TYPE.STABLE) isStable.push(true);
      else isStable.push(false);
    }

    const exchangeRate = new BigNumber(
      new BigNumber(tokenPrice[forwardPass.path[0]]).dividedBy(
        tokenPrice[forwardPass.path[forwardPass.path.length - 1]]
      )
    ).decimalPlaces(TOKEN[forwardPass.path[forwardPass.path.length - 1]].decimals);

    return {
      path: forwardPass.path,
      tokenOutAmount: mid,
      userFinalTokenOut : forwardPass.tokenOutAmount,
      finalMinimumTokenOut: forwardPass.minimumTokenOut[forwardPass.minimumTokenOut.length - 1],
      minimumTokenOut: forwardPass.minimumTokenOut,
      finalPriceImpact: finalPriceImpact,
      finalFeePerc: finalFeePerc,
      feePerc: forwardPass.feePerc,
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


/**
 * @deprecated Remove when computeReverseCalculationWrapper is in place
 */
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

export const topTokenListGhostnet = async (): Promise<{
  success: boolean;
  topTokens: { [id: string]: number };
}> => {
  try {
    const topTokens: { [id: string]: number } = {};

    topTokens['tez']=0;
    topTokens['ctez']=1;
    topTokens['USDC.e']=2;
    topTokens['USDT.e']=3;
    topTokens['USDtz']=4;
    topTokens['DAI.e']=5;
    topTokens['WBTC.e']=6;
    topTokens['LINK.e']=7;

    return {
      success: true,
      topTokens: topTokens,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      topTokens: {},
    };
  }
};