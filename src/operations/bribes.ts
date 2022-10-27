import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { getDexAddress } from "../api/util/fetchConfig";
import { dappClient } from "../common/walletconnect";
import { TokenVariant } from "../config/types";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "./types";

/**
 * Performs the addition of bribe for a pool for one or more epochs selected.
 * @param tokenOneSymbol - Symbol of the first token of the selected pool
 * @param tokenTwoSymbol - Symbol of the second token of the selected pool
 * @param epochNumbers - List of all epochs for which the bribes has to be added
 * @param bribeTokenSymbol - Symbol of the token of which the bribe is being added to the pool
 * @param bribeAmount - Bribe amount for one epoch
 * @param userTezosAddress - Tezos wallet address of the provider
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param ammAddress - Contract address of the selected pool(optional)
 * @param flashMessageContent - Content for the flash message object(optional)
 */
export const addBribe = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  epochNumbers: number[],
  bribeTokenSymbol: string,
  bribeAmount: string | BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  ammAddress?: string,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const TOKENS = state.config.tokens;
    const dexContractAddress = ammAddress || getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const bribeAddress: string | undefined = AMM[dexContractAddress].bribeAddress;
    if (bribeAddress === undefined) {
      throw new Error("Bribe does not exist for the selected pair.");
    }
    const bribeToken = TOKENS[bribeTokenSymbol];
    
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed.");
    }
    const Tezos = await dappClient().tezos();

    let bribeTokenContractInstance;
    // Create a token instance for all non tez tokens
    if (bribeToken.address !== undefined) {
      bribeTokenContractInstance = await Tezos.wallet.at(bribeToken.address as string);
    }
    const bribeContractInstance = await Tezos.wallet.at(bribeAddress);
    // Bribe value for one epoch (value entered by user in UI)
    const epochBribeValue = new BigNumber(bribeAmount).multipliedBy(
      new BigNumber(10).pow(bribeToken.decimals)
    );
    // Bribe value for all the epochs selected by user
    const totalBribeValue = new BigNumber(bribeAmount)
      .multipliedBy(epochNumbers.length)
      .multipliedBy(new BigNumber(10).pow(bribeToken.decimals));

    const allBatchOperations: WalletParamsWithKind[] = [];

    if (bribeToken.variant === TokenVariant.TEZ) {
      epochNumbers.forEach((epoch) => {
        allBatchOperations.push({
          kind: OpKind.TRANSACTION,
          ...bribeContractInstance.methods
            .add_bribe(epoch, "tez", "unit", epochBribeValue.decimalPlaces(0, 1).toString())
            .toTransferParams({
              amount: epochBribeValue.decimalPlaces(0, 1).toNumber(),
              mutez: true,
            }),
        });
      });
    } else if (bribeToken.variant === TokenVariant.FA12) {
      if (bribeTokenContractInstance === undefined) {
        throw new Error("Failed to create token instance.");
      }
      
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...bribeTokenContractInstance.methods
          .approve(bribeAddress, totalBribeValue.decimalPlaces(0,1).toString())
          .toTransferParams(),
      });
      epochNumbers.forEach((epoch) => {
        allBatchOperations.push({
          kind: OpKind.TRANSACTION,
          ...bribeContractInstance.methods
            .add_bribe(
              epoch,
              "fa12",
              bribeToken.address as string,
              epochBribeValue.decimalPlaces(0, 1).toString()
            )
            .toTransferParams(),
        });
      });
    } else if (bribeToken.variant === TokenVariant.FA2) {
      if (bribeTokenContractInstance === undefined) {
        throw new Error("Failed to create token instance.");
      }
      
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...bribeTokenContractInstance.methods
          .update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: bribeAddress,
                token_id: bribeToken.tokenId as number,
              },
            },
          ])
          .toTransferParams(),
      });
      epochNumbers.forEach((epoch) => {
        allBatchOperations.push({
          kind: OpKind.TRANSACTION,
          ...bribeContractInstance.methods
            .add_bribe(
              epoch,
              "fa2",
              bribeToken.address as string,
              bribeToken.tokenId as number,
              epochBribeValue.decimalPlaces(0,1).toString()
            )
            .toTransferParams(),
        });
      });
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        ...bribeTokenContractInstance.methods
          .update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: bribeAddress,
                token_id: bribeToken.tokenId as number,
              },
            },
          ])
          .toTransferParams(),
      });
    } else {
      throw new Error(
        "Invalid token variant for the token selected. Token variants can be Tez, FA1.2 or FA2."
      );
    }

    const batch = Tezos.wallet.batch(allBatchOperations);
    const batchOperation = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }

    await batchOperation.confirmation();

    console.log(batchOperation.status())

    const status = await batchOperation.status();
    if(status === "applied"){
      return {
        success: true,
        operationId: batchOperation?.opHash,
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
