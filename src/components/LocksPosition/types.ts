import { IVotePageData } from "../../api/votes/types";

export interface ILocksTablePosition {
  voteData: {
    [id: string]: IVotePageData;
  };
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManageLock: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManageLock: React.Dispatch<React.SetStateAction<boolean>>;
  isLiquidityAvailable?: boolean;
  isStakeAvailable?: boolean;
  tokenA?: string;
  tokenB?: string;
}

export interface ILocksColumnProps {}
export interface ILockExpiryProps {}
export interface IPlyLockedProps {}
export interface IPieChartProps {
  violet: number;
  transparent: number;
}
