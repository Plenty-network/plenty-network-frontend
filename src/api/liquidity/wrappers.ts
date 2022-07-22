import { AMM_TYPE } from '../../config/types';
import { getDexType, getLpTokenSymbol } from '../util/fetchConfig';
import { BigNumber } from 'bignumber.js';
import { IOtherTokenOutput, IPnlpBalanceResponse } from './types';
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
    // TODO: @Udit, please check for the possible decimals issue for input and other token supply, if not divided by decimals.
    // This functions works for supply values which are divided by decimals.
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