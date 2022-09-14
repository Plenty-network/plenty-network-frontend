import { IVotePageData } from "../../api/votes/types";

export interface ILocksTablePosition {
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

export interface ILocksColumnProps {}
export interface ILockExpiryProps {}
export interface IPlyLockedProps {}
