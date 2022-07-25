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
import { ISwapDataResponse , ICalculateTokenResponse } from './types'

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
      // Ask Kiran once 
      else{
        outputData = {
          tokenOut_amount: new BigNumber(0),
          fees: new BigNumber(0),
          feePerc : new BigNumber(0),
          minimum_Out: new BigNumber(0),
          exchangeRate: new BigNumber(0),
          priceImpact: new BigNumber(0),
        };
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
