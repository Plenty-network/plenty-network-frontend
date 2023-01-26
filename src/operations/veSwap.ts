import { dappClient, veSwapAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IVotes,
} from "./types";
import { BigNumber } from "bignumber.js";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { MigrateToken } from "../config/types";
import Config from "../config/config";
import { GAS_LIMIT_EXCESS, STORAGE_LIMIT_EXCESS } from "../constants/global";
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { getBatchOperationsWithLimits } from "../api/util/operations";

export const claim = async (
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const veSwapInstance = await Tezos.wallet.at(veSwapAddress);

    const limits = await Tezos.estimate
      .transfer(veSwapInstance.methods.claim([["unit"]]).toTransferParams())
      .then((limits) => limits)
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    let gasLimit = 0;
    let storageLimit = 0;

    if (limits !== undefined) {
      gasLimit = new BigNumber(limits.gasLimit)
        .plus(new BigNumber(limits.gasLimit).multipliedBy(GAS_LIMIT_EXCESS))
        .decimalPlaces(0, 1)
        .toNumber();
      storageLimit = new BigNumber(limits.storageLimit)
        .plus(new BigNumber(limits.storageLimit).multipliedBy(STORAGE_LIMIT_EXCESS))
        .decimalPlaces(0, 1)
        .toNumber();
    } else {
      throw new Error("Failed to estimate transaction limits");
    }

    const operation = await veSwapInstance.methods
      .claim([["unit"]])
      .send({ gasLimit, storageLimit });

    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(operation.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await operation.confirmation(1);

    const status = await operation.status();
    if (status === "applied") {
      return {
        success: true,
        operationId: operation.opHash,
      };
    } else {
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

export const exchange = async (
  token: MigrateToken,
  value: BigNumber,
  caller : string,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const veSwapInstance = await Tezos.wallet.at(veSwapAddress);

    const state = store.getState();
    const TOKEN = state.config.tokens;

    const tokenDecimalMultiplier = new BigNumber(10).pow(
      Config.EXCHANGE_TOKENS[token].tokenDecimals
    );

    const allBatchOperations: WalletParamsWithKind[] = [];

    if (token === MigrateToken.PLENTY) {
      const plentyInstance = await Tezos.wallet.at(TOKEN[token].address as string);

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...plentyInstance.methods
          .approve(veSwapAddress, value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0, 1))
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...veSwapInstance.methods
          .exchange(
            Config.EXCHANGE_TOKENS[token].contractEnumValue,
            value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0, 1)
          )
          .toTransferParams(),
      });
    } else {
      const wrapInstance = await Tezos.wallet.at(TOKEN[token].address as string);

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...wrapInstance.methods
          .update_operators([
            {
              add_operator: {
                owner: caller,
                operator: veSwapAddress,
                token_id: 0,
              },
            },
          ])
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...veSwapInstance.methods
          .exchange(
            Config.EXCHANGE_TOKENS[token].contractEnumValue,
            value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0, 1)
          )
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...wrapInstance.methods
          .update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: veSwapAddress,
                token_id: 0,
              },
            },
          ])
          .toTransferParams(),
      });
    }

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatchOperations);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOp = await batch.send();

    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if (status === "applied") {
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    } else {
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
