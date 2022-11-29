import { BigNumber } from 'bignumber.js';
import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient } from '../common/walletconnect';
import { ActiveLiquidity } from '../components/Pools/ManageLiquidityHeader';
import { store } from '../redux';
import { setFlashMessage } from '../redux/flashMessage';
import { IFlashMessageProps } from '../redux/flashMessage/type';
import {
  IOperationsResponse,
  TResetAllValues,
  TSetActiveState,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from './types';

/**
 * Unstake PNLP token operation for the selected pair of tokens.
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param pnlpAmount - Amount of PNLP token the user wants to unstake
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param flashMessageContent - Content for the flash message object(optional)
 */
export const unstakePnlpTokens = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  pnlpAmount: string | BigNumber,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('AMM does not exist for the selected pair.');
    }
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gauge;
    if (gaugeAddress === undefined) {
      throw new Error('Gauge does not exist for the selected pair.');
    }

    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error('Wallet connection failed.');
    }
    const Tezos = await dappClient().tezos();

    const PNLP_TOKEN = AMM[dexContractAddress].lpToken;

    const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);

    const pnlpAmountToUnstake = new BigNumber(pnlpAmount).multipliedBy(
      new BigNumber(10).pow(PNLP_TOKEN.decimals)
    );
    
    const operation = await gaugeContractInstance.methods
      .withdraw(pnlpAmountToUnstake.decimalPlaces(0, 1).toString())
      .send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(operation.opHash);
    setActiveState && setActiveState(ActiveLiquidity.Liquidity);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    await operation.confirmation(1);

    const status = await operation.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: operation.opHash,
      };
    }else{
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
