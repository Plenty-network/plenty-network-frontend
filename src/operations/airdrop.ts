import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { IClaimAPIData } from "../api/airdrop/types";
import { connectedNetwork, dappClient } from "../common/walletconnect";
import Config from "../config/config";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from "./types";

/**
 * Performs claim operation of airdrop.
 * @param airdropClaimData - Claim data received from api
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param flashMessageContent - Content for the flash message object(optional)
 */
export const claimAirdrop = async (
  airdropClaimData: IClaimAPIData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
) => {
  try {
    if (airdropClaimData.length <= 0) {
      throw new Error("Nothing to claim");
    }
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed.");
    }
    const Tezos = await dappClient().tezos();
    const airdropContract: string = Config.AIRDROP[connectedNetwork];

    const airdropInstance = await Tezos.wallet.at(airdropContract);

    const allBatchOperations: WalletParamsWithKind[] = [];

    airdropClaimData.forEach((claimData) => {
      if (!claimData.claimed) {
        allBatchOperations.push({
          kind: OpKind.TRANSACTION,
          ...airdropInstance.methods
            .claim(claimData.packedMessage, claimData.signature)
            .toTransferParams(),
        });
      }
    });

    if (allBatchOperations.length <= 0) {
      throw new Error("Nothing to claim");
    }

    const batch = Tezos.wallet.batch(allBatchOperations);
    const batchOperation = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOperation.confirmation(1);

    console.log(batchOperation.status());

    const status = await batchOperation.status();
    if (status === "applied") {
      return {
        success: true,
        operationId: batchOperation?.opHash,
      };
    } else {
      throw new Error(status);
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
