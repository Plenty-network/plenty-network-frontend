import { IVeNFTData } from "../../api/votes/types";

export interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
export interface ICreateLockProps {
  show: boolean;
  userBalances: {
    [key: string]: string;
  };
  plyInput: string;
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
