import { BigNumber } from "bignumber.js";

export interface IOperationsResponse {
  success: boolean;
  operationId?: string;
  error?: string;
}

export interface IParamObject {
  app_id: number;
  min_out: number;
  receiver: string;
  token_in_id: number;
  token_out_id: number;
  hops: Map<any, any>;
}

export interface IAttachmentLiteral {
  add_attachment?: { add_attachemnt: number };
  remove_attachment?: { remove_attachemnt: number };
}

export interface IVotes {
  amm: string;
  votes: BigNumber;
}

export interface IEpochVoteShare {
  epoch: number;
  share: BigNumber;
}

export type TTransactionSubmitModal = (id: string) => void;

export type TSetShowConfirmTransaction = React.Dispatch<React.SetStateAction<boolean>>;

export type TResetAllValues = () => void;

export type TSetActiveState = (val: string) => void;
