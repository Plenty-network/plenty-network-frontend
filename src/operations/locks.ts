import { BigNumber } from "bignumber.js";
import { connectedNetwork, dappClient, voteEscrowAddress } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
  IAttachmentLiteral,
} from "./types";
import Config from "../config/config";
import { PLY_DECIMAL_MULTIPLIER } from "../constants/global";
import { OpKind } from "@taquito/taquito";

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

export const claimAllInflation = async (
  inflationData : {id : number , epochs : number[]}[],
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

    const inflationBatch : any = [];
        for (const inflation of inflationData) {
          inflationBatch.push({
            kind: OpKind.TRANSACTION,
            ...veInstance.methods.claim_inflation(inflation.id , inflation.epochs
            ).toTransferParams(),
          });
        }
      const batch =  Tezos.wallet.batch(inflationBatch);

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


