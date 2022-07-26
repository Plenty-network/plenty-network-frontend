import { AMM_TYPE } from '../../config/types';
import { getDexType } from '../util/fetchConfig';
import {
  calculateTokensOutGeneralStable,
  calculateTokensOutTezCtez,
  loadSwapDataGeneralStable,
  loadSwapDataTezCtez,
} from './stableswap';
import { calculateTokenOutputVolatile, loadSwapDataVolatile } from './volatile';
import { BigNumber } from 'bignumber.js';
import { ISwapDataResponse , ICalculateTokenResponse, IRouterResponse } from './types'
import { computeAllPaths } from './router'
import { store } from '../../redux';

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
        (tokenIn === 'tez' && tokenOut === 'ctez') ||
        (tokenIn === 'ctez' && tokenOut === 'tez')
      ) {
        swapData = await loadSwapDataTezCtez(tokenIn, tokenOut);
      } else {
        swapData = await loadSwapDataGeneralStable(tokenIn, tokenOut);
      }
    }
    return swapData;
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return {
      success: false,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
    }
  }
};

export const calculateTokensOutWrapper = (
  tokenIn_amount: BigNumber,
  Exchangefee: BigNumber,
  slippage: BigNumber,
  tokenIn: string,
  tokenOut: string,
  tokenIn_supply?: BigNumber,
  tokenOut_supply?: BigNumber,
  tokenIn_precision?: BigNumber,
  tokenOut_precision?: BigNumber,
  tezSupply?: BigNumber,
  ctezSupply?: BigNumber,
  target?: BigNumber
) : ICalculateTokenResponse => {
  try {
    const type = getDexType(tokenIn, tokenOut);
    let outputData: ICalculateTokenResponse;

    if (type === AMM_TYPE.VOLATILE && tokenIn_supply && tokenOut_supply) {
      outputData = calculateTokenOutputVolatile(
        tokenIn_amount,
        tokenIn_supply,
        tokenOut_supply,
        Exchangefee,
        slippage,
        tokenOut
      );
    } else{
      if (
        ((tokenIn === 'tez' && tokenOut === 'ctez') ||
          (tokenIn === 'ctez' && tokenOut === 'tez')) &&
        tezSupply &&
        ctezSupply &&
        target
      ) {
        outputData = calculateTokensOutTezCtez(
          tezSupply,
          ctezSupply,
          tokenIn_amount,
          Exchangefee,
          slippage,
          target,
          tokenIn
        );
      } else if (
        tokenIn_supply &&
        tokenOut_supply &&
        tokenIn_precision &&
        tokenOut_precision
      ) {
        outputData = calculateTokensOutGeneralStable(
          tokenIn_supply,
          tokenOut_supply,
          tokenIn_amount,
          Exchangefee,
          slippage,
          tokenIn,
          tokenOut,
          tokenIn_precision,
          tokenOut_precision
        );
      }
      else{
        throw "Invalid Parameter";
      }
    }

    return outputData;
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return {
      tokenOut_amount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimum_Out: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error
    };
  }
};

export const computeAllPathsWrapper = (
  paths: string[],
  tokenIn_amount: BigNumber,
  slippage: BigNumber,
  swapData: ISwapDataResponse[][],
  tokenPrice : { [id: string] : number; },
): IRouterResponse => {
  try {
      const bestPath = computeAllPaths(paths, tokenIn_amount, slippage, swapData);

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

      const exchangeRate = new BigNumber(tokenPrice[bestPath.path[0]] / tokenPrice[bestPath.path[bestPath.path.length-1]]);

      return {
          path: bestPath.path,
          tokenOut_amount: bestPath.tokenOut_amount,
          finalMinimumTokenOut:
          bestPath.minimumTokenOut[bestPath.minimumTokenOut.length - 1],
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
          tokenOut_amount: new BigNumber(0),
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
export const reverseCalculation = (tokenIn :  string , tokenOut : string ,paths : string[], tokenOutAmount : BigNumber , slippage : BigNumber , swapData : ISwapDataResponse[][], tokenPrice : { [id: string] : number; }) => {

    try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    let tokenInAmount = new BigNumber(Infinity);

    for (var i in paths){
      const path = paths[i].split(" ");
      const tempAmountIn = new BigNumber(tokenOutAmount.multipliedBy(tokenPrice[path[path.length-1]]).dividedBy(tokenPrice[path[0]]));
      if(tempAmountIn.isLessThan(tokenInAmount)){
        tokenInAmount = tempAmountIn.decimalPlaces(TOKEN[path[0]].decimals);
      }
    }

    const priceDifferential = new BigNumber(Math.abs(tokenPrice[tokenOut] - tokenPrice[tokenIn]));

    // Round Up Works in general case
    tokenInAmount = new BigNumber(tokenInAmount.toFixed(5 , BigNumber.ROUND_UP));
    let res = computeAllPathsWrapper(paths, tokenInAmount, slippage, swapData , tokenPrice);

    // For high value and precision tokens
    let counter = 0;
    // max 100 iterations
    while(res.tokenOut_amount.isLessThan(tokenOutAmount) && counter<=100){
      counter++;
      console.log(counter);
      // Token with high price differential need higher plus factor
      if(priceDifferential.isGreaterThan(1000)){
      tokenInAmount = tokenInAmount.plus(1);}
      else{
      tokenInAmount = tokenInAmount.plus(0.01);}
      console.log(tokenInAmount.toString());
      res = computeAllPathsWrapper(paths, tokenInAmount, slippage, swapData , tokenPrice);
    }

    let insufficientLiquidity = false;
    if(res.tokenOut_amount.isLessThan(tokenOutAmount))
    insufficientLiquidity = true;
    

    return {
      path: res.path,
      tokenIn_amount : tokenInAmount,
      tokenOut_amount: res.tokenOut_amount,
      finalMinimumTokenOut: res.finalMinimumTokenOut,
      minimumTokenOut: res.minimumTokenOut,
      finalPriceImpact: res.finalPriceImpact,
      finalFeePerc: res.finalFeePerc,
      feePerc: res.feePerc,
      isStable: res.isStable,
      exchangeRate: res.exchangeRate,
      insufficientLiquidity : insufficientLiquidity,
  };
    
    } catch (error) {
      console.log(error);
      return {
          path: [],
          tokenIn_amount : new BigNumber(0),
          tokenOut_amount: new BigNumber(0),
          finalMinimumTokenOut: new BigNumber(0),
          minimumTokenOut: [],
          finalPriceImpact: new BigNumber(0),
          finalFeePerc: new BigNumber(0),
          feePerc: [],
          isStable: [],
          exchangeRate: new BigNumber(0),
          insufficientLiquidity : false,
      };
      
    }
   
  
}