import { BigNumber } from 'bignumber.js'

export interface IOperationsResponse {
    success: boolean;
    operationId?: string;
    error?: string;
}

export interface IAttachmentLiteral {
    add_attachment?: { add_attachemnt : number};
    remove_attachment?: { remove_attachemnt : number};
}

export interface IVotes {
    amm : string;
    votes : BigNumber;
}

export type TTransactionSubmitModal = (id: string) => void;

export type TSetShowConfirmTransaction = React.Dispatch<React.SetStateAction<boolean>>;

export type TResetAllValues = () => void;

export type TSetActiveState = React.Dispatch<React.SetStateAction<string>>;