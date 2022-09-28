import { IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";

import { Bribes } from "../../api/pools/types";
import {
  EFeesStatus,
  IAllLocksRewardsData,
  ILockRewardsBribeData,
  ILockRewardsFeeData,
  ILocksRewardsTokenData,
} from "../../api/portfolio/types";
export interface IVotesTableRewards {
  allLocksRewardsData: IAllLocksRewardsData;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
  voteData: {
    [id: string]: IVotePageData;
  };

  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IRewardsDataProps {
  feesData: ILockRewardsFeeData;
  feesStatus: EFeesStatus;
  className?: string;
  bribes: BigNumber;
  fees: number;
  token1Name: string;
  token2Name: string;
  bribesData: ILockRewardsBribeData[];
}
export interface IVotingPowerProps {
  votes: BigNumber;
  percentage: BigNumber;
}
