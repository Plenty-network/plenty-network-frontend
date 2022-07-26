import { AMM_TYPE } from '../../config/types';
import { getDexType, getLpTokenSymbol } from '../util/fetchConfig';
import { BigNumber } from 'bignumber.js';
import { IOtherTokenOutput, IOutputTokensAmountResponse, IPnlpBalanceResponse, IPnlpEstimateResponse } from './types';
import { getUserBalanceByRpc } from '../util/balance';

/**
 * Estimate the other token amount while adding liquidity.
 * @param inputTokenAmount - Amount entered for a token.
 * @param inputTokenSupply - Supply value for the token, for which amount is input.
 * @param otherTokenSupply - Supply value for the token, for which amount is to be estimated.
 */
export const estimateOtherTokenAmount = (
  inputTokenAmount: string | BigNumber,
  inputTokenSupply: string | BigNumber,
  otherTokenSupply: string | BigNumber
): IOtherTokenOutput => {
  try {
    const otherTokenAmount = new BigNumber(inputTokenAmount)
      .multipliedBy(otherTokenSupply)
      .dividedBy(inputTokenSupply)
      .toString();
    return {
      success: true,
      otherTokenAmount,
    };
  } catch (error: any) {
    return {
      success: false,
      otherTokenAmount: '0',
      error: error.message,
    };
  }
};

/**
 * Returns the symbol and user balance of the LP token for the given pair of tokens.
 * @param tokenOneSymbol - Symbol of token one of the pair.
 * @param tokenTwoSymbol - Symbol of token two of the pair.
 * @param userTezosAddress - Tezos wallet address of the user.
 */
export const getPnlpBalance = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string
): Promise<IPnlpBalanceResponse> => {
  try {
    const lpTokenSymbol = getLpTokenSymbol(tokenOneSymbol, tokenTwoSymbol);
    if (lpTokenSymbol) {
      const lpTokenBalance = await getUserBalanceByRpc(
        lpTokenSymbol,
        userTezosAddress
      );
      if (lpTokenBalance.success) {
        return {
          success: true,
          lpToken: "",
          balance: lpTokenBalance.balance.toString(),
        };
      } else {
        throw new Error(lpTokenBalance.error?.message);
      }
    } else {
      throw new Error("LP token not found for the given pairs.");
    }
  } catch (err: any) {
    return {
      success: false,
      lpToken: "",
      balance: "0",
      error: err.message,
    };
  }
};

/**
 * Returns the estimated PNLP amount the user will get for adding liquidity of selected pair.
 * @param tokenOneAmount - Amount of the first token of the selected pair
 * @param tokenTwoAmount - Amount of the second token of the selected pair
 * @param tokenOneSupply - Total supply of the first token of the selected pair
 * @param tokenTwoSupply - Total supply of the second token of the selected pair
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 */
export const getPnlpOutputEstimate = (
  tokenOneAmount: string | BigNumber,
  tokenTwoAmount: string | BigNumber,
  tokenOneSupply: string | BigNumber,
  tokenTwoSupply: string | BigNumber,
  lpTokenSupply: string | BigNumber
): IPnlpEstimateResponse => {
  try {
    const pnlpBasedOnTokenOne = new BigNumber(tokenOneAmount)
      .multipliedBy(lpTokenSupply)
      .dividedBy(tokenOneSupply);
    const pnlpBasedOnTokenTwo = new BigNumber(tokenTwoAmount)
      .multipliedBy(lpTokenSupply)
      .dividedBy(tokenTwoSupply);
    const pnlpEstimatedOutput = pnlpBasedOnTokenOne.isLessThan(
      pnlpBasedOnTokenTwo
    )
      ? pnlpBasedOnTokenOne
      : pnlpBasedOnTokenTwo;
    return {
      success: true,
      pnlpEstimate: pnlpEstimatedOutput.toString(),
    };
  } catch (error: any) {
    return {
      success: false,
      pnlpEstimate: "0",
      error: error.message,
    };
  }
};

/**
 * Returns the computed token one and token two amounts for the amount of LP token user burns.
 * @param burnAmount - Amount of LP token the user wants to burn
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param tokenOneSupply - Total supply of the first token of the selected pair
 * @param tokenTwoSupply - Total supply of the second token of the selected pair
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 * @param slippage - Amount of slippage user can tolerate, defaults to 0.5 if no input provided 
 */
export const getOutputTokensAmount = (
  burnAmount: string | BigNumber,
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneSupply: string | BigNumber,
  tokenTwoSupply: string | BigNumber,
  lpTokenSupply: string | BigNumber,
  slippage: string | BigNumber = "0.5"
): IOutputTokensAmountResponse => {
  try {
    let tokenOneAmount = new BigNumber(burnAmount)
      .multipliedBy(tokenOneSupply)
      .dividedBy(lpTokenSupply);
    let tokenTwoAmount = new BigNumber(burnAmount)
      .multipliedBy(tokenTwoSupply)
      .dividedBy(lpTokenSupply);

    // Check if its a non tez-ctez pair and calculate slippage if so.
    if (tokenOneSymbol !== "tez" && tokenTwoSymbol !== "tez") {
      tokenOneAmount = tokenOneAmount.minus(
        new BigNumber(slippage).multipliedBy(tokenOneAmount).dividedBy(100)
      );
      tokenTwoAmount = tokenTwoAmount.minus(
        new BigNumber(slippage).multipliedBy(tokenTwoAmount).dividedBy(100)
      );
    }
    return {
      success: true,
      tokenOneAmount: tokenOneAmount.toString(),
      tokenTwoAmount: tokenTwoAmount.toString(),
    };
  } catch (error: any) {
    return {
      success: false,
      tokenOneAmount: "0",
      tokenTwoAmount: "0",
      error: error.message,
    };
  }
};