import { IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";

import { Bribes } from "../../api/pools/types";
export interface IVotesTableRewards {
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
export interface IVotingPowerProps {}
