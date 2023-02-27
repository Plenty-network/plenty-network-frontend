import { BigNumber } from "bignumber.js";
import { connectedNetwork, dappClient, voteEscrowAddress, voterAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
} from "./types";
import Config from "../config/config";
import { GAS_LIMIT_EXCESS, PLY_DECIMAL_MULTIPLIER, STORAGE_LIMIT_EXCESS } from "../constants/global";
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { IAllBribesOperationData, IAllClaimableFeesData, IClaimInflationOperationData } from "../api/portfolio/types";
import { getBatchOperationsWithLimits, getMaxPossibleBatchArrayV2 } from "../api/util/operations";
import { store } from "../redux";
import { getDexAddress } from "../api/util/fetchConfig";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { setFlashMessage } from "../redux/flashMessage";

export const createLock = async (
  address: string,
  value: BigNumber,
  endtime: BigNumber,
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

    // Making value to it's proper decimal form
    value = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);

    const Tezos = await dappClient().tezos();
    const plyInstance = await Tezos.wallet.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance = await Tezos.wallet.at(voteEscrowAddress);

    const allBatchOperations: WalletParamsWithKind[] = [];
    // Fisrts op in batch
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...plyInstance.methods
        .approve(voteEscrowAddress, value.decimalPlaces(0, 1))
        .toTransferParams(),
    });

    //Second op in batch
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods
        .create_lock(address, value.decimalPlaces(0, 1), endtime)
        .toTransferParams(),
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

export const increaseLockEnd = async (
  id: number,
  newEnd: BigNumber,
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
    const veInstance = await Tezos.wallet.at(voteEscrowAddress);

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods.increase_lock_end(id, newEnd).toTransferParams(),
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
    if (status === "applied") {
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    } else {
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

export const increaseLockValue = async (
  id: number,
  value: BigNumber,
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
    
    // Making value to it's proper decimal form
    const plyToBeAdded = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);
    const Tezos = await dappClient().tezos();
    const plyInstance = await Tezos.wallet.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance = await Tezos.wallet.at(voteEscrowAddress);

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...plyInstance.methods
        .approve(voteEscrowAddress, plyToBeAdded.decimalPlaces(0, 1))
        .toTransferParams(),
    });

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods
        .increase_lock_value(id, plyToBeAdded.decimalPlaces(0, 1))
        .toTransferParams(),
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

export const increaseLockAndValue = async (
  id: number,
  value: BigNumber,
  newEnd: BigNumber,
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
    // Making value to it's proper decimal form
    const plyToBeAdded = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);

    const Tezos = await dappClient().tezos();
    const plyInstance = await Tezos.wallet.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance = await Tezos.wallet.at(voteEscrowAddress);

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...plyInstance.methods
        .approve(voteEscrowAddress, plyToBeAdded.decimalPlaces(0, 1))
        .toTransferParams(),
    });
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods
        .increase_lock_value(id, plyToBeAdded.decimalPlaces(0, 1))
        .toTransferParams(),
    });
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods
        .increase_lock_end(id, newEnd)
        .toTransferParams(),
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

export const withdrawLock = async (
  id: number,
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
    const veInstance = await Tezos.wallet.at(voteEscrowAddress);

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods.withdraw(id).toTransferParams(),
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
export const claimAllInflation = async (
  inflationData : IClaimInflationOperationData[],
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
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    const inflationBatch: WalletParamsWithKind[] = [];
    for (const inflation of inflationData) {
      inflationBatch.push({
        kind: OpKind.TRANSACTION,
        ...veInstance.methods
          .claim_inflation(inflation.tokenId, inflation.epochs)
          .toTransferParams(),
      });
    }

    const maxPossibleBatch: WalletParamsWithKind[] = await getMaxPossibleBatchArrayV2(inflationBatch);
    
    const batch =  Tezos.wallet.batch(maxPossibleBatch);
      // const batch =  Tezos.wallet.batch(inflationBatch);
    // Tezos.estimate.batch(inflationBatch).then((est) => console.log(est));
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


// For claim all rewards and withdraw for a lock
export const claimAllAndWithdrawLock = async (
  lockId: number,
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

    for (const feeObj of feeData) {
      if(feeObj.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...voterInstance.methods.claim_fee(feeObj.tokenId, feeObj.amm, feeObj.epoch).toTransferParams(),
        });
      }
    }

    for (const bribe of bribeData) {
      if(bribe.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...voterInstance.methods
            .claim_bribe(bribe.tokenId, bribe.amm, bribe.epoch, bribe.bribeId)
            .toTransferParams(),
        });
      }
    }

    for (const inflation of inflationData) {
      if(inflation.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...veInstance.methods.claim_inflation(inflation.tokenId, inflation.epochs).toTransferParams(),
        });
      }
    }

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods.withdraw(lockId).toTransferParams(),
    })

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


/**
 * Detach a vePLY from selected gauge
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param ammAddress - Contract address of the selected pool(optional)
 * @param flashMessageContent - Content for the flash message object(optional)
 */
 export const detachLockFromGauge = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  ammAddress?: string,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = ammAddress || getDexAddress(tokenOneSymbol, tokenTwoSymbol);
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

    const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);

    const limits = await Tezos.estimate
      .transfer(gaugeContractInstance.methods.stake(0, 0).toTransferParams())
      .then((limits) => limits)
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    let gasLimit = 0;
    let storageLimit = 0;

    if(limits !== undefined) {
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

    const operation = await gaugeContractInstance.methods
      .stake(0, 0)
      .send({ gasLimit, storageLimit });

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(operation.opHash as string);
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
    console.log(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

//Claim all rewards, detach if attached and then withdraw lock
export const claimAllDetachAndWithdrawLock = async (
  lockId: number,
  feeData: IAllClaimableFeesData[],
  bribeData: IAllBribesOperationData[],
  inflationData: IClaimInflationOperationData[],
  isAttached: boolean,
  ammAddress: string | undefined,
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

    for (const feeObj of feeData) {
      if(feeObj.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...voterInstance.methods.claim_fee(feeObj.tokenId, feeObj.amm, feeObj.epoch).toTransferParams(),
        });
      }
    }

    for (const bribe of bribeData) {
      if(bribe.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...voterInstance.methods
            .claim_bribe(bribe.tokenId, bribe.amm, bribe.epoch, bribe.bribeId)
            .toTransferParams(),
        });
      }
    }

    for (const inflation of inflationData) {
      if(inflation.tokenId === lockId) {
        allBatch.push({
          kind: OpKind.TRANSACTION,
          ...veInstance.methods.claim_inflation(inflation.tokenId, inflation.epochs).toTransferParams(),
        });
      }
    }
    // Check if lock is attched to a gauge and add detach op to batch if valid amm and gauge exist.
    if (isAttached) {
      const state = store.getState();
      const AMM = state.config.AMMs;
      const dexContractAddress = ammAddress;
      if (dexContractAddress === "false" || dexContractAddress === undefined) {
        throw new Error("AMM does not exist for the selected pair.");
      }
      const gaugeAddress: string | undefined = AMM[dexContractAddress].gauge;
      if (gaugeAddress === undefined) {
        throw new Error("Gauge does not exist for the selected pair.");
      }
      const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...gaugeContractInstance.methods.stake(0, 0).toTransferParams(),
      });
    }

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...veInstance.methods.withdraw(lockId).toTransferParams(),
    })

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