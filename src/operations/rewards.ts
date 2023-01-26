import { OpKind, WalletParamsWithKind } from '@taquito/taquito';
import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient } from '../common/walletconnect';
import { store } from '../redux';
import { setFlashMessage } from '../redux/flashMessage';
import { IFlashMessageProps } from '../redux/flashMessage/type';
import { IOperationsResponse, TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from './types';
import { BigNumber } from "bignumber.js";
import { GAS_LIMIT_EXCESS, STORAGE_LIMIT_EXCESS } from '../constants/global';
import { getBatchOperationsWithLimits } from '../api/util/operations';

/**
 * Harvest rewards operation for the selected pair of tokens, for which PNLP is staked.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair 
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param flashMessageContent - Content for the flash message object(optional)
 */
export const harvestRewards = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const gaugeAddress: string | undefined = AMM[dexContractAddress].gauge;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }

    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed");
    }
    const Tezos = await dappClient().tezos();
    const gaugeInstance = await Tezos.wallet.at(gaugeAddress);

    const limits = await Tezos.estimate
      .transfer(gaugeInstance.methods.get_reward([["unit"]]).toTransferParams())
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

    const operation = await gaugeInstance.methods
      .get_reward([["unit"]])
      .send({ gasLimit, storageLimit });

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(operation.opHash);
    resetAllValues && resetAllValues();
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
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

// FOR STAT Harvest 
export const harvestAllRewards = async (
  guages : string[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed");
    }
    const Tezos = await dappClient().tezos();

    const promises = [];
    for (var guage of guages) {
      promises.push(await Tezos.wallet.at(guage));
    }
    const response = await Promise.all(promises);
    const harvestBatch: WalletParamsWithKind[] = [];
    for (const key in response) {
      harvestBatch.push({
        kind: OpKind.TRANSACTION,
        ...response[key].methods.get_reward([["unit"]]).toTransferParams(),
      });
    }

    const updatedBatchOperations = await getBatchOperationsWithLimits(harvestBatch);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const operation = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(operation.opHash);
    resetAllValues && resetAllValues();
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
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};