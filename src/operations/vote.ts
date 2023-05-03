import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { dappClient, voteEscrowAddress, voterAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IVotes,
} from "./types";
import {
  IAllBribesOperationData,
  IAllClaimableFeesData,
  IAllEpochClaimData,
  IClaimInflationOperationData,
} from "../api/portfolio/types";
import { getBatchOperationsWithLimits, getMaxPossibleBatchArrayV2} from "../api/util/operations";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { GAS_LIMIT_EXCESS, STORAGE_LIMIT_EXCESS } from "../constants/global";
import { BigNumber } from "bignumber.js";

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
    const voterInstance = await Tezos.wallet.at(voterAddress);

    /* const limits = await Tezos.estimate
      .transfer(voterInstance.methods.vote(id, votes).toTransferParams())
      .then((limits) => limits)
      .catch((err) => {
        console.log(err);
        return undefined;
      });

    let gasLimit = 0;
    let storageLimit = 0;

    if (limits !== undefined) {
      gasLimit = new BigNumber(limits.gasLimit)
        .plus(new BigNumber(limits.gasLimit).multipliedBy(GAS_LIMIT_EXCESS))
        .decimalPlaces(0, 1)
        .toNumber();
      storageLimit = new BigNumber(limits.storageLimit)
        .plus(new BigNumber(limits.storageLimit).multipliedBy(STORAGE_LIMIT_EXCESS))
        .decimalPlaces(0, 1)
        .toNumber();
    } else {
      throw new Error("Failed to estimate transaction limits");
    }

    const operation = await voterInstance.methods.vote(id, votes).send({ gasLimit, storageLimit }); */
    const allBatchOperations: WalletParamsWithKind[] = [];
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...voterInstance.methods.vote(id, votes).toTransferParams(),
    });

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatchOperations);
    
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOp = await batch.send();
    
    setShowConfirmTransaction(false);
    resetAllValues();

    transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if( status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
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

    await batchOp.confirmation(1);
    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
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

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
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

    await batchOp.confirmation(1);
    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
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

    const bestPossibleBatch = await getMaxPossibleBatchArrayV2(allBatch);

    const batch = Tezos.wallet.batch(bestPossibleBatch);

    const batchOp = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
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

    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }else{
      throw new Error(status);
    }
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
