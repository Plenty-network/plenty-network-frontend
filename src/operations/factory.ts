import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { dappClient, factoryAddress, routerAddress, tezDeployerAddress} from "../common/walletconnect";
import { IConfigToken, TokenStandard } from "../config/types";
import { store } from "../redux";
import { setFlashMessage } from "../redux/flashMessage";
import { IFlashMessageProps } from "../redux/flashMessage/type";
import {
  IOperationsResponse,
  TResetAllValues,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from "./types";
import { char2Bytes } from "@taquito/utils";
import { BigNumber } from "bignumber.js";
import { getBatchOperationsWithLimits } from "../api/util/operations";

export const deployVolatile = async (
  token1: IConfigToken,
  token2: IConfigToken,
  caller: string,
  token1Amount: BigNumber,
  token2Amount: BigNumber,
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
    const factoryInstance = await Tezos.wallet.at(factoryAddress);
    const token1Instance = await Tezos.wallet.at(token1.address as string);
    const token2Instance = await Tezos.wallet.at(token2.address as string);

    const allBatch: WalletParamsWithKind[] = [];

    if (token1.standard === TokenStandard.FA12) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token1Instance.methods
          .transfer(
            caller,
            routerAddress,
            token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals))
          )
          .toTransferParams(),
      });
    } else if (token1.standard === TokenStandard.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token1Instance.methods
          .transfer([
            {
              from_: caller,
              txs: [
                {
                  to_: routerAddress,
                  token_id: token1.tokenId ?? 0,
                  amount: token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
                },
              ],
            },
          ])
          .toTransferParams(),
      });
    }
    if (token2.standard === TokenStandard.FA12) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token2Instance.methods
          .transfer(
            caller,
            routerAddress,
            token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals))
          )
          .toTransferParams(),
      });
    } else if (token2.standard === TokenStandard.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token2Instance.methods
          .transfer([
            {
              from_: caller,
              txs: [
                {
                  to_: routerAddress,
                  token_id: token2.tokenId ?? 0,
                  amount: token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
                },
              ],
            },
          ])
          .toTransferParams(),
      });
    }

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...factoryInstance.methods
        .deployVolatilePair(
          token1.address as string,
          token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
          token1.tokenId ?? 0,
          token1.standard === TokenStandard.FA2,
          token2.address as string,
          token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
          token2.tokenId ?? 0,
          token2.standard === TokenStandard.FA2,
          char2Bytes(`${token1.symbol}-${token2.symbol} PNLP`),
          caller
        )
        .toTransferParams(),
    });

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatch);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOp = await batch.send();
    
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
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

// TODO : Add amounts

export const deployStable = async (
  token1: IConfigToken,
  token2: IConfigToken,
  caller: string,
  token1Amount: BigNumber,
  token2Amount: BigNumber,
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
    const factoryInstance = await Tezos.wallet.at(factoryAddress);
    const token1Instance = await Tezos.wallet.at(token1.address as string);
    const token2Instance = await Tezos.wallet.at(token2.address as string);

    const allBatch: WalletParamsWithKind[] = [];

    if (token1.standard === TokenStandard.FA12) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token1Instance.methods
          .transfer(
            caller,
            routerAddress,
            token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals))
          )
          .toTransferParams(),
      });
    } else if (token1.standard === TokenStandard.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token1Instance.methods
          .transfer([
            {
              from_: caller,
              txs: [
                {
                  to_: routerAddress,
                  token_id: token1.tokenId ?? 0,
                  amount: token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
                },
              ],
            },
          ])
          .toTransferParams(),
      });
    }
    if (token2.standard === TokenStandard.FA12) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token2Instance.methods
          .transfer(
            caller,
            routerAddress,
            token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals))
          )
          .toTransferParams(),
      });
    } else if (token2.standard === TokenStandard.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token2Instance.methods
          .transfer([
            {
              from_: caller,
              txs: [
                {
                  to_: routerAddress,
                  token_id: token2.tokenId ?? 0,
                  amount: token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
                },
              ],
            },
          ])
          .toTransferParams(),
      });
    }
    
    let token1Precision;
    let token2Precision;

    if (token1.decimals <= token2.decimals) {
      token2Precision = 1;
      token1Precision = Math.pow(10, token2.decimals - token1.decimals);
    } else {
      token1Precision = 1;
      token2Precision = Math.pow(10, token1.decimals - token2.decimals);
    }

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...factoryInstance.methods
        .deployStablePair(
          token1.address,
          token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
          token1.tokenId ?? 0,
          token1Precision,
          token1.standard === TokenStandard.FA2 ? true : false,
          token2.address,
          token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
          token2.tokenId ?? 0,
          token2Precision,
          token2.standard === TokenStandard.FA2 ? true : false,
          char2Bytes(`${token1.symbol}-${token2.symbol} PNLP`),
          caller
        )
        .toTransferParams(),
    });

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatch); 
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    const batchOp = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
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


