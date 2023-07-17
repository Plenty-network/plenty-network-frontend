import { OpKind, WalletParamsWithKind } from "@taquito/taquito";

import { dappClient } from "../../common/walletconnect";
import { store } from "../../redux";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "../types";
import { getBatchOperationsWithLimits } from "../../api/util/operations";

import { setFlashMessage } from "../../redux/flashMessage";
import { IFlashMessageProps } from "../../redux/flashMessage/type";

import { IV3PositionObject } from "../../api/v3/types";

import { PositionManager } from "@plenty-labs/v3-sdk";
import { contractStorage } from "../../api/v3/helper";

export const collectFees = async (
  position: IV3PositionObject,
  userAddress: string,
  tokenXSymbol: string,
  tokenYSymbol: string,
  feeTier: number,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const Tezos = await dappClient().tezos();

    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);

    const contractInstance = await Tezos.wallet.at(contractStorageParameters.poolAddress);

    let collectFeeOp = PositionManager.collectFeesOp(
      //@ts-ignore
      contractInstance,
      {
        positionId: parseInt(position.position.key_id),

        toX: userAddress,

        toY: userAddress,

        deadline: Math.floor(new Date().getTime() / 1000) + 30 * 60,
      }
    );
    const allBatchOperations: WalletParamsWithKind[] = [];

    // push remove op;
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...collectFeeOp,
    });

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatchOperations);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOperation = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    await batchOperation.confirmation(1);

    const status = await batchOperation.status();
    if (status === "applied") {
      return {
        success: true,
        operationId: batchOperation.opHash,
      };
    } else {
      throw new Error(status);
    }
  } catch (error: any) {
    console.log("v3error: ", error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
