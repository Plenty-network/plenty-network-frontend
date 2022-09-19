import { IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";

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

export interface IManageLockProps {
  IncreaseLockEndOperation: () => void;
  IncreaseLockValueOperation: () => void;
  handleIncreaseVoteOperation: () => void;
  setUpdatedPlyVoteValue: React.Dispatch<React.SetStateAction<string>>;

  plyBalance: BigNumber;
  show: boolean;

  setLockingEndData: React.Dispatch<
    React.SetStateAction<{
      selected: number;
      lockingDate: number;
    }>
  >;
  tokenPrice: {
    [id: string]: number;
  };
  lockingEndData: {
    selected: number;
    lockingDate: number;
  };
  setLockingDate: React.Dispatch<React.SetStateAction<string>>;
  updatedPlyVoteValue: string;
  lockingDate: string;

  handleLockOperation: () => void;
  setShow: any;
  showConfirmTransaction: boolean;
  setShowConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  showTransactionSubmitModal: boolean;
  setShowTransactionSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}
