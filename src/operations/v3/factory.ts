import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { IConfigToken, TokenStandard } from "./types";

import { BigNumber } from "bignumber.js";
import { dappClient, v3factoryAddress } from "../../common/walletconnect";
import { store } from "../../redux";
import { PoolDeployer } from "@plenty-labs/v3-sdk";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "../types";
import { getBatchOperationsWithLimits } from "../../api/util/operations";

import { setFlashMessage } from "../../redux/flashMessage";
import { IFlashMessageProps } from "../../redux/flashMessage/type";

export const deployPoolOperation = async (
  tokenXSymbol: IConfigToken,
  tokenYSymbol: IConfigToken,
  realPrice: BigNumber,
  feeBps: number,
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
    const factoryInstance = await Tezos.wallet.at(v3factoryAddress);

    const allBatch: WalletParamsWithKind[] = [];
    allBatch.push({
      kind: OpKind.TRANSACTION,
      // @ts-ignore
      ...PoolDeployer.deployPool(factoryInstance, {
        tokenX: tokenXSymbol,
        tokenY: tokenYSymbol,
        realPrice,
        feeBps,
      }),
    });

    console.log("allBatch", allBatch);

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatch);
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
    console.log("v3operationerror: ", error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
