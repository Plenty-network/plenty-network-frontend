import { OpKind, ParamsWithKind, WalletParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient, voteEscrowAddress } from '../common/walletconnect';
import { ActiveLiquidity } from '../components/Pools/ManageLiquidityHeader';
import { GAS_LIMIT_EXCESS, STORAGE_LIMIT_EXCESS } from '../constants/global';
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
 * Stake PNLP token operation for the selected pair of tokens
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param pnlpAmount - Amount of PNLP token the user wants to stake
 * @param tokenId - Token ID for veNFT selected by user for boosting. 'undefined' if nothing selected
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 */
export const stakePnlpTokensV1 = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  pnlpAmount: string | BigNumber,
  tokenId: number | undefined,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined
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

    const pnlpTokenContractInstance = await Tezos.wallet.at(
      AMM[dexContractAddress].lpToken.address as string
    );
    const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);
    const voteEscrowInstance = await Tezos.wallet.at(voteEscrowAddress);

    const pnlpAmountToStake = new BigNumber(pnlpAmount).multipliedBy(
      new BigNumber(10).pow(AMM[dexContractAddress].lpToken.decimals)
    );

    let batch = null;

    if (tokenId) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          pnlpTokenContractInstance.methods.approve(gaugeAddress, pnlpAmountToStake.toString())
        )
        .withContractCall(
          voteEscrowInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: gaugeAddress,
                token_id: tokenId,
              },
            },
          ])
        )
        .withContractCall(
          gaugeContractInstance.methods.stake(pnlpAmountToStake.toString(), tokenId)
        );
    } else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          pnlpTokenContractInstance.methods.approve(gaugeAddress, pnlpAmountToStake.toString())
        )
        .withContractCall(gaugeContractInstance.methods.stake(pnlpAmountToStake.toString(), 0));
    }

    const batchOperation = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(batchOperation.opHash as string);
    setActiveState && setActiveState(ActiveLiquidity.Rewards);
    resetAllValues && resetAllValues();
    await batchOperation.confirmation(1);

    const status = await batchOperation.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOperation.opHash,
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





/**
 * Stake PNLP token operation for the selected gauge(pool) or detach a vePLY from selected gauge
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param pnlpAmount - Amount of PNLP token the user wants to stake
 * @param tokenId - Token ID for veNFT selected by user for boosting. 'undefined' if nothing selected
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param flashMessageContent - Content for the flash message object(optional)
 */
 export const stakePnlpTokens = async (
   tokenOneSymbol: string,
   tokenTwoSymbol: string,
   pnlpAmount: string | BigNumber,
   tokenId: number | undefined,
   userTezosAddress: string,
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
       throw new Error("Wallet connection failed.");
     }
     const Tezos = await dappClient().tezos();

     const PNLP_TOKEN = AMM[dexContractAddress].lpToken;

     const pnlpTokenContractInstance = await Tezos.wallet.at(PNLP_TOKEN.address);
     const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);
     const voteEscrowInstance = await Tezos.wallet.at(voteEscrowAddress);

     const pnlpAmountToStake = new BigNumber(pnlpAmount).multipliedBy(
       new BigNumber(10).pow(PNLP_TOKEN.decimals)
     );

     const allBatchOperations: WalletParamsWithKind[] = [];

     if (pnlpAmountToStake.isGreaterThan(0)) {
       allBatchOperations.push({
         kind: OpKind.TRANSACTION,
         ...pnlpTokenContractInstance.methods
           .approve(gaugeAddress, pnlpAmountToStake.decimalPlaces(0, 1).toString())
           .toTransferParams(),
       });
     }
     if (tokenId) {
       allBatchOperations.push({
         kind: OpKind.TRANSACTION,
         ...voteEscrowInstance.methods
           .update_operators([
             {
               add_operator: {
                 owner: userTezosAddress,
                 operator: gaugeAddress,
                 token_id: tokenId,
               },
             },
           ])
           .toTransferParams(),
       });
     }
     allBatchOperations.push({
       kind: OpKind.TRANSACTION,
       ...gaugeContractInstance.methods
         .stake(pnlpAmountToStake.decimalPlaces(0, 1).toString(), tokenId || 0)
         .toTransferParams(),
     });

     const limits = await Tezos.estimate
       .batch(allBatchOperations as ParamsWithKind[])
       .then((limits) => limits)
       .catch((err) => {
         console.log(err);
         return undefined;
       });

     const updatedBatchOperations: WalletParamsWithKind[] = [];
     if (limits !== undefined) {
       allBatchOperations.forEach((op, index) => {
         const gasLimit = new BigNumber(limits[index].gasLimit)
           .plus(new BigNumber(limits[index].gasLimit).multipliedBy(GAS_LIMIT_EXCESS))
           .decimalPlaces(0, 1)
           .toNumber();
         const storageLimit = new BigNumber(limits[index].storageLimit)
           .plus(new BigNumber(limits[index].storageLimit).multipliedBy(STORAGE_LIMIT_EXCESS))
           .decimalPlaces(0, 1)
           .toNumber();

         updatedBatchOperations.push({
           ...op,
           gasLimit,
           storageLimit,
         });
       });
     } else {
       throw new Error("Failed to create batch");
     }

     const batch = Tezos.wallet.batch(updatedBatchOperations);
     const batchOperation = await batch.send();

     setShowConfirmTransaction && setShowConfirmTransaction(false);
     transactionSubmitModal && transactionSubmitModal(batchOperation.opHash as string);
     setActiveState && setActiveState(ActiveLiquidity.Rewards);
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
     return {
       success: false,
       operationId: undefined,
       error: error.message,
     };
   }
 };
