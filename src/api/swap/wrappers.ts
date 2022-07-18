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

// TEST Wrappers

// Try to incorporate return type
export const loadSwapDataWrapper = async (
  tokenIn: string,
  tokenOut: string
): Promise<any> => {
  console.log(tokenIn, tokenOut);
  try {
    const type = getDexType(tokenIn, tokenOut);
    let swapData: any;
    console.log(type);
    if (type === AMM_TYPE.VOLATILE) {
      swapData = loadSwapDataVolatile(tokenIn, tokenOut);
    } else if (type === AMM_TYPE.STABLE) {
      if (
        (tokenIn === 'tez' && tokenOut === 'ctez') ||
        (tokenIn === 'ctez' && tokenOut === 'tez')
      ) {
        swapData = loadSwapDataTezCtez(tokenIn, tokenOut);
      } else {
        swapData = loadSwapDataGeneralStable(tokenIn, tokenOut);
      }
    }
    return swapData;
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return null;
  }
};

// Try to incorporate return type
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
): any => {
  try {
    const type = getDexType(tokenIn, tokenOut);
    let outputData: any;

    if (type === AMM_TYPE.VOLATILE && tokenIn_supply && tokenOut_supply) {
      outputData = calculateTokenOutputVolatile(
        tokenIn_amount,
        tokenIn_supply,
        tokenOut_supply,
        Exchangefee,
        slippage
      );
    } else if (type === AMM_TYPE.STABLE) {
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
    }
    return outputData;
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return null;
  }
};
