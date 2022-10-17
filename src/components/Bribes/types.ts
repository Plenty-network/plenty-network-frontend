import { BigNumber } from "bignumber.js";
import {
  IPoolsForBribesData,
  IPoolsForBribesResponse,
  IUserBribeData,
} from "../../api/bribes/types";
import { IAllLocksPositionData } from "../../api/portfolio/types";
import { IEpochListObject } from "../../api/util/types";
import { tokenParameter } from "../../constants/swap";

export interface BribesMainProps {
  setIsOperationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isOperationComplete: boolean;
  poolsArr: {
    data: IPoolsForBribesResponse;
    isfetched: boolean;
  };
  bribesArr: {
    data: IUserBribeData[];
    isfetched: boolean;
  };
}

export interface IPoolsTableBribes {
  searchValue: string;
  className?: string;
  isfetched: boolean;
  setSelectedPool: React.Dispatch<React.SetStateAction<IPoolsForBribesData>>;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
  locksPosition: IPoolsForBribesData[];
}
export interface IBribesTableBribes {
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  className?: string;
  isfetched: boolean;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
  locksPosition: IUserBribeData[];
}
export interface IVoteShare {
  className?: string;
  value: BigNumber;
  percentage: BigNumber;
}

export interface IBribesBtn {
  data: IPoolsForBribesData;
  setSelectedPool: React.Dispatch<React.SetStateAction<IPoolsForBribesData>>;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IAddBribes {
  allBalance: {
    [id: string]: BigNumber;
  };
  epochArray: number[];
  handleOperation: () => void;
  setEpochArray: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPool: IPoolsForBribesData;
  bribeToken: tokenParameter;
  setBribeToken: React.Dispatch<React.SetStateAction<tokenParameter>>;
  show: boolean;
  setBribeInputValue: React.Dispatch<React.SetStateAction<string>>;
  bribeInputValue: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IConfirmAddBribes {
  perEpoch: string;
  isSelectedEpoch: boolean;
  handleOperation: () => void;
  show: boolean;
  selectedPool: IPoolsForBribesData;
  value: string;
  token: tokenParameter;
  selectedDropDown: IEpochListObject;

  selectedEndDropDown: IEpochListObject;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IToken {
  value: string;
}

export interface IEpochCol {
  epochNumber: number;
  startEpoch: number;
  endEpoch: number;
  epochStart: number;
  epochEnd: number;
}

export interface IBribeColProps {
  value: BigNumber;

  valuePerEpoch: BigNumber;
}
