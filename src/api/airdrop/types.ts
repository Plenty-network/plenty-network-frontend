import { BigNumber } from "bignumber.js";

export interface IAPIMessage {
  id: string;
  receiver: string;
  value: string | BigNumber;
}

export enum Mission {
  ELIGIBLE = "ELIGIBLE",
  TRADE = "TRADE",
  LP = "LP",
  STAKE = "STAKE",
  LOCK = "LOCK",
  VOTE = "VOTE",
}

export interface IClaimAPIData {
  mission: Mission;
  claimed: boolean;
  message: IAPIMessage;
  packedMessage: string;
  signature: string;
}

export type TClaimAPIResponseData = IClaimAPIData[] | string;

export enum ChainReceiptsCall {
  TEZOS = "TEZOS",
  EVM = "EVM"
}

export interface IClaimDataResponse {
  success: boolean;
  eligible: boolean;
  message: string;
  perMissionAmount: BigNumber;
  totalClaimableAmount: BigNumber;
  pendingClaimableAmount: BigNumber;
  claimData: IClaimAPIData[];
  error?: string;
}

export interface IEvmEligibleCheckResponse {
  eligible: boolean;
  value: BigNumber;
  error?: string;
}