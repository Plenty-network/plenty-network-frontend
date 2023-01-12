import { ISelectedPool, IVeNFTData, IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";
import { IVotes } from "../../operations/types";
import { IEpochListObject } from "../../api/util/types";
import { Bribes } from "../../api/pools/types";

export interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
export interface ICreateLockProps {
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
  ctaText?: string;
  show?: boolean;
  endDate: string;
  votingPower: number;
  handleLockOperation: () => void;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setShow?: any;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  newVeNFTThumbnailUri: string;
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
export interface ITotalVotesProps {
  className?: string;
  totalvotes: BigNumber;
  totalVotesPercentage: BigNumber;
}
export interface IMyVotesValueProps {
  className?: string;
  myVotes: BigNumber;
  myVotesPercentage: BigNumber;
}
export interface IMyVotesProps {
  isMobile: boolean;
  tokenA: string;
  tokenB: string;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
  setTotalVotingPower: React.Dispatch<React.SetStateAction<number>>;
  totalVotingPower: number;
  amm: string;
  setVotes: React.Dispatch<React.SetStateAction<IVotes[]>>;
  votes: IVotes[];
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };

  totalVotesPercentage: number;
  isCurrentEpoch: boolean;
  index: number;
  votedata: {
    index: number;
    amm: string;
    votes: IVotePageData;
  }[];

  totalVotes1: number[];
  sumOfVotes: number;
}
export interface IRewardsDataProps {
  className?: string;
  bribes: BigNumber;
  fees: number;
  token1Name: string;
  token2Name: string;
  fees1: number;
  fees2: number;
  bribesData: Bribes[];
}

export interface IVotesTableProps {
  sumOfVotes: number;
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
  isfetching: boolean;
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
  castVoteOperation: boolean;
  show: boolean;
  setShow: any;
  epochData: IEpochListObject[];
  epochNumber: number;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
  alreadyVoted: boolean;
}

export interface IEpochPopup {
  show: boolean;
  setShow: any;
  onClick: () => void;
}
