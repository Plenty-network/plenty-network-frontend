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

export interface IAirdropTransactionsData {
  signaturesData: IEvmSignatures;
  receiptsCallFrom: ReceiptsCallFrom;
}

export enum EvmCTAState {
  EVM_DISCONNECTED,
  ELIGIBLE,
  NOT_ELIGIBLE,
  TEZOS_DISCONNECTED,
  HAS_AIRDROP_SWITCH,
  NOT_SIGNED,
  NOT_REVEALED,
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

export interface IAirdropStatesData {
  evmCTAState: EvmCTAState;
  textDisplayState: ITextDisplayState;
}