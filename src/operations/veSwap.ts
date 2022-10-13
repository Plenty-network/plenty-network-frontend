import { dappClient, veSwapAddress } from '../common/walletconnect';
import { IOperationsResponse, TResetAllValues, TTransactionSubmitModal ,TSetShowConfirmTransaction, IVotes } from './types';
import { BigNumber } from 'bignumber.js';


// TODO : VERIFY OPERATIONS

export const claim = async (
    transactionSubmitModal: TTransactionSubmitModal,
    resetAllValues: TResetAllValues,
    setShowConfirmTransaction: TSetShowConfirmTransaction
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
  
        await batchOp.confirmation();
        return {
          success: true,
          operationId: batchOp.opHash,
        };
      
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
    setShowConfirmTransaction: TSetShowConfirmTransaction
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
  
        await batchOp.confirmation();
        return {
          success: true,
          operationId: batchOp.opHash,
        };
      
    } catch (error : any) {
      console.error(error);
      return {
        success: false,
        operationId: undefined,
        error : error.message,
      };
    }
  };