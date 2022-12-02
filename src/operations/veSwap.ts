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
    const veSwapInstance: any = await Tezos.contract.at(veSwapAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(veSwapInstance.methods.claim([["unit"]]));

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
    const veSwapInstance: any = await Tezos.contract.at(veSwapAddress);

    const state = store.getState();
    const TOKEN = state.config.tokens;

    const tokenDecimalMultiplier = new BigNumber(10).pow(
      Config.EXCHANGE_TOKENS[token].tokenDecimals
    );

    let batch = null;

    if(token === MigrateToken.PLENTY){
      const plentyInstance : any = await Tezos.contract.at(TOKEN[token].address as string);
      batch = Tezos.wallet
      .batch()
      .withContractCall(plentyInstance.methods.approve(veSwapAddress , value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0,1) ))
      .withContractCall(
        veSwapInstance.methods.exchange(
          Config.EXCHANGE_TOKENS[token].contractEnumValue,
          value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0,1)
        )
      );
    }
    else{
      const wrapInstance : any = await Tezos.contract.at(TOKEN[token].address as string);
      console.log(wrapInstance);

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          wrapInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: veSwapAddress,
                token_id: 0,
              },
            },
          ])
        )
        .withContractCall(
          veSwapInstance.methods.exchange(
            Config.EXCHANGE_TOKENS[token].contractEnumValue,
            value.multipliedBy(tokenDecimalMultiplier).decimalPlaces(0,1)
          ))
        .withContractCall(
          wrapInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: veSwapAddress,
                token_id: 0,
              },
            },
          ])
        );
    }

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
