import { IVeNFTData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";

export interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
export interface ICreateLockProps {
  plyBalance: BigNumber;
  show: boolean;
  userBalances: {
    [key: string]: string;
  };
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
  plyInput: string;
  lockingDate: string;
  setPlyInput: React.Dispatch<React.SetStateAction<string>>;
  handleLockOperation: () => void;
  setShow: any;
  showConfirmTransaction: boolean;
  setShowConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  showTransactionSubmitModal: boolean;
  setShowTransactionSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IConfirmLockingProps {
  show?: boolean;
  endDate: string;
  votingPower: number;
  handleLockOperation: () => void;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setShow?: any;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ICastVoteProps {
  show: boolean;

  setShow: any;
}

export interface IVotesTableProps {
  className?: string;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
}
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  isStakeAvailable: boolean;
}
export interface ISelectNFT {
  veNFTlist: IVeNFTData[];
}
