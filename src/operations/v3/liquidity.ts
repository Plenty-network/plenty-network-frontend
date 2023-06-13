import axios from "axios";
import BigNumber from "bignumber.js";
import {
  ContractAbstraction,
  OpKind,
  Wallet,
  WalletContract,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { Approvals, Contract } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { getV3DexAddress } from "../../api/util/fetchConfig";
import { BalanceNat, TokenStandard } from "./types";
import { dappClient } from "../../common/walletconnect";
import { store } from "../../redux";
import { createPositionInstance } from "../../api/v3/helper";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "../types";
import { getBatchOperationsWithLimits } from "../../api/util/operations";

import { setFlashMessage } from "../../redux/flashMessage";
import { IFlashMessageProps } from "../../redux/flashMessage/type";
import { estimateTokenYFromTokenX } from "../../api/v3/liquidity";

export const LiquidityOperation = async (
  userAddress: string,
  lowerTick: number,
  upperTick: number,
  tokenXSymbol: string,
  tokenYSymbol: string,
  deadline: number, //in seconds timestamp
  maximumTokensContributed: BalanceNat,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const TOKENS = state.config.tokens;

    let amountTokenX = maximumTokensContributed.x
      .multipliedBy(new BigNumber(10).pow(TOKENS[tokenXSymbol].decimals))
      .decimalPlaces(0, BigNumber.ROUND_UP);

    let amountTokenY = maximumTokensContributed.y
      .multipliedBy(new BigNumber(10).pow(TOKENS[tokenYSymbol].decimals))
      .decimalPlaces(0, BigNumber.ROUND_UP);

    const maximumTokensContributedMain = {
      x: amountTokenX,
      y: amountTokenY,
    };

    const contractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);

    const tokenX = await Tezos.wallet.at(TOKENS[tokenXSymbol].address as string);
    const tokenY = await Tezos.wallet.at(TOKENS[tokenYSymbol].address as string);
    let createPosition = await createPositionInstance(
      lowerTick,
      upperTick,
      tokenXSymbol,
      tokenYSymbol,
      deadline,
      maximumTokensContributedMain
    );
    const allBatchOperations: WalletParamsWithKind[] = [];

    console.log("v3operationerror: contractAddress ", tokenX, tokenY);

    if (TOKENS[tokenXSymbol].standard === TokenStandard.FA12) {
      // push approveFA12 op for token1;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.approveFA12(tokenX, {
          spender: contractAddress,
          value: amountTokenX.decimalPlaces(0, 1),
        }),
      });
    } else if (TOKENS[tokenXSymbol].standard === TokenStandard.FA2) {
      // push add_operator op for token1;

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX as Contract, [
          {
            add_operator: {
              owner: userAddress,
              token_id: TOKENS[tokenXSymbol].tokenId || 0,
              operator: contractAddress,
            },
          },
        ]),
      });
    }

    if (TOKENS[tokenYSymbol].standard === TokenStandard.FA12) {
      // push approveFA12 op for token2;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.approveFA12(tokenY, {
          spender: contractAddress,
          value: amountTokenY.decimalPlaces(0, 1),
        }),
      });
    } else if (TOKENS[tokenYSymbol].standard === TokenStandard.FA2) {
      // push add_operator op for token2;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            add_operator: {
              owner: userAddress,
              token_id: TOKENS[tokenYSymbol].tokenId || 0,
              operator: contractAddress,
            },
          },
        ]),
      });
    }

    // push createPosition op;
    allBatchOperations.push({
      kind: OpKind.TRANSACTION,
      ...createPosition,
    });

    if (TOKENS[tokenXSymbol].standard === TokenStandard.FA2) {
      // push remove_operator op for token1;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            remove_operator: {
              owner: userAddress,
              token_id: TOKENS[tokenXSymbol].tokenId || 0,
              operator: contractAddress,
            },
          },
        ]),
      });
    }
    if (TOKENS[tokenYSymbol].standard === TokenStandard.FA2) {
      // push remove_operator op for token2;

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            remove_operator: {
              owner: userAddress,
              token_id: TOKENS[tokenYSymbol].tokenId || 0,
              operator: contractAddress,
            },
          },
        ]),
      });
    }

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatchOperations);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOperation = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    if (flashMessageContent) {
      store.dispatch(setFlashMessage(flashMessageContent));
    }
    await batchOperation.confirmation(1);

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
    console.log("v3operationerror: ", error);
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};
