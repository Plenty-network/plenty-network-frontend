export interface IOperationsResponse {
    success: boolean;
    operationId?: string;
    error?: string;
}

export type TTransactionSubmitModal = (id: string) => void;

export type TSetShowConfirmTransaction = React.Dispatch<React.SetStateAction<boolean>>;

export type TResetAllValues = () => void;

export type TSetActiveState = React.Dispatch<React.SetStateAction<string>>;