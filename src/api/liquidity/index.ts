import { getDexAddress, isCtezTezPair } from '../util/fetchConfig';
import { BigNumber } from "bignumber.js";
import {
  ELiquidityProcess,
  ICurrentPoolShareResponse,
  IOtherTokenOutput,
  IOutputTokensAmountResponse,
  IPnlpEstimateResponse,
  IPnlpPoolShareResponse,
} from "./types";
import { getPnlpBalance } from "../util/balance";
import { store } from '../../redux';

/**
 * Estimate the other token amount while adding liquidity.
 * @param inputTokenAmount - Amount entered for a token.
 * @param inputTokenSupply - Supply value for the token, for which amount is input.
 * @param otherTokenSupply - Supply value for the token, for which amount is to be estimated.
 * @param otherTokenSymbol - Symbol of the other token, for which amount is to be estimated.
 */
export const estimateOtherTokenAmount = (
  inputTokenAmount: string | BigNumber,
  inputTokenSupply: string | BigNumber,
  otherTokenSupply: string | BigNumber,
  otherTokenSymbol: string,
): IOtherTokenOutput => {
  try {
    const TOKENS = store.getState().config.tokens;
    const otherTokenAmount = new BigNumber(inputTokenAmount)
      .multipliedBy(otherTokenSupply)
      .dividedBy(inputTokenSupply)
      .decimalPlaces(TOKENS[otherTokenSymbol].decimals,1)   // 1 - Rounding down
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
 * Returns the estimated PNLP amount the user will get for adding liquidity of selected pair.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param tokenOneAmount - Amount of the first token of the selected pair
 * @param tokenTwoAmount - Amount of the second token of the selected pair
 * @param tokenOneSupply - Total supply of the first token of the selected pair
 * @param tokenTwoSupply - Total supply of the second token of the selected pair
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 */
export const getPnlpOutputEstimate = (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneAmount: string | BigNumber,
  tokenTwoAmount: string | BigNumber,
  tokenOneSupply: string | BigNumber,
  tokenTwoSupply: string | BigNumber,
  lpTokenSupply: string | BigNumber
): IPnlpEstimateResponse => {
  try {
    const ammAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (ammAddress === "false") {
      throw new Error("No pool found for the given pair of tokens");
    }
    const LP_TOKEN = store.getState().config.AMMs[ammAddress].lpToken;

    let pnlpEstimatedOutput: BigNumber = new BigNumber(0);

    const pnlpBasedOnTokenOne = new BigNumber(tokenOneAmount)
      .multipliedBy(lpTokenSupply)
      .dividedBy(tokenOneSupply);
    const pnlpBasedOnTokenTwo = new BigNumber(tokenTwoAmount)
      .multipliedBy(lpTokenSupply)
      .dividedBy(tokenTwoSupply);

    if (isCtezTezPair(tokenOneSymbol, tokenTwoSymbol)) {
      // For tez-ctez pair estimated PNLP output will be based on tez token only
      pnlpEstimatedOutput = tokenOneSymbol === "XTZ" ? pnlpBasedOnTokenOne : pnlpBasedOnTokenTwo;
    } else {
      pnlpEstimatedOutput = pnlpBasedOnTokenOne.isLessThan(pnlpBasedOnTokenTwo)
        ? pnlpBasedOnTokenOne
        : pnlpBasedOnTokenTwo;
    }
    return {
      success: true,
      pnlpEstimate: pnlpEstimatedOutput.decimalPlaces(LP_TOKEN.decimals, 1).toString(),
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
    const TOKENS = store.getState().config.tokens;
    let tokenOneAmount = new BigNumber(burnAmount)
      .multipliedBy(tokenOneSupply)
      .dividedBy(lpTokenSupply);
    let tokenTwoAmount = new BigNumber(burnAmount)
      .multipliedBy(tokenTwoSupply)
      .dividedBy(lpTokenSupply);

    tokenOneAmount = tokenOneAmount
      .minus(
        new BigNumber(slippage).multipliedBy(tokenOneAmount).dividedBy(100)
      )
      .decimalPlaces(TOKENS[tokenOneSymbol].decimals, 1);     // 1 - Rounding down
    tokenTwoAmount = tokenTwoAmount
      .minus(
        new BigNumber(slippage).multipliedBy(tokenTwoAmount).dividedBy(100)
      )
      .decimalPlaces(TOKENS[tokenTwoSymbol].decimals, 1);     // 1 - Rounding down

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
 */
export const getCurrentPoolShare = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  lpTokenSupply: string | BigNumber
): Promise<ICurrentPoolShareResponse> => {
  try {
    const lpBalanceResult = await getPnlpBalance(
      tokenOneSymbol,
      tokenTwoSymbol,
      userTezosAddress
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
  lpTokenSupply: string | BigNumber,
  liquidityProcess: ELiquidityProcess
): IPnlpPoolShareResponse => {
  try {
    const lpAmount = new BigNumber(pnlpAmount);
    const lpSupply = new BigNumber(lpTokenSupply);
    const pnlpPoolShare =
      liquidityProcess === ELiquidityProcess.REMOVE
        ? lpAmount.multipliedBy(100).dividedBy(lpSupply).toString()
        : lpAmount.multipliedBy(100).dividedBy(lpSupply.plus(lpAmount)).toString();
    return {
      success: true,
      pnlpPoolShare,
    };
  } catch (error: any) {
    return {
      success: false,
      pnlpPoolShare: "0",
      error: error.message,
    };
  }
};