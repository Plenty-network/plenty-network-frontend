import { BigNumber } from "bignumber.js";
import {
  IAllBribesOperationData,
  IAllClaimableFeesData,
  IAllEpochClaimOperationData,
  IAllLocksInflationData,
  IAllLocksRewardsData,
  IClaimInflationOperationData,
  IUnclaimedInflationData,
} from "../../api/portfolio/types";
import { ILpTokenPriceList, ITokenPriceList } from "../../api/util/types";

export interface IPorfolioRewardsData {
  allLocksRewardsData: IAllLocksRewardsData;
  totalTradingFeesAmount: BigNumber;
  totalBribesAmount: BigNumber;
  unclaimedInflationData: IUnclaimedInflationData;
  allLocksInflationData: IAllLocksInflationData;
  epochClaimData: IAllEpochClaimOperationData;
  feesClaimData: IAllClaimableFeesData[];
  bribesClaimData: IAllBribesOperationData[];
  claimAllInflationData: IClaimInflationOperationData[];
  locksRewardsDataError: boolean;
  locksRewardsDataAttempts: number;
  fetchingLocksRewardsData: boolean;
  rewardsOperationDataError: boolean;
  rewardsOperationDataAttempts: number;
  unclaimedInflationDataError: boolean;
  unclaimedInflationDataAttempts: number;
  fetchingUnclaimedInflationData: boolean;
}

export interface IAllLocksRewardArgument {
  userTezosAddress: string;
  tokenPrices: ITokenPriceList;
}


export interface ITvlStatsData {
  userTvl: BigNumber;
  userTvlFetching: boolean;
  userTvlError: boolean;
  userTvlAttempts: number;
}

export interface ITvlStatsArgument extends IAllLocksRewardArgument {
  lpTokenPrices: ILpTokenPriceList;
}

export interface IVotesStatsData {
  totalEpochVotingPower: BigNumber;
  totalPlyLocked: BigNumber;
  votesStatsFetching: boolean;
  votesStatsError: boolean;
  votesStatsAttempts: number;
}