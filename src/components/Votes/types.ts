import { IVeNFTData } from "../../api/votes/types";

export interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
export interface ICreateLockProps {
  show: boolean;

  setShow: any;
}

export interface IConfirmLockingProps {
  show?: boolean;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setShow?: any;
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
