import { BigNumber } from "bignumber.js";
import { TokenVariant } from "../../config/types";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import { store } from "../../redux";
import { getOutputTokensAmount } from "../liquidity";
import { getPackedKey } from "../util/balance";
import { getDexAddress } from "../util/fetchConfig";
import { getBigMapData, getStorage } from "../util/storageProvider";
import { gaugeStorageType } from "./data";
import { IDepositedAmountResponse, IRewardsResponse } from "./types";

/**
 * Returns the computed token one and token two deposited amounts for the amount of LP token user has staked.
 * @param stakedLpAmount - Total amount of LP token the user has staked currently
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param tokenOneSupply - Total supply of the first token of the selected pair
 * @param tokenTwoSupply - Total supply of the second token of the selected pair
 * @param lpTokenSupply - Total supply of the LP token of the selected pair
 */
export const getDepositedAmounts = (
  stakedLpAmount: string | BigNumber,
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneSupply: string | BigNumber,
  tokenTwoSupply: string | BigNumber,
  lpTokenSupply: string | BigNumber
): IDepositedAmountResponse => {
  return getOutputTokensAmount(
    stakedLpAmount,
    tokenOneSymbol,
    tokenTwoSymbol,
    tokenOneSupply,
    tokenTwoSupply,
    lpTokenSupply,
    new BigNumber(0)
  );
};

/**
 * Returns the estimated rewards the user will get on harversting.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param userTezosAddress - Tezos wallet address of the user
 * @param ammAddress - Amm address of the pair selected (optional)
 */
export const getRewards = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  ammAddress?: string
): Promise<IRewardsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = ammAddress || getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gaugeAddress;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }
    const gaugeStorage = await getStorage(gaugeAddress, gaugeStorageType);
    
    const derivedSupply: BigNumber = gaugeStorage.derived_supply;
    const totalSupply: BigNumber = gaugeStorage.total_supply;
    const rewardPerToken: BigNumber = gaugeStorage.reward_per_token;
    const rewardRate: BigNumber = gaugeStorage.reward_rate;
    const periodFinish: BigNumber = gaugeStorage.period_finish;
    const lastUpdateTime: BigNumber = gaugeStorage.last_update_time;
    const userRewardPerTokenDebtBigMapId: string =
      gaugeStorage.user_reward_per_token_debt;
    const rewardsBigMapId: string = gaugeStorage.rewards;
    const derivedBalancesBigMapId: string = gaugeStorage.derived_balances;

    const packedAddress: string = getPackedKey(
      0,
      userTezosAddress,
      TokenVariant.FA12
    );

    const userRewardPerTokenDebtResponse = await getBigMapData(
      userRewardPerTokenDebtBigMapId,
      packedAddress
    );
    const rewardsResponse = await getBigMapData(rewardsBigMapId, packedAddress);
    const derivedBalancesResponse = await getBigMapData(
      derivedBalancesBigMapId,
      packedAddress
    );
    
    const userRewardPerTokenDebt = new BigNumber(
      userRewardPerTokenDebtResponse.data.int || 0
    );
    const rewardsFromStorage = new BigNumber(rewardsResponse.data.int || 0);
    const derivedBalances = new BigNumber(
      derivedBalancesResponse.data.int || 0
    );

    const tNow = new BigNumber(new Date().getTime())
      .dividedBy(1000)
      .decimalPlaces(0, 1);
    
    let rewardPerTokenLatest = rewardPerToken;
    
    if (totalSupply.isGreaterThan(0)) {
      const dTime = BigNumber.minimum(tNow, periodFinish).minus(lastUpdateTime);
      rewardPerTokenLatest = rewardPerTokenLatest.plus(
        dTime
          .multipliedBy(rewardRate)
          .multipliedBy(PLY_DECIMAL_MULTIPLIER)
          .dividedBy(derivedSupply)
      );
    } else {
      throw new Error("No amount staked yet in the contract.");
    }
    
    const reward = derivedBalances
      .multipliedBy(rewardPerTokenLatest.minus(userRewardPerTokenDebt))
      .dividedBy(new BigNumber(10).pow(36));

    const totalRewards = rewardsFromStorage
      .dividedBy(PLY_DECIMAL_MULTIPLIER)
      .plus(reward)
      .toString();
    
    return {
      success: true,
      rewards: totalRewards,
    };
  } catch (error: any) {
    return {
      success: false,
      rewards: "0",
      error: error.message,
    };
  }
};
