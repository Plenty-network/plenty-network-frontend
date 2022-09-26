import { BigNumber } from "bignumber.js";
import {
  IAllBribesOperationData,
  IAllClaimableFeesData,
  IAllEpochClaimOperationData,
  IAllLocksRewardsData,
} from "../../api/portfolio/types";
import { ITokenPriceList } from "../../api/util/types";

export interface IPorfolioRewardsData {
  allLocksRewardsData: IAllLocksRewardsData;
  totalTradingFeesAmount: BigNumber;
  totalBribesAmount: BigNumber;
  epochClaimData: IAllEpochClaimOperationData;
  feesClaimData: IAllClaimableFeesData[];
  bribesClaimData: IAllBribesOperationData[];
  locksRewardsDataError: boolean;
  locksRewardsDataAttempts: number;
  rewardsOperationDataError: boolean;
  rewardsOperationDataAttempts: number;
}

export interface IAllLocksRewardArgument {
  userTezosAddress: string;
  tokenPrices: ITokenPriceList;
}
