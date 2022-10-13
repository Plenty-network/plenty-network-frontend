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
  className?: string;
  isfetched: boolean;
  setSelectedPool: React.Dispatch<React.SetStateAction<IPoolsForBribesData>>;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
  locksPosition: IPoolsForBribesData[];
}
export interface IBribesTableBribes {
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
export interface BribesMainProps {}
export interface BribesMainProps {}

export interface BribesMainProps {}
export interface IBribesBtn {
  data: IPoolsForBribesData;
  setSelectedPool: React.Dispatch<React.SetStateAction<IPoolsForBribesData>>;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IAddBribes {
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
}
