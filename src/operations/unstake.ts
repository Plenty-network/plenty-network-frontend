import { BigNumber } from "bignumber.js";
import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient } from '../common/walletconnect';
import { store } from '../redux';
import { IOperationsResponse, TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from './types';

/**
 * Unstake PNLP token operation for the selected pair of tokens.
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair 
 * @param pnlpAmount - Amount of PNLP token the user wants to unstake
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 */
export const unstakePnlpTokens = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  pnlpAmount: string | BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gaugeAddress;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }

    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed.");
    }
    const Tezos = await dappClient().tezos();

    const PNLP_TOKEN = AMM[dexContractAddress].lpToken;

    const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);

    const pnlpAmountToUnstake = new BigNumber(pnlpAmount).multipliedBy(
      new BigNumber(10).pow(PNLP_TOKEN.decimals)
    );

    let batch = null;

    batch = Tezos.wallet
        .batch()
        .withContractCall(
          gaugeContractInstance.methods.withdraw(pnlpAmountToUnstake.toString())
        );

    const batchOperation = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    await batchOperation.confirmation();
    return {
      success: true,
      operationId: batchOperation.opHash,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};