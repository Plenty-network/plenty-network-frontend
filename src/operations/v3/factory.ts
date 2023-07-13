import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { IConfigToken, TokenStandard } from "./types";

import { dappClient, v3factoryAddress } from "../../common/walletconnect";
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

export const deployPoolOperation = async (
  tokenXSymbol: IConfigToken,
  tokenYSymbol: IConfigToken,
  initialTickIndex: number,
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
    const state = store.getState();
    const TOKENS = state.config.tokens;
    console.log('----newpool 11', 1, tokenXSymbol, tokenYSymbol);

    const tokenX = await Tezos.wallet.at(tokenXSymbol.address as string);
    console.log('----newpool 11', 2, tokenX);

    const tokenY = await Tezos.wallet.at(tokenYSymbol.address as string);
    console.log('----newpool 11', 3, tokenY);

    const factoryInstance = await Tezos.wallet.at(v3factoryAddress);
    const allBatch: WalletParamsWithKind[] = [];
    console.log;
    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...factoryInstance.methodsObject
        .deploy_pool({
          fee_bps: feeBps,
          initial_tick_index: initialTickIndex,
          extra_slots: 0,
          token_x:
            TOKENS[tokenXSymbol].standard === TokenStandard.FA12
              ? { fa12: tokenX.address }
              : { fa2: { 1: tokenX.address, 2: TOKENS[tokenXSymbol].tokenId } },
          token_y:
            TOKENS[tokenYSymbol].standard === TokenStandard.FA12
              ? { fa12: tokenY.address }
              : { fa2: { 2: tokenY.address, 3: TOKENS[tokenYSymbol].tokenId } },
        })
        .toTransferParams(),
    });
    console.log("poolsop", 4, allBatch);

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
