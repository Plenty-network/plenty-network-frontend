import { BigNumber } from "bignumber.js";
import { connectedNetwork, dappClient, voteEscrowAddress, voterAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IAttachmentLiteral,
} from "./types";
import Config from "../config/config";
import { PLY_DECIMAL_MULTIPLIER } from "../constants/global";
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { IAllBribesOperationData, IAllClaimableFeesData, IClaimInflationOperationData } from "../api/portfolio/types";
import { getMaxPossibleBatchArray, getMaxPossibleBatchArrayV2 } from "../api/util/operations";
import { store } from "../redux";
import { getDexAddress } from "../api/util/fetchConfig";

export const createLock = async (
  address: string,
  value: BigNumber,
  endtime: BigNumber,
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

    // Making value to it's proper decimal form
    value = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);

    const Tezos = await dappClient().tezos();
    const plyInstance: any = await Tezos.contract.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet
      .batch()
      .withContractCall(plyInstance.methods.approve(voteEscrowAddress, value))
      .withContractCall(veInstance.methods.create_lock(address, value, endtime));

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

export const increaseLockEnd = async (
  id: number,
  newEnd: BigNumber,
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
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(veInstance.methods.increase_lock_end(id, newEnd));

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

export const increaseLockValue = async (
  id: number,
  value: BigNumber,
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
    
    // Making value to it's proper decimal form
    const plyToBeAdded = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);
    const Tezos = await dappClient().tezos();
    const plyInstance: any = await Tezos.contract.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet
      .batch()
      .withContractCall(plyInstance.methods.approve(voteEscrowAddress, plyToBeAdded))
      .withContractCall(veInstance.methods.increase_lock_value(id, plyToBeAdded));

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

export const increaseLockAndValue = async (
  id: number,
  value: BigNumber,
  newEnd: BigNumber,
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
    // Making value to it's proper decimal form
    const plyToBeAdded = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);

    const Tezos = await dappClient().tezos();
    const plyInstance: any = await Tezos.contract.at(Config.PLY_TOKEN[connectedNetwork]);
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet
      .batch()
      .withContractCall(plyInstance.methods.approve(voteEscrowAddress, plyToBeAdded))
      .withContractCall(veInstance.methods.increase_lock_value(id, plyToBeAdded))
      .withContractCall(veInstance.methods.increase_lock_end(id, newEnd));

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

export const withdrawLock = async (
  id: number,
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
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(veInstance.methods.withdraw(id));

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

// CHECK FLOW ONCE
export const withdrawLockWithInflation = async (
  id: number,
  epochs: number[],
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
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet
      .batch()
      .withContractCall(veInstance.methods.claim_inflation(id, epochs))
      .withContractCall(veInstance.methods.withdraw(id));

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

//Might be depracated
export const claimInflation = async (
  epochs: number[],
  id: number,
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
    const veInstance: any = await Tezos.contract.at(voteEscrowAddress);

    let batch = null;

    batch = Tezos.wallet.batch().withContractCall(veInstance.methods.claim_inflation(id, epochs));

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
export const claimAllInflation = async (
  inflationData : IClaimInflationOperationData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined
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


// For claim all rewards and withdraw for a lock
export const claimAllAndWithdrawLock = async (
  lockId: number,
  feeData: IAllClaimableFeesData[],
  bribeData: IAllBribesOperationData[],
  inflationData: IClaimInflationOperationData[],
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined
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


/**
 * Detach a vePLY from selected gauge
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param ammAddress - Contract address of the selected pool(optional)
 */
 export const detachLockFromGauge = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  ammAddress?: string
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = ammAddress || getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('AMM does not exist for the selected pair.');
    }
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gaugeAddress;
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

    const operation = await gaugeContractInstance.methods.stake(0, 0).send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(operation.opHash as string);
    resetAllValues && resetAllValues();

    await operation.confirmation();
    return {
      success: true,
      operationId: operation.opHash,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};