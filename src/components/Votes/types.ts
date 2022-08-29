import { ISelectedPool, IVeNFTData, IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";
import { IVotes } from "../../operations/types";

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
  selectedPools: ISelectedPool[];
  setShow: any;
  totalVotingPower: number;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
  onClick: () => void;
}

export interface IVotesTableProps {
  isCurrentEpoch: boolean;
  setTotalVotingPower: React.Dispatch<React.SetStateAction<number>>;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
  totalVotingPower: number;
  voteData: {
    [id: string]: IVotePageData;
  };
  votes: IVotes[];
  setVotes: React.Dispatch<React.SetStateAction<IVotes[]>>;
  className?: string;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
}
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  isStakeAvailable: boolean;
}
export interface ISelectNFT {
  veNFTlist: IVeNFTData[];
  selectedText: {
    votingPower: string;
    tokenId: string;
  };
  setSelectedDropDown: React.Dispatch<
    React.SetStateAction<{
      votingPower: string;
      tokenId: string;
    }>
  >;
}
export interface IAllocationProps {
  show: boolean;
  setShow: any;
}
