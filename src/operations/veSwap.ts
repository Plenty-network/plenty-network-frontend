import { dappClient, veSwapAddress } from '../common/walletconnect';
import { IOperationsResponse, TResetAllValues, TTransactionSubmitModal ,TSetShowConfirmTransaction, IVotes } from './types';
import { BigNumber } from 'bignumber.js';
import { store } from '../redux';
import { setFlashMessage } from '../redux/flashMessage';
import { IFlashMessageProps } from '../redux/flashMessage/type';
import { checkOperationConfirmation } from '../api/util/operations';


// TODO : VERIFY OPERATIONS

export const claim = async (
    transactionSubmitModal: TTransactionSubmitModal,
    resetAllValues: TResetAllValues,
    setShowConfirmTransaction: TSetShowConfirmTransaction,
    flashMessageContent?: IFlashMessageProps
  ): Promise<IOperationsResponse> => {
    try {
      const {CheckIfWalletConnected}=dappClient()
      const WALLET_RESP = await CheckIfWalletConnected();
      if (!WALLET_RESP.success) {
        throw new Error('Wallet connection failed');
      }
  
      const Tezos = await dappClient().tezos();
      const veSwapInstance: any = await Tezos.contract.at(veSwapAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veSwapInstance.methods.claim()
        );

        const batchOp = await batch.send();
        setShowConfirmTransaction(false);
        resetAllValues();
  
        transactionSubmitModal(batchOp.opHash);
        if (flashMessageContent) {
          store.dispatch(setFlashMessage(flashMessageContent));
        }
  
        await batchOp.confirmation();

        const res =  await checkOperationConfirmation(batchOp.opHash);
        if(res.success){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(res.error);
    }
        
      
    } catch (error : any) {
      console.error(error);
      return {
        success: false,
        operationId: undefined,
        error : error.message,
      };
    }
  };


  // PLENTY = sp.nat(0)
  // WRAP = sp.nat(1) 
  
  export const exchange = async (
    token : number,
    value : BigNumber,
    transactionSubmitModal: TTransactionSubmitModal,
    resetAllValues: TResetAllValues,
    setShowConfirmTransaction: TSetShowConfirmTransaction,
    flashMessageContent?: IFlashMessageProps
  ): Promise<IOperationsResponse> => {
    try {
      const {CheckIfWalletConnected}=dappClient()
      const WALLET_RESP = await CheckIfWalletConnected();
      if (!WALLET_RESP.success) {
        throw new Error('Wallet connection failed');
      }
  
      const Tezos = await dappClient().tezos();
      const veSwapInstance: any = await Tezos.contract.at(veSwapAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veSwapInstance.methods.exchange(
              token,
              value
          )
        );

        const batchOp = await batch.send();
        setShowConfirmTransaction(false);
        resetAllValues();
  
        transactionSubmitModal(batchOp.opHash);
        if (flashMessageContent) {
          store.dispatch(setFlashMessage(flashMessageContent));
        }
  
        await batchOp.confirmation();

        const res =  await checkOperationConfirmation(batchOp.opHash);
    if(res.success){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(res.error);
    }
      
    } catch (error : any) {
      console.error(error);
      return {
        success: false,
        operationId: undefined,
        error : error.message,
      };
    }
  };