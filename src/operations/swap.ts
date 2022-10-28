import { getDexAddress } from "../api/util/fetchConfig";
import { store} from "../redux";
import { BigNumber } from "bignumber.js";
import { TokenVariant } from "../config/types";
import { OpKind } from "@taquito/taquito";
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
    if (tokenIn === "tez" && tokenOut === "ctez") {
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
    } else if (tokenIn === "ctez" && tokenOut === "tez") {
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
    const TOKEN = state.config.standard;

    const TOKEN_IN = TOKEN[tokenIn];
    const TOKEN_OUT = TOKEN[tokenOut];

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    const tokenInId = TOKEN_IN.tokenId ?? 0;
    const tokenOutAddress = TOKEN_OUT.address;
    const tokenOutId = TOKEN_OUT.tokenId ?? 0;
    const Tezos = await dappClient().tezos();
    const tokenInAddress = TOKEN_IN.address as string;
    const tokenInInstance: any = await Tezos.contract.at(tokenInAddress);
    const dexContractInstance: any = await Tezos.contract.at(dexContractAddress);

    tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(TOKEN_IN.decimals));
    minimumTokenOut = minimumTokenOut.multipliedBy(new BigNumber(10).pow(TOKEN_OUT.decimals));

    let batch = null;
    // Approve call for FA1.2 type token
    if (TOKEN_IN.variant === TokenVariant.FA12) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenInInstance.methods.approve(dexContractAddress, tokenInAmount.decimalPlaces(0,1)))
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut.decimalPlaces(0,1).toString(),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount.decimalPlaces(0,1)
          )
        );
    }
    // add_operator for FA2 type token
    else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ])
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut.decimalPlaces(0,1).toString(),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount.decimalPlaces(0,1)
          )
        )
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ])
        );
    }

    const batchOperation: any = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);

    transactionSubmitModal(batchOperation.opHash);
    resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    const opHash = await batchOperation.confirmation(1);

    const status = await batchOperation.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOperation.opHash,
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
    const TOKEN = state.config.standard;

    const TOKEN_IN = TOKEN[tokenIn];

    const contractAddress = getDexAddress(tokenIn, tokenOut);
    const CTEZ = TOKEN_IN.address as string;
    const tokenInDecimals = TOKEN_IN.decimals;
    const Tezos = await dappClient().tezos();
    const contract = await Tezos.wallet.at(contractAddress);
    const ctez_contract = await Tezos.wallet.at(CTEZ);
    const batch = Tezos.wallet
      .batch()
      .withContractCall(
        ctez_contract.methods.approve(
          contractAddress,
          tokenInAmount.multipliedBy(new BigNumber(10).pow(tokenInDecimals)).decimalPlaces(0,1).toString()
        )
      )
      .withContractCall(
        contract.methods.ctez_to_tez(
          tokenInAmount.multipliedBy(new BigNumber(10).pow(tokenInDecimals)).decimalPlaces(0,1).toString(),
          minimumTokenOut.multipliedBy(new BigNumber(10).pow(tokenInDecimals)).decimalPlaces(0,1).toString(),
          recipent
        )
      )
      .withContractCall(ctez_contract.methods.approve(contractAddress, 0));
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
    const batch = Tezos.wallet.batch([
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .tez_to_ctez(
            minimumTokenOut.multipliedBy(new BigNumber(10).pow(tokenOutDecimals)).decimalPlaces(0,1).toString(),
            recipent
          )
          .toTransferParams({
            amount: Number(
              tokenInAmount.multipliedBy(new BigNumber(10).pow(tokenInDecimals)).decimalPlaces(0,1).toString()
            ),
            mutez: true,
          }),
      },
    ]);

    const batchOp: any = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);

    transactionSubmitModal(batchOp.opHash);
    resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    // dispatch(
    //   setFlashMessage({
    //     flashType: Flashtype.Success,
    //     headerText: "Success",
    //     trailingText: `Swap confirmed`,
    //     linkText: "View in Explorer",
    //     isLoading: true,
    //     transactionId: "",
    //   })
    // );
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
