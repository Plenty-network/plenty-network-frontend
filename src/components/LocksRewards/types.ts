import { IVotePageData } from "../../api/votes/types";

export interface IVotesTableRewards {
  voteData: {
    [id: string]: IVotePageData;
  };

  className?: string;
  isConnectWalletRequired?: boolean;
}
