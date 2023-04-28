import { BigNumber } from "bignumber.js";
import { ITokenPriceList } from "../../api/util/types";

export interface IRewardsAprState {
  rewardsAprEstimate: BigNumber;
  rewardsAprEstimateFetching: boolean;
  rewardsAprEstimateError: boolean;
  rewardsAprEstimateAttempts: number;
}

export interface IRewardsAprEstimateArguments {
  totalVotingPower: BigNumber;
  tokenPrices: ITokenPriceList;
}