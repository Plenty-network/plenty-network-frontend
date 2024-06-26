import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { getDexAddress } from "../api/util/fetchConfig";
import { getBatchOperationsWithLimits } from "../api/util/operations";
import { dappClient } from "../common/walletconnect";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";

import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
  IParamObject,
} from "./types";
import Config from "../config/config";
import { threeRouteRouter } from "../api/swap/3route";
import { TokenStandard } from "../config/types";

export const routerSwap = async (
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: BigNumber,
  userAddress: string,
  slippage: number,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed.");
    }
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const TOKENS = state.config.tokens;

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);

    const routerContractInstance = await Tezos.wallet.at(Config.PLENTY_3ROUTE_CONTRACT);
    let tokenInInstance;
    if (tokenIn.toLowerCase() != "xtz") {
      tokenInInstance = await Tezos.wallet.at(TOKENS[tokenIn].address as string);
    }

    const param: IParamObject | any = (
      await threeRouteRouter(
        tokenIn,
        tokenOut,
        tokenInAmount,
        userAddress,
        slippage,
        TOKENS[tokenIn].decimals,
        TOKENS[tokenOut].decimals
      )
    ).param;

    let swapAmount = tokenInAmount
      .multipliedBy(new BigNumber(10).pow(TOKENS[tokenIn].decimals))
      .decimalPlaces(0, 1)
      .toString();

    const allBatchOperations: WalletParamsWithKind[] = [];

    if (TOKENS[tokenIn].standard === TokenStandard.TEZ) {
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...routerContractInstance.methods
          .execute(
            param?.token_in_id,
            param?.token_out_id,
            param?.min_out,
            param?.receiver,
            param?.hops,
            param?.app_id
          )
          .toTransferParams({ amount: Number(swapAmount), mutez: true }),
      });
    } else if (TOKENS[tokenIn].standard === TokenStandard.FA12) {
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...tokenInInstance.methods
          .approve(Config.PLENTY_3ROUTE_CONTRACT, swapAmount)
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...routerContractInstance.methods
          .execute(
            param?.token_in_id,
            param?.token_out_id,
            param?.min_out,
            param?.receiver,
            param?.hops,
            param?.app_id
          )
          .toTransferParams(),
      });
    } else if (TOKENS[tokenIn].standard === TokenStandard.FA2) {
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...tokenInInstance.methods
          .update_operators([
            {
              add_operator: {
                owner: userAddress,
                operator: Config.PLENTY_3ROUTE_CONTRACT,
                token_id: TOKENS[tokenIn].tokenId,
              },
            },
          ])
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...routerContractInstance.methods
          .execute(
            param?.token_in_id,
            param?.token_out_id,
            param?.min_out,
            param?.receiver,
            param?.hops,
            param?.app_id
          )
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...tokenInInstance.methods
          .update_operators([
            {
              remove_operator: {
                owner: userAddress,
                operator: Config.PLENTY_3ROUTE_CONTRACT,
                token_id: TOKENS[tokenIn].tokenId,
              },
            },
          ])
          .toTransferParams(),
      });
    }

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
