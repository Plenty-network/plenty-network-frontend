import { BigNumber } from "bignumber.js";
import { ITokenInterface } from "../../config/types";

export interface IBalanceResponse {
  success: boolean;
  balance: BigNumber;
  identifier: string;
  error?: any;
}

export interface IAllBalanceResponse {
  success: boolean;
  userBalance: { [id: string]: BigNumber };
}

export interface IPnlpBalanceResponse {
  success: boolean;
  lpToken: string;
  balance: string;
  error?: string;
}

export interface IEpochListObject {
  epochNumber: number;
  isCurrent: boolean;
  startTimestamp: number;
  endTimestamp: number;
}

export interface IEpochDataResponse {
  success: boolean;
  epochData: IEpochListObject[];
  error?: string;
}

export interface IEpochData {
  isCurrent: boolean;
  epochStartTimestamp: number;
  epochEndTimestamp: number;
}

export interface IEpochResponse {
  success: boolean;
  epochData: IEpochData | {};
  error?: string;
}

export interface IDatesEnabledRangeData {
  startTimestamp: number;
  endTimestamp: number;
  days: number;
  yearsToEnable: number[];
  thursdaysToEnable: number[];
}

export interface ILpTokenPriceList {
  [id: string]: BigNumber;
}

export interface ITokenPriceList {
  [id: string]: number;
}

export interface IAllTokensBalance {
  [key: string]: IBalanceResponse;
}

export interface IAllTokensBalanceResponse {
  success: boolean;
  allTokensBalances: IAllTokensBalance;
  error?: string;
}

export interface ITzktTokensListResponse {
  success: boolean;
  allTokensList: ITokenInterface[];
  error?: string;
}

export interface IGaugeExistsResponse {
  gaugeExists: boolean;
  gaugeAddress: string | undefined;
  error?: string;
}