import { getLpTokenSymbol } from '../util/fetchConfig';
import { BigNumber } from "bignumber.js";
import {
  ICurrentPoolShareResponse,
  IOtherTokenOutput,
  IOutputTokensAmountResponse,
  IPnlpBalanceResponse,
  IPnlpEstimateResponse,
  IPnlpPoolShareResponse,
} from "./types";
import { getUserBalanceByRpc } from "../util/balance";

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
 * @param lpToken - (Optional) Symbol of the LP token for the given pair if known/available.
 */
export const getPnlpBalance = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  lpToken?: string
): Promise<IPnlpBalanceResponse> => {
  try {
    const lpTokenSymbol = lpToken ? lpToken : getLpTokenSymbol(tokenOneSymbol, tokenTwoSymbol);
    if (lpTokenSymbol) {
      const lpTokenBalance = await getUserBalanceByRpc(
        lpTokenSymbol,
        userTezosAddress
      );
      if (lpTokenBalance.success) {
        return {
          success: true,
          lpToken: lpTokenSymbol,
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

    tokenOneAmount = tokenOneAmount.minus(
      new BigNumber(slippage).multipliedBy(tokenOneAmount).dividedBy(100)
    );
    tokenTwoAmount = tokenTwoAmount.minus(
      new BigNumber(slippage).multipliedBy(tokenTwoAmount).dividedBy(100)
    );

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

/**
 * Returns the current pool share percentage for the user for given pair of tokens.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param userTezosAddress - Tezos wallet address of the user
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 * @param lpToken - (Optional) Symbol of the LP token for the given pair if known/available
 */
export const getCurrentPoolShare = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  lpTokenSupply: string | BigNumber,
  lpToken?: string
): Promise<ICurrentPoolShareResponse> => {
  try {
    const lpBalanceResult = await getPnlpBalance(
      tokenOneSymbol,
      tokenTwoSymbol,
      userTezosAddress,
      lpToken
    );
    if (lpBalanceResult.success) {
      const currentPoolShare = new BigNumber(lpBalanceResult.balance)
        .multipliedBy(100)
        .dividedBy(lpTokenSupply)
        .toString();
      return {
        success: true,
        currentPoolShare,
        balance: lpBalanceResult.balance,
      };
    } else {
      throw new Error(lpBalanceResult.error);
    }
  } catch (err: any) {
    return {
      success: false,
      currentPoolShare: "0",
      balance: "0",
      error: err.message,
    };
  }
};

/**
 * Returns the share of pool (percentage) for the amount of PNLP token which will be received or which is to be removed.
 * @param pnlpAmount - PNLP token amount to be received or removed by the user for a given pair, which is calculated while adding and user input while removing
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 */
export const getPoolShareForPnlp = (
  pnlpAmount: string | BigNumber,
  lpTokenSupply: string | BigNumber
): IPnlpPoolShareResponse => {
  try {
    const pnlpPoolShare = new BigNumber(pnlpAmount).multipliedBy(100).dividedBy(lpTokenSupply).toString();
    return {
      success: true,
      pnlpPoolShare,
    }
  } catch (error: any) {
    return {
      success: false,
      pnlpPoolShare: '0',
      error: error.message,
    };
  }
};