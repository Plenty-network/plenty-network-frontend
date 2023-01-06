import { BigNumber } from "bignumber.js";

export interface IEvmSignatureData {
  message: string;
  signature: string;
}

// export interface IEvmSignatures {
//   [evmAddress: string]: IEvmSignatureData;
// }

// export interface ISignaturePayload {
//   evmAddress: string;
//   signatureData: IEvmSignatureData;
// }

// export enum ReceiptsCallFrom {
//   "TEZOS",
//   "EVM",
// }

// export interface IReceiptsCallList {
//   [tezosAddress: string]: ReceiptsCallFrom;
// }

export interface IAirdropTransactionsData {
  // signaturesData: IEvmSignatures;
  // receiptsCallFrom: IReceiptsCallList;
  // tweetedAccounts: string[];
  hasTweeted: boolean;
}

export enum EvmCTAState {
  EVM_DISCONNECTED,
  ELIGIBLE,
  NOT_ELIGIBLE,
  TEZOS_DISCONNECTED,
  HAS_AIRDROP_SWITCH,
  NOT_SIGNED,
  WRONG_NETWORK,
  LOADING,
  RELOAD,
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

export interface IAirdropStatesData {
  evmCTAState: EvmCTAState;
  textDisplayState: ITextDisplayState;
  ethClaimAmount: BigNumber;
  reloadTrigger: boolean;
}

// export interface IReceiptsCallPayload {
//   tezosAddress: string;
//   receiptsCallFrom: ReceiptsCallFrom;
// }