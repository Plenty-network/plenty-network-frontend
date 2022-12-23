import { BigNumber } from "bignumber.js";

export interface IEvmSignatureData {
  message: string;
  signature: string;
}

export interface IEvmSignatures {
  [evmAddress: string]: IEvmSignatureData;
}

export interface ISignaturePayload {
  evmAddress: string;
  signatureData: IEvmSignatureData;
}

export enum ReceiptsCallFrom {
  "TEZOS",
  "EVM",
}

export interface IReceiptsCallList {
  [tezosAddress: string]: ReceiptsCallFrom;
}

export interface IAirdropTransactionsData {
  signaturesData: IEvmSignatures;
  receiptsCallFrom: IReceiptsCallList;
  tweetedAccounts: string[];
}

export enum EvmCTAState {
  EVM_DISCONNECTED,
  ELIGIBLE,
  NOT_ELIGIBLE,
  TEZOS_DISCONNECTED,
  HAS_AIRDROP_SWITCH,
  NOT_SIGNED,
  NO_TRANSACTIONS,
  WRONG_NETWORK,
  LOADING,
}

export enum TextType {
  INFO,
  WARNING,
  NONE,
}

export interface ITextDisplayState {
  isVisible: boolean;
  textType: TextType;
  textData: string | undefined;
}

export interface IRevealedData {
  [address: string]: boolean;
}

export interface IAirdropStatesData {
  evmCTAState: EvmCTAState;
  textDisplayState: ITextDisplayState;
  revealedData: IRevealedData;
  ethClaimAmount: BigNumber
}

export interface IRevealedPayload {
  tezosAddress: string;
  revealed: boolean;
}

export interface IReceiptsCallPayload {
  tezosAddress: string;
  receiptsCallFrom: ReceiptsCallFrom;
}