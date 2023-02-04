import { PoolType } from "../../config/types";
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
import { connectedNetwork } from "../../common/walletconnect";

export const loadSwapDataWrapper = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const type = getDexType(tokenIn, tokenOut);
    let swapData: ISwapDataResponse;

    if (type === PoolType.VOLATILE) {
      swapData = await loadSwapDataVolatile(tokenIn, tokenOut);
    } else {
      if (
        (tokenIn === "XTZ" && tokenOut === "CTez") ||
        (tokenIn === "CTez" && tokenOut === "XTZ")
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

    if (type === PoolType.VOLATILE && tokenInSupply && tokenOutSupply) {
      outputData = calculateTokenOutputVolatile(
        tokenInAmount,
        tokenInSupply,
        tokenOutSupply,
        Exchangefee,
        slippage,
        tokenOut
      );
    } else {
      if (tokenIn === "XTZ" && tokenOut === "CTez" && target) {
        outputData = calculateTokensOutTezCtez(
          tokenInSupply,
          tokenOutSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenIn === "CTez" && tokenOut === "XTZ" && target) {
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

    if (type === PoolType.VOLATILE && tokenInSupply && tokenOutSupply) {
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
      if (tokenIn === "XTZ" && tokenOut === "CTez" && target) {
        outputData = calculateTokensInTezCtez(
          tokenInSupply,
          tokenOutSupply,
          tokenInAmount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (tokenIn === "CTez" && tokenOut === "XTZ" && target) {
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
    const TOKEN = state.config.tokens;

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
      if(dexType === PoolType.STABLE) isStable.push(true);
      else isStable.push(false);
    }

    // const exchangeRate = new BigNumber(
    //   new BigNumber(tokenPrice[bestPath.path[0]]).dividedBy(
    //     tokenPrice[bestPath.path[bestPath.path.length - 1]]
    //   )
    // ).decimalPlaces(TOKEN[bestPath.path[bestPath.path.length - 1]].decimals);

    const exchangeRate = bestPath.tokenOutAmount.dividedBy(tokenInAmount);

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
    const TOKEN = state.config.tokens;
    console.log("tokenIn", tokenInAmount.toString());
    const bestPath = computeAllPathsReverse(paths, tokenInAmount, slippage, swapData);
    let temp = computeAllPaths(paths2 , bestPath.tokenOutAmount , slippage , swapData2);

    const path = paths2[0].split(" ");
    const tokenIn = path[0];
    const tokenInData = TOKEN[tokenIn];

    //BINARY SEARCH FOR USER AMOUNT
    let low = bestPath.tokenOutAmount;
    while(temp.tokenOutAmount.isGreaterThan(tokenInAmount) && temp.tokenOutAmount.isGreaterThan(new BigNumber(0))){
      console.log("low1 - ", low.toString());
      // if(low.minus(0.1).isLessThan(0)) {
      //   break;
      // }
      low = low.minus(1);
      if(low.isLessThan(0)) {
        // low = low.plus(1);
        low = new BigNumber(1).dividedBy(new BigNumber(10).pow(tokenInData.decimals));
        break;
      }
      temp = computeAllPaths(paths2 , low , slippage , swapData2);
    }
    
    let high = low.plus(1);
    // console.log(low.toString(), high.toString());
    let mid = new BigNumber(0);

    // const path = paths2[0].split(" ");
    // const tokenIn = path[0];
    // const tokenInData = TOKEN[tokenIn];
    console.log("low - ",low.toString(),"high - ", high.toString());
    while(low.isLessThanOrEqualTo(high)){
      mid = (low.plus(high)).dividedBy(2).decimalPlaces(tokenInData.decimals , 1);
      console.log("mid", mid.toString());
      let currAns = computeAllPaths(paths2 , mid , slippage , swapData2);
      console.log("currAns", currAns.tokenOutAmount.toString());
      if(currAns.tokenOutAmount.isEqualTo(tokenInAmount)){
        break;
      }
      else if(tokenInAmount.isGreaterThan(currAns.tokenOutAmount)){
        low = mid.plus(new BigNumber(1).dividedBy(new BigNumber(10).pow(tokenInData.decimals)));
      }else{
        high = mid.minus(new BigNumber(1).dividedBy(new BigNumber(10).pow(tokenInData.decimals)));
      }
      console.log("low - ",low.toString(),"high - ", high.toString());
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
      if(dexType === PoolType.STABLE) isStable.push(true);
      else isStable.push(false);
    }

    // const exchangeRate = new BigNumber(
    //   new BigNumber(tokenPrice[forwardPass.path[0]]).dividedBy(
    //     tokenPrice[forwardPass.path[forwardPass.path.length - 1]]
    //   )
    // ).decimalPlaces(TOKEN[forwardPass.path[forwardPass.path.length - 1]].decimals);

    const exchangeRate = tokenInAmount.dividedBy(mid);

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

export const topTokensList = async (): Promise<{
  success: boolean;
  topTokens: { [id: string]: number };
}> => {
  try {
    const tokenTvlResponse = await axios.get(`${Config.PLY_INDEXER[connectedNetwork]}analytics/tokens`);
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

/**
 * @deprecated
 */
export const topTokenListGhostnet = async (): Promise<{
  success: boolean;
  topTokens: { [id: string]: number };
}> => {
  try {
    const topTokens: { [id: string]: number } = {};

    topTokens['XTZ']=0;
    topTokens['CTez']=1;
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