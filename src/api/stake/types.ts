import { ELocksState } from "../votes/types";
import { BigNumber } from "bignumber.js";

export interface IVePLYData {
  tokenId: string;
  boostValue: string;
  votingPower: string;
  lockState: ELocksState
};

export interface IVePLYListResponse {
  success: boolean;
  vePLYData: IVePLYData[];
  error?: string;
}

export interface IStakedData {
  isBoosted: boolean,
  boostedLockId: BigNumber;
  boostValue: string;
  stakedBalance: BigNumber;
  gaugeAddress: string;
}

export interface IStakedDataResponse {
  success: boolean;
  stakedData: IStakedData;
  error?: string;
}