import { OpKind } from "@taquito/taquito";
import { dappClient, feeDistributorAddress} from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IEpochVoteShare,
} from "./types";


// TO BE DELETED
// HANDLED IN VOTER :(

export const claimFees = async (
  id : number,
  address : string,
  amm : string,
  epochVoteShare : IEpochVoteShare[] ,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }


    const Tezos = await dappClient().tezos();
    const feeDistributorInstance: any = await Tezos.contract.at(feeDistributorAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(feeDistributorInstance.methods.claim(id, address , amm, epochVoteShare));

    const batchOp = await batch.send();
    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(batchOp.opHash);

    await batchOp.confirmation();
    return {
      success: true,
      operationId: batchOp.opHash,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

export const claimAllFees = async (
    id : number,
    address : string,
    amms : string[],
    epochVoteShare : { [id: string] : IEpochVoteShare[] } ,
    transactionSubmitModal: TTransactionSubmitModal,
    resetAllValues: TResetAllValues,
    setShowConfirmTransaction: TSetShowConfirmTransaction
  ): Promise<IOperationsResponse> => {
    try {
      const { CheckIfWalletConnected } = dappClient();
      const WALLET_RESP = await CheckIfWalletConnected();
      if (!WALLET_RESP.success) {
        throw new Error("Wallet connection failed");
      }
    
      
      const Tezos = await dappClient().tezos();
      const feeDistributorInstance: any = await Tezos.contract.at(feeDistributorAddress);

      const feesBatch : any = [];
        for (const amm of amms) {
          feesBatch.push({
            kind: OpKind.TRANSACTION,
            ...feeDistributorInstance.methods.claim(id, address , amm, epochVoteShare[amm]).toTransferParams(),
          });
        }
      const batch =  Tezos.wallet.batch(feesBatch);    
  
      const batchOp = await batch.send();
      setShowConfirmTransaction(false);
      resetAllValues();
  
      transactionSubmitModal(batchOp.opHash);
  
      await batchOp.confirmation();
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        operationId: undefined,
        error: error.message,
      };
    }
  };