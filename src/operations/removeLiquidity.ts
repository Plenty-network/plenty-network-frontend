import { getDexAddress, isGeneralStablePair, isTezPair } from '../api/util/fetchConfig';
import { BigNumber } from 'bignumber.js';
import { dappClient } from '../common/walletconnect';
import { store } from '../redux';
import { IOperationsResponse, TResetAllValues, TSetActiveState, TSetShowConfirmTransaction, TTransactionSubmitModal } from './types';
import { ActiveLiquidity } from '../components/Pools/ManageLiquidityHeader';
import { IFlashMessageProps } from '../redux/flashMessage/type';
import { setFlashMessage } from '../redux/flashMessage';

/**
 * Remove liquidity operation for given pair of tokens.
 * @param tokenOneSymbol - Symbol of first token of the pair for the selected PNLP
 * @param tokenTwoSymbol - Symbol of second token of the pair for the selected PNLP
 * @param lpTokenSymbol - Symbol of the PNLP token selected by user
 * @param tokenOneAmount - Minimum amount of first token the user will get on removing entered PNLP
 * @param tokenTwoAmount - Minimum amount of second token the user will get on removing entered PNLP
 * @param pnlpAmount - Amount of PNLP the user wants to remove (input by user)
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 * @param flashMessageContent - Content for the flash message object(optional)
 */
export const removeLiquidity = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  lpTokenSymbol: string,
  tokenOneAmount: string | BigNumber,
  tokenTwoAmount: string | BigNumber,
  pnlpAmount: string | BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    let removeLiquidityResult: IOperationsResponse;
    if (isTezPair(tokenOneSymbol, tokenTwoSymbol)) {
      removeLiquidityResult = await removeTezPairsLiquidity(
        tokenOneSymbol,
        tokenTwoSymbol,
        lpTokenSymbol,
        new BigNumber(tokenOneAmount),
        new BigNumber(tokenTwoAmount),
        new BigNumber(pnlpAmount),
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        setActiveState,
        flashMessageContent
      );
    } else {
      removeLiquidityResult = await removeAllPairsLiquidity(
        tokenOneSymbol,
        tokenTwoSymbol,
        lpTokenSymbol,
        new BigNumber(tokenOneAmount),
        new BigNumber(tokenTwoAmount),
        new BigNumber(pnlpAmount),
        userTezosAddress,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        setActiveState,
        flashMessageContent
      );
    }
    return {
      success: removeLiquidityResult.success,
      operationId: removeLiquidityResult.operationId,
      error: removeLiquidityResult.error,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

/**
 * Remove liquidity operation for given pair of tokens when niether of them is tez token.
 * @param tokenOneSymbol - Symbol of first token of the pair for the selected PNLP
 * @param tokenTwoSymbol - Symbol of second token of the pair for the selected PNLP
 * @param lpTokenSymbol - Symbol of the PNLP token selected by user
 * @param tokenOneAmount - Minimum amount of first token the user will get on removing entered PNLP
 * @param tokenTwoAmount - Minimum amount of second token the user will get on removing entered PNLP
 * @param pnlpAmount - Amount of PNLP the user wants to remove (input by user)
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 * @param flashMessageContent - Content for the flash message object(optional)
 */
const removeAllPairsLiquidity = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  lpTokenSymbol: string,
  tokenOneAmount: BigNumber,
  tokenTwoAmount: BigNumber,
  pnlpAmount: BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    let firstTokenSymbol: string | undefined,
      firstTokenMinimumAmount: BigNumber = new BigNumber(0),
      secondTokenSymbol: string | undefined,
      secondTokenMinimumAmount: BigNumber = new BigNumber(0);
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed");
    }
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const AMM = state.config.AMMs;
    const TOKENS = state.config.tokens;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("No dex found for the given pair of tokens.");
    }
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

    // Make the order of tokens according to the order in contract.
    [firstTokenSymbol, firstTokenMinimumAmount] =
      AMM[dexContractAddress].token1.symbol === tokenOneSymbol
        ? [tokenOneSymbol, tokenOneAmount]
        : [tokenTwoSymbol, tokenTwoAmount];
    [secondTokenSymbol, secondTokenMinimumAmount] =
      AMM[dexContractAddress].token2.symbol === tokenOneSymbol
        ? [tokenOneSymbol, tokenOneAmount]
        : [tokenTwoSymbol, tokenTwoAmount];

    firstTokenMinimumAmount = firstTokenMinimumAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[firstTokenSymbol].decimals)
    );
    secondTokenMinimumAmount = secondTokenMinimumAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[secondTokenSymbol].decimals)
    );

    const finalPnlpAmount = pnlpAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[lpTokenSymbol].decimals)
    );

    const operation = isGeneralStablePair(firstTokenSymbol, secondTokenSymbol)
      ? await dexContractInstance.methods
          .remove_liquidity(
            finalPnlpAmount.toString(),
            userTezosAddress,
            firstTokenMinimumAmount.toString(),
            secondTokenMinimumAmount.toString()
          )
          .send()
      : await dexContractInstance.methods
          .RemoveLiquidity(
            finalPnlpAmount.toString(),
            userTezosAddress,
            firstTokenMinimumAmount.toString(),
            secondTokenMinimumAmount.toString()
          )
          .send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(operation.opHash);
    setActiveState && setActiveState(ActiveLiquidity.Staking);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    await operation.confirmation();

    return {
      success: true,
      operationId: operation.opHash,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};


