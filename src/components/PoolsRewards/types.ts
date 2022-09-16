import { IVotePageData } from "../../api/votes/types";

export interface IPoolsTableRewards {
  voteData: {
    [id: string]: IVotePageData;
  };

  className?: string;
  isConnectWalletRequired?: boolean;
}
