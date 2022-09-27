import { IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";

import { Bribes } from "../../api/pools/types";
import { IAllLocksRewardsData } from "../../api/portfolio/types";
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
  className?: string;
  bribes: BigNumber;
  fees: number;
  token1Name: string;
  token2Name: string;
  fees1: number;
  fees2: number;
  bribesData: Bribes[];
}
export interface IVotingPowerProps {
  votes: BigNumber;
  percentage: BigNumber;
}
