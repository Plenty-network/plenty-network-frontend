import { getDexAddress } from "../api/util/fetchConfig";
import { store} from "../redux";
import { BigNumber } from "bignumber.js";
import { TokenStandard } from "../config/types";
import { OpKind, ParamsWithKind, WalletParamsWithKind } from "@taquito/taquito";
import { routerSwap } from "./router";
import { dappClient } from "../common/walletconnect";
import {
  IOperationsResponse,
  TResetAllValues,
  TTransactionSubmitModal,
  TSetShowConfirmTransaction,
} from "./types";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import { GAS_LIMIT_EXCESS, STORAGE_LIMIT_EXCESS } from "../constants/global";

export const allSwapWrapper = async (
  tokenInAmount: BigNumber,
  path: string[],
  minimumOut_All: BigNumber[],
  caller: string,
  recipent: string,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    let res;
    if (path.length === 2) {
      // directSwap
      res = await directSwapWrapper(
        path[0],
        path[1],
        minimumOut_All[0],
        recipent,
        tokenInAmount,
        caller,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        flashMessageContent
      );
    } else {
      // routerSwap
      res = await routerSwap(
        path,
        minimumOut_All,
        caller,
        recipent,
        tokenInAmount,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        flashMessageContent
      );
    }
    return {
      success: res.success,
      operationId: res.operationId ?? undefined,
      error: res.error ?? undefined,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

export const directSwapWrapper = async (
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  caller: string,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    let res;
    if (tokenIn === "XTZ" && tokenOut === "CTez") {
      res = await tez_to_ctez(
        tokenIn,
        tokenOut,
        minimumTokenOut,
        recipent,
        tokenInAmount,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        flashMessageContent
      );
    } else if (tokenIn === "CTez" && tokenOut === "XTZ") {
      res = await ctez_to_tez(
        tokenIn,
        tokenOut,
        minimumTokenOut,
        recipent,
        tokenInAmount,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        flashMessageContent
      );
    } else {
      res = await swapTokens(
        tokenIn,
        tokenOut,
        minimumTokenOut,
        recipent,
        tokenInAmount,
        caller,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        flashMessageContent
      );
    }
    return {
      success: res.success,
      operationId: res.operationId ?? undefined,
      error: res.error ?? undefined,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

const swapTokens = async (
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  caller: string,
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

    const state = store.getState();
    const TOKEN = state.config.tokens;

    const TOKEN_IN = TOKEN[tokenIn];
    const TOKEN_OUT = TOKEN[tokenOut];

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    const tokenInId = TOKEN_IN.tokenId ?? 0;
    const tokenOutAddress = TOKEN_OUT.address;
    const tokenOutId = TOKEN_OUT.tokenId ?? 0;
    const Tezos = await dappClient().tezos();
    const tokenInAddress = TOKEN_IN.address as string;
    const tokenInInstance = await Tezos.wallet.at(tokenInAddress);
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

    tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(TOKEN_IN.decimals));
    minimumTokenOut = minimumTokenOut.multipliedBy(new BigNumber(10).pow(TOKEN_OUT.decimals));

    const allBatchOperations: WalletParamsWithKind[] = [];
    // Approve call for FA1.2 type token
    if (TOKEN_IN.standard === TokenStandard.FA12) {
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...tokenInInstance.methods
          .approve(dexContractAddress, tokenInAmount.decimalPlaces(0, 1))
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...dexContractInstance.methods
          .Swap(
            minimumTokenOut.decimalPlaces(0, 1).toString(),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount.decimalPlaces(0, 1)
          )
          .toTransferParams(),
      });
    }
    // add_operator for FA2 type token
    else {
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...tokenInInstance.methods
          .update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ])
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...dexContractInstance.methods
          .Swap(
            minimumTokenOut.decimalPlaces(0, 1).toString(),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount.decimalPlaces(0, 1)
          )
          .toTransferParams(),
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...tokenInInstance.methods
          .update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ])
          .toTransferParams(),
      });
    }

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
    const batchOperation: any = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);

    transactionSubmitModal(batchOperation.opHash);
    resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    const opHash = await batchOperation.confirmation(1);

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
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
};

async function ctez_to_tez(
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }
    const state = store.getState();
    const TOKEN = state.config.tokens;

    const TOKEN_IN = TOKEN[tokenIn];

    const contractAddress = getDexAddress(tokenIn, tokenOut);
    const CTEZ = TOKEN_IN.address as string;
    const tokenInDecimals = TOKEN_IN.decimals;
    const Tezos = await dappClient().tezos();
    const contract = await Tezos.wallet.at(contractAddress);
    const ctez_contract = await Tezos.wallet.at(CTEZ);

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...ctez_contract.methods
        .approve(
          contractAddress,
          tokenInAmount
            .multipliedBy(new BigNumber(10).pow(tokenInDecimals))
            .decimalPlaces(0, 1)
            .toString()
        )
        .toTransferParams(),
    });
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...contract.methods
        .ctez_to_tez(
          tokenInAmount
            .multipliedBy(new BigNumber(10).pow(tokenInDecimals))
            .decimalPlaces(0, 1)
            .toString(),
          minimumTokenOut
            .multipliedBy(new BigNumber(10).pow(tokenInDecimals))
            .decimalPlaces(0, 1)
            .toString(),
          recipent
        )
        .toTransferParams(),
    });
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...ctez_contract.methods.approve(contractAddress, 0).toTransferParams(),
    });

    const limits = await Tezos.estimate
      .batch(allBatchOperations as ParamsWithKind[])
      .then((limits) => limits)
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    
    const updatedBatchOperations: WalletParamsWithKind[] = [];
    if(limits !== undefined) {
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
    const batchOp: any = await batch.send();
    {
      batchOp.opHash === null
        ? console.log("operation getting injected")
        : console.log("operation injected");
    }

    setShowConfirmTransaction && setShowConfirmTransaction(false);

    transactionSubmitModal(batchOp.opHash);
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    resetAllValues();
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
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function tez_to_ctez(
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const contractAddress = getDexAddress(tokenIn, tokenOut);
    const Tezos = await dappClient().tezos();
    const contract = await Tezos.wallet.at(contractAddress);

    const tokenInDecimals = 6;
    const tokenOutDecimals = 6;

    const allBatchOperations: WalletParamsWithKind[] = [];

    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...contract.methods
        .tez_to_ctez(
          minimumTokenOut
            .multipliedBy(new BigNumber(10).pow(tokenOutDecimals))
            .decimalPlaces(0, 1)
            .toString(),
          recipent
        )
        .toTransferParams({
          amount: Number(
            tokenInAmount
              .multipliedBy(new BigNumber(10).pow(tokenInDecimals))
              .decimalPlaces(0, 1)
              .toString()
          ),
          mutez: true,
        }),
    });

    const limits = await Tezos.estimate
      .batch(allBatchOperations as ParamsWithKind[])
      .then((limits) => limits)
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    
    const updatedBatchOperations: WalletParamsWithKind[] = [];
    if(limits !== undefined) {
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
    const batchOp: any = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);

    transactionSubmitModal(batchOp.opHash);
    resetAllValues();
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
    return {
      success: false,
      error: error.message,
    };
  }
}
