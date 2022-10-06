import { BigNumber } from "bignumber.js";
import { IAllLocksPositionData } from "../../api/portfolio/types";
import { tokenParameter } from "../../constants/swap";

export interface BribesMainProps {}

export interface IPoolsTableBribes {
  className?: string;
  isfetched: boolean;
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
  locksPosition: IAllLocksPositionData[];
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
  setShowAddBribes: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IAddBribes {
  bribeToken: tokenParameter;
  setBribeToken: React.Dispatch<React.SetStateAction<tokenParameter>>;
  show: boolean;
  setBribeInputValue: React.Dispatch<React.SetStateAction<string>>;
  bribeInputValue: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