export const deployTezPair = async (
  tokenOne: IConfigToken,
  tokenTwo: IConfigToken,
  caller: string,
  tokenOneAmount: BigNumber,
  tokenTwoAmount: BigNumber,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    let tezToken: IConfigToken | undefined,
      tezAmount: BigNumber = new BigNumber(0),
      secondToken: IConfigToken | undefined,
      secondTokenAmount: BigNumber = new BigNumber(0);
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }
    const Tezos = await dappClient().tezos();

    if (tokenOne.symbol === "XTZ") {
      tezToken = tokenOne;
      tezAmount = tokenOneAmount;
      secondToken = tokenTwo;
      secondTokenAmount = tokenTwoAmount;
    } else if (tokenTwo.symbol === "XTZ") {
      tezToken = tokenTwo;
      tezAmount = tokenTwoAmount;
      secondToken = tokenOne;
      secondTokenAmount = tokenOneAmount;
    } else {
      throw new Error("Tez pair expected, but found none");
    }
    tezAmount = tezAmount
      .multipliedBy(new BigNumber(10).pow(tezToken.decimals))
      .decimalPlaces(0, 1);
    secondTokenAmount = secondTokenAmount
      .multipliedBy(new BigNumber(10).pow(secondToken.decimals))
      .decimalPlaces(0, 1);

    const tezDeployerInstance = await Tezos.wallet.at(tezDeployerAddress);
    const secondTokenInstane = await Tezos.wallet.at(secondToken.address as string);

    const allBatch: WalletParamsWithKind[] = [];

    if (secondToken.standard === TokenStandard.FA12) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...secondTokenInstane.methods
          .transfer(caller, routerAddress, secondTokenAmount)
          .toTransferParams(),
      });
    } else if (secondToken.standard === TokenStandard.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...secondTokenInstane.methods
          .transfer([
            {
              from_: caller,
              txs: [
                {
                  to_: routerAddress,
                  token_id: secondToken.tokenId || 0,
                  amount: secondTokenAmount,
                },
              ],
            },
          ])
          .toTransferParams(),
      });
    } else {
      throw new Error("Invalid token standard");
    }

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...tezDeployerInstance.methods
        .deployTezPair(
          tezAmount,
          secondToken.address as string,
          secondTokenAmount,
          secondToken.tokenId || 0,
          // TODO: Confirm the name ordering (user selected or tez always first/second)
          char2Bytes(`${tezToken.symbol}-${secondToken.symbol} PNLP`),
          secondToken.standard === TokenStandard.FA2 ? true : false,
          caller
        )
        .toTransferParams({
          mutez: true,
          amount: tezAmount.toNumber(),
        }),
    });

    const updatedBatchOperations = await getBatchOperationsWithLimits(allBatch);
    const batch = Tezos.wallet.batch(updatedBatchOperations);
    // const batch = Tezos.wallet.batch(allBatch);
    const batchOp = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues && resetAllValues();

    transactionSubmitModal && transactionSubmitModal(batchOp.opHash);
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