/**
 * Remove liquidity operation for given pair of tokens when either of them is a tez token.
 * @param tokenOneSymbol - Symbol of first token of the pair for the selected PNLP
 * @param tokenTwoSymbol - Symbol of second token of the pair for the selected PNLP
 * @param lpTokenSymbol - Symbol of the PNLP token selected by user
 * @param tokenOneAmount - Minimum amount of first token the user will get on removing entered PNLP
 * @param tokenTwoAmount - Minimum amount of second token the user will get on removing entered PNLP
 * @param pnlpAmount - Amount of PNLP the user wants to remove (input by user)
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 * @param flashMessageContent - Content for the flash message object(optional)
 */
 const removeTezPairsLiquidity = async (
   tokenOneSymbol: string,
   tokenTwoSymbol: string,
   lpTokenSymbol: string,
   tokenOneAmount: BigNumber,
   tokenTwoAmount: BigNumber,
   pnlpAmount: BigNumber,
   transactionSubmitModal: TTransactionSubmitModal | undefined,
   resetAllValues: TResetAllValues | undefined,
   setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
   setActiveState: TSetActiveState | undefined,
   flashMessageContent?: IFlashMessageProps
 ): Promise<IOperationsResponse> => {
   try {
     let tezSymbol: string | undefined,
       tezMinimumAmount: BigNumber = new BigNumber(0),
       secondTokenSymbol: string | undefined,
       secondTokenMinimumAmount: BigNumber = new BigNumber(0);
     const { CheckIfWalletConnected } = dappClient();
     const walletResponse = await CheckIfWalletConnected();
     if (!walletResponse.success) {
       throw new Error("Wallet connection failed");
     }
     const Tezos = await dappClient().tezos();
     const state = store.getState();
     const TOKENS = state.config.tokens;
     const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
     if (dexContractAddress === "false") {
       throw new Error("No dex found for the given pair of tokens.");
     }
     const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

     // Make the order of tokens according to the order in contract.
     if (tokenOneSymbol === "tez") {
       tezSymbol = tokenOneSymbol;
       tezMinimumAmount = tokenOneAmount;
       secondTokenSymbol = tokenTwoSymbol;
       secondTokenMinimumAmount = tokenTwoAmount;
     } else {
       tezSymbol = tokenTwoSymbol;
       tezMinimumAmount = tokenTwoAmount;
       secondTokenSymbol = tokenOneSymbol;
       secondTokenMinimumAmount = tokenOneAmount;
     }

     tezMinimumAmount = tezMinimumAmount.multipliedBy(
       new BigNumber(10).pow(TOKENS[tezSymbol].decimals)
     );
     secondTokenMinimumAmount = secondTokenMinimumAmount.multipliedBy(
       new BigNumber(10).pow(TOKENS[secondTokenSymbol].decimals)
     );

     const finalPnlpAmount = pnlpAmount.multipliedBy(
       new BigNumber(10).pow(TOKENS[lpTokenSymbol].decimals)
     );

     const operation = await dexContractInstance.methods
       .remove_liquidity(finalPnlpAmount.toString(), secondTokenMinimumAmount, tezMinimumAmount)
       .send();

     setShowConfirmTransaction && setShowConfirmTransaction(false);
     transactionSubmitModal && transactionSubmitModal(operation.opHash);
     setActiveState && setActiveState(ActiveLiquidity.Staking);
     resetAllValues && resetAllValues();
     if (flashMessageContent) {
       store.dispatch(setFlashMessage(flashMessageContent));
     }
     await operation.confirmation();

     return {
       success: true,
       operationId: operation.opHash,
     };
   } catch (error: any) {
     throw new Error(error.message);
   }
 };
