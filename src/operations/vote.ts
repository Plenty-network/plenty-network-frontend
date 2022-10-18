import { OpKind } from "@taquito/taquito";
import { dappClient, voteEscrowAddress, voterAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IVotes,
} from "./types";
import { BigNumber } from "bignumber.js";
import {
  IAllBribesOperationData,
  IAllClaimableFeesData,
  IAllEpochClaimData,
  IClaimInflationOperationData,
} from "../api/portfolio/types";
import { getMaxPossibleBatchArray, getMaxPossibleBatchArrayV2 } from "../api/util/operations";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";

export const vote = async (
  id: number,
  votes: IVotes[],
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    let batch = null;

    //  TODO :  Confirm how to send votes

    // TODO : Check Calling

    batch = Tezos.wallet.batch().withContractCall(voterInstance.methods.vote(id, votes));

    const batchOp = await batch.send();
    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// Might Depracate as claimAllBribe with single object can also work
export const claimBribe = async (
  tokenId: number,
  epoch: number,
  bribeId: number,
  amm: string,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    let batch = null;

    batch = Tezos.wallet
      .batch()
      .withContractCall(voterInstance.methods.claim_bribe(tokenId, amm, epoch, bribeId));

    const batchOp = await batch.send();
    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// FOR STAT
export const claimAllBribeForAllLocks = async (
  bribeData: IAllBribesOperationData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    const bribeBatch: any = [];
    for (const bribe of bribeData) {
      bribeBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_bribe(bribe.tokenId, bribe.amm, bribe.epoch, bribe.bribeId)
          .toTransferParams(),
      });
    }
    
    const bestPossibleBatch = await getMaxPossibleBatchArrayV2(bribeBatch);
    
    const batch = Tezos.wallet.batch(bestPossibleBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// Might Depracate as claimAllFeeForAllLocks with single object can also work
export const claimFee = async (
  epochs: number[],
  id: number,
  amm: string,
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
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(voterInstance.methods.claim_fee(id, amm, epochs));

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

// Might Depracate as claimAllFeeForAllLocks with single object can also work
export const claimAllFee = async (
  epochs: { [id: string]: number[] },
  id: number,
  amms: string[],
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
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    const feesBatch: any = [];
    for (const amm of amms) {
      feesBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods.claim_fee(id, amm, epochs[amm]).toTransferParams(),
      });
    }
    const batch = Tezos.wallet.batch(feesBatch);

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

// FOR STAT
export const claimAllFeeForAllLocks = async (
  feeData: IAllClaimableFeesData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    const feesBatch: any = [];
    for (const feeObj of feeData) {
      feesBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_fee(feeObj.tokenId, feeObj.amm, feeObj.epoch)
          .toTransferParams(),
      });
    }
    const bestPossibleBatch = await getMaxPossibleBatchArrayV2(feesBatch);
    
    const batch = Tezos.wallet.batch(bestPossibleBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// FOR MID LEVEL CLAIM (FEES and BRIBES)
export const claimAllRewardsForAllLocks = async (
  bribeData: IAllBribesOperationData[],
  feeData: IAllClaimableFeesData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    const allBatch: any = [];
    for (const feeObj of feeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_fee(feeObj.tokenId, feeObj.amm, feeObj.epoch)
          .toTransferParams(),
      });
    }

    for (const bribe of bribeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_bribe(bribe.tokenId, bribe.amm, bribe.epoch, bribe.bribeId)
          .toTransferParams(),
      });
    }
    
    const bestPossibleBatch = await getMaxPossibleBatchArrayV2(allBatch);
    
    const batch = Tezos.wallet.batch(bestPossibleBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// FOR EPOCH LEVEL CLAIM
export const claimAllForEpoch = async (
  { tokenId, epoch, bribeData, feeData }: IAllEpochClaimData,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);

    const allBatch: any = [];

    for (const amm of feeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods.claim_fee(tokenId, amm, [epoch]).toTransferParams(),
      });
    }

    for (const bribe of bribeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_bribe(tokenId, bribe.amm, epoch, bribe.bribeId)
          .toTransferParams(),
      });
    }

    const batch = Tezos.wallet.batch(allBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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

// CLAIMS EVERYTHING (ALL STATS)
export const claimSupernova = async (
  guages: string[],
  feeData: IAllClaimableFeesData[],
  bribeData: IAllBribesOperationData[],
  inflationData: IClaimInflationOperationData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const voterInstance: any = await Tezos.contract.at(voterAddress);
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    const allBatch: any = [];

    const promises = [];
    for (var guage of guages) {
      promises.push(await Tezos.wallet.at(guage));
    }
    const response = await Promise.all(promises);
    for (const key in response) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...response[key].methods.get_reward([["unit"]]).toTransferParams(),
      });
    }

    for (const feeObj of feeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods.claim_fee(feeObj.tokenId, feeObj.amm, feeObj.epoch).toTransferParams(),
      });
    }

    for (const bribe of bribeData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...voterInstance.methods
          .claim_bribe(bribe.tokenId, bribe.amm, bribe.epoch, bribe.bribeId)
          .toTransferParams(),
      });
    }

    for (const inflation of inflationData) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...veInstance.methods.claim_inflation(inflation.tokenId, inflation.epochs).toTransferParams(),
      });
    }

    const bestPossibleBatch = await getMaxPossibleBatchArrayV2(allBatch);
    const batch = Tezos.wallet.batch(bestPossibleBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

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
