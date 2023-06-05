import axios from "axios";
import BigNumber from "bignumber.js";
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { Approvals } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { getV3DexAddress } from "../../api/util/fetchConfig";
import { BalanceNat, TokenStandard } from "./types";
import { dappClient } from "../../common/walletconnect";
import { store } from "../../redux";
import { createPositionInstance } from "../../api/v3/helper";
import { TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from "../types";
import { getBatchOperationsWithLimits } from "../../api/util/operations";

import { setFlashMessage } from "../../redux/flashMessage";
import { IFlashMessageProps } from "../../redux/flashMessage/type";

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
): Promise<any> => {
  try {
    let configResponse: any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const TOKENS = state.config.tokens;
    let amountTokenX = maximumTokensContributed.x;
    let amountTokenY = maximumTokensContributed.y;

    amountTokenX = amountTokenX.multipliedBy(new BigNumber(10).pow(TOKENS[tokenXSymbol].decimals));

    amountTokenY = amountTokenX.multipliedBy(new BigNumber(10).pow(TOKENS[tokenYSymbol].decimals));

    const contractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    const contractInstance = await Tezos.wallet.at(contractAddress);

    const tokenX = await Tezos.wallet.at(TOKENS[tokenXSymbol].address as string);
    const tokenY = await Tezos.wallet.at(TOKENS[tokenYSymbol].address as string);
    let createPosition = await createPositionInstance(
      lowerTick,
      upperTick,
      tokenXSymbol,
      tokenYSymbol,
      deadline,
      maximumTokensContributed
    );
    const allBatchOperations: WalletParamsWithKind[] = [];

    console.log("v3operationerror: contractAddress ", tokenX, tokenY);

    if(TOKENS[tokenXSymbol].standard === TokenStandard.FA12) {
      // push approveFA12 op for token1;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1)),
      });

    } else if (TOKENS[tokenXSymbol].standard === TokenStandard.FA2) {
      // push add_operator op for token1;

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            add_operator: {
              owner: userAddress,
              token_id: configResponse.tokenXSymbol.tokenId,
              operator: contractInstance.address,
            },
          },
        ]),
      });
    }

    if(TOKENS[tokenYSymbol].standard === TokenStandard.FA12) {
      // push approveFA12 op for token2;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1)),
      });

    } else if (TOKENS[tokenYSymbol].standard === TokenStandard.FA2) {
      // push add_operator op for token2;
      allBatchOperations.push({
          kind: OpKind.TRANSACTION,
          ...Approvals.updateOperatorsFA2(tokenX, [
            {
              add_operator: {
                owner: userAddress,
                token_id: configResponse.tokenYSymbol.tokenId,
                operator: contractInstance.address,
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

    if(TOKENS[tokenXSymbol].standard === TokenStandard.FA2) {
      // push remove_operator op for token1;
      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            remove_operator: {
              owner: userAddress,
              token_id: configResponse.tokenXSymbol.tokenId,
              operator: contractInstance.address,
            },
          },
        ]),
      });

    }
    if(TOKENS[tokenYSymbol].standard === TokenStandard.FA2) {
      // push remove_operator op for token2;

      allBatchOperations.push({
        kind: OpKind.TRANSACTION,
        // @ts-ignore
        ...Approvals.updateOperatorsFA2(tokenX, [
          {
            add_operator: {
              owner: userAddress,
              token_id: configResponse.tokenYSymbol.tokenId,
              operator: contractInstance.address,
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

    // if (
    //   TOKENS[tokenXSymbol].standard === TokenStandard.FA12 &&
    //   TOKENS[tokenYSymbol].standard === TokenStandard.FA2
    // ) {
    //   const op = await Tezos.wallet
    //     .batch([
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1)),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.updateOperatorsFA2(tokenY, [
    //           {
    //             add_operator: {
    //               owner: userAddress,
    //               token_id: configResponse.tokenYSymbol.tokenId,
    //               operator: contractInstance.address,
    //             },
    //           },
    //         ]),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         ...createPosition,
    //       },
    //     ])
    //     .send();
    //     setShowConfirmTransaction && setShowConfirmTransaction(false);
    //     transactionSubmitModal && transactionSubmitModal(op.opHash as string);
    //     resetAllValues && resetAllValues();
    //     if (flashMessageContent) {
    //       store.dispatch(setFlashMessage(flashMessageContent));
    //     }
    //   await op.confirmation();
    // } else if (
    //   TOKENS[tokenXSymbol].standard === TokenStandard.FA2 &&
    //   TOKENS[tokenYSymbol].standard === TokenStandard.FA12
    // ) {
    //   const op = await Tezos.wallet
    //     .batch([
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.updateOperatorsFA2(tokenX, [
    //           {
    //             add_operator: {
    //               owner: userAddress,
    //               token_id: configResponse.tokenXSymbol.tokenId,
    //               operator: contractInstance.address,
    //             },
    //           },
    //         ]),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1)),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         ...createPosition,
    //       },
    //     ])
    //     .send();
    //     setShowConfirmTransaction && setShowConfirmTransaction(false);
    //     transactionSubmitModal && transactionSubmitModal(op.opHash as string);
    //     resetAllValues && resetAllValues();
    //     if (flashMessageContent) {
    //       store.dispatch(setFlashMessage(flashMessageContent));
    //     }
    //   await op.confirmation();
    // } else if (
    //   TOKENS[tokenXSymbol].standard === TokenStandard.FA12 &&
    //   TOKENS[tokenYSymbol].standard === TokenStandard.FA12
    // ) {
    //   const op = await Tezos.wallet
    //     .batch([
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1)),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1)),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         ...createPosition,
    //       },
    //     ])
    //     .send();
    //     setShowConfirmTransaction && setShowConfirmTransaction(false);
    //     transactionSubmitModal && transactionSubmitModal(op.opHash as string);
    //     resetAllValues && resetAllValues();
    //     if (flashMessageContent) {
    //       store.dispatch(setFlashMessage(flashMessageContent));
    //     }
    //   await op.confirmation();
    // } else if (
    //   TOKENS[tokenXSymbol].standard === TokenStandard.FA2 &&
    //   TOKENS[tokenYSymbol].standard === TokenStandard.FA2
    // ) {
    //   const op = await Tezos.wallet
    //     .batch([
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.updateOperatorsFA2(tokenX, [
    //           {
    //             add_operator: {
    //               owner: userAddress,
    //               token_id: configResponse.tokenXSymbol.tokenId,
    //               operator: contractInstance.address,
    //             },
    //           },
    //         ]),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         // @ts-ignore
    //         ...Approvals.updateOperatorsFA2(tokenY, [
    //           {
    //             add_operator: {
    //               owner: userAddress,
    //               token_id: configResponse.tokenYSymbol.tokenId,
    //               operator: contractInstance.address,
    //             },
    //           },
    //         ]),
    //       },
    //       {
    //         kind: OpKind.TRANSACTION,
    //         ...createPosition,
    //       },
    //     ])
    //     .send();
    //   setShowConfirmTransaction && setShowConfirmTransaction(false);
    //   transactionSubmitModal && transactionSubmitModal(op.opHash as string);
    //   resetAllValues && resetAllValues();
    //   if (flashMessageContent) {
    //     store.dispatch(setFlashMessage(flashMessageContent));
    //   }

    //   await op.confirmation();
    // }

  } catch (error) {
    console.log("v3operationerror: ", error);
  }
};
