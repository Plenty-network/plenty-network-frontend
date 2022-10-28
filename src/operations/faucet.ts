import { OpKind } from "@taquito/taquito";
import { dappClient, faucetAddress } from "../common/walletconnect";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "./types";

export const claimFaucet = async (
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const faucetInstance: any = await Tezos.contract.at(faucetAddress);

    const allBatch: any = [];

    for (let i = 0; i < 11; i++) {
      if(i!=8){
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...faucetInstance.methods.claim_token(i).toTransferParams(),
      });
    }
    }

    const batch = Tezos.wallet.batch(allBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }

  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
