import { IVotePageData } from "../../api/votes/types";

export interface IPoolsTablePosition {
  voteData: {
    [id: string]: IVotePageData;
  };

  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  isLiquidityAvailable?: boolean;
  isStakeAvailable?: boolean;
  tokenA?: string;
  tokenB?: string;
}
