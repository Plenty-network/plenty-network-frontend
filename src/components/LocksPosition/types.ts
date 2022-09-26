import { ELocksState, IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";
import { IAllLocksPositionData } from "../../api/portfolio/types";

export interface ILocksTablePosition {
  isfetched: boolean;
  setShowWithdraw: React.Dispatch<React.SetStateAction<boolean>>;
  setManageData: React.Dispatch<React.SetStateAction<IAllLocksPositionData>>;
  locksPosition: IAllLocksPositionData[];
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManageLock: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  manageData: IAllLocksPositionData;
  setManageData: React.Dispatch<React.SetStateAction<IAllLocksPositionData>>;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManageLock: React.Dispatch<React.SetStateAction<boolean>>;
  isLiquidityAvailable?: boolean;
  isStakeAvailable?: boolean;
  tokenA?: string;
  tokenB?: string;
}

export interface IVoteBtnProps {
  setWithdraw: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  locksState: ELocksState;
  manageData: IAllLocksPositionData;
  setManageData: React.Dispatch<React.SetStateAction<IAllLocksPositionData>>;
}
export interface ILocksColumnProps {
  id: BigNumber;
}
export interface ILockExpiryProps {
  endTime: number;
}

export interface IPlyLockedProps {
  value: BigNumber;
}
export interface IPieChartProps {
  violet: number;
  transparent: number;
}

export interface ITopBar {
  manageData: IAllLocksPositionData;
}

export interface IManageLockProps {
  manageData: IAllLocksPositionData;
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
