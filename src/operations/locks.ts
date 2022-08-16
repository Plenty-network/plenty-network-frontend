import { BigNumber } from 'bignumber.js';
import { connectedNetwork, dappClient, voteEscrowAddress } from '../common/walletconnect';
import { IOperationsResponse, TResetAllValues, TTransactionSubmitModal ,TSetShowConfirmTransaction } from './types';
import Config from '../config/config';

export const createLock = async (
    address : string , 
    value = BigNumber,
    endtime : BigNumber,
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
      const plyInstance : any = await Tezos.contract.at(Config.PLY_TOKEN[connectedNetwork]);
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          plyInstance.methods.approve(voteEscrowAddress, value)
        )
        .withContractCall(
          veInstance.methods.create_lock(
            value,
            endtime,
            address
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

  export const increaseLockEnd = async (
    id : number,
    newEnd : BigNumber,
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
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veInstance.methods.increase_lock_end(
            newEnd,
            id
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

  export const increaseLockValue = async (
    id :number, 
    value = BigNumber,
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
      const plyInstance : any = await Tezos.contract.at(Config.PLY_TOKEN[connectedNetwork]);
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          plyInstance.methods.approve(voteEscrowAddress, value)
        )
        .withContractCall(
          veInstance.methods.increase_lock_value(
            id,
            value,
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

  export const withdrawLock = async (
    id : number,
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
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veInstance.methods.withdraw(
            id
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

// TODO :   Ask Claim inflation 

export const claimInflation = async (
    epochs : number[] , 
    id : number,
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
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

    //  TODO :  Confirm how to send epochs

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veInstance.methods.claim_inflation(
            epochs,
            id
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

// TODO : Ask Update Attachments

export const updateAttachments = async (
    attachments : number[] , 
    id : number,
    remove : boolean , 
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
      const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

      let batch = null;

    //  TODO :  Confirm how to send attachments

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          veInstance.methods.update_attachments(
        //    TODO : ADD OPERATOR TYPE CALLING
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

 
