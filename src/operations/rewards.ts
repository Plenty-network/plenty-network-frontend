import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient } from '../common/walletconnect';
import { store } from '../redux';
import { IOperationsResponse, TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from './types';


export const harvestRewards = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
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
      throw new Error("Wallet connection failed");
    }
    const Tezos = await dappClient().tezos();
    const gaugeInstance = await Tezos.wallet.at(gaugeAddress);

    const operation = await gaugeInstance.methods.get_reward([["unit"]]).send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(operation.opHash);
    resetAllValues && resetAllValues();
    await operation.confirmation();

    return {
      success: true,
      operationId: operation.opHash,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};