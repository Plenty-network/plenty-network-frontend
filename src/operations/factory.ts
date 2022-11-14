import { OpKind } from "@taquito/taquito";
import { dappClient, factoryAddress, routerAddress } from "../common/walletconnect";
import { ITokenInterface, TokenVariant } from "../config/types";
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

export const deployVolatile = async (
  token1: ITokenInterface,
  token2: ITokenInterface,
  caller: string,
  token1Amount: BigNumber,
  token2Amount: BigNumber,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  console.log(
    "ishu2",
    token1,
    token2,
    caller,
    token1Amount.toString(),
    token2Amount.toString(),
  );
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }

    const Tezos = await dappClient().tezos();
    const factoryInstance: any = await Tezos.contract.at(factoryAddress);
    const token1Instance = await Tezos.contract.at(token1.address as string);
    const token2Instance = await Tezos.contract.at(token2.address as string);

    const allBatch: any = [];

    if (token1.variant === TokenVariant.FA12) {
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
    } else if (token1.variant === TokenVariant.FA2) {
      allBatch.push({
        kind: OpKind.TRANSACTION,
        ...token1Instance.methods
            .transfer(
                [
                    {
                        from_ : caller,
                        txs : [
                            {
                                to_ : routerAddress,
                                token_id : token1.tokenId ?? 0,
                                amount : token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
                            }
                        ]
                    }
                ]
            ).toTransferParams(),
      });
    }
    if (token2.variant === TokenVariant.FA12) {
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
    } else if (token2.variant === TokenVariant.FA2) {
        allBatch.push({
            kind: OpKind.TRANSACTION,
            ...token2Instance.methods
                .transfer(
                    [
                        {
                            from_ : caller,
                            txs : [
                                {
                                    to_ : routerAddress,
                                    token_id : token2.tokenId ?? 0,
                                    amount : token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
                                }
                            ]
                        }
                    ]
                ).toTransferParams(),
          });
        }

    const lpTokenDecimals = Math.floor((token1.decimals + token2.decimals) / 2);

    console.log(lpTokenDecimals);

    allBatch.push({
      kind: OpKind.TRANSACTION,
      ...factoryInstance.methods
        .deployVolatilePair(
          token1.address as string,
          token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
          token1.tokenId ?? 0,
          token1.variant === TokenVariant.FA2,
          token2.address as string,
          token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
          token2.tokenId ?? 0,
          token2.variant === TokenVariant.FA2,
          char2Bytes(lpTokenDecimals.toString()),
          char2Bytes(`${token1.symbol}-${token2.symbol} PNLP`),
          caller
        )
        .toTransferParams(),
    });

    console.log("api:" , allBatch);

    const batch = Tezos.wallet.batch(allBatch);

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
  token1: ITokenInterface,
  token2: ITokenInterface,
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
    const factoryInstance: any = await Tezos.contract.at(factoryAddress);
    const token1Instance = await Tezos.contract.at(token1.address as string);
    const token2Instance = await Tezos.contract.at(token2.address as string);

    const allBatch: any = [];

    if (token1.variant === TokenVariant.FA12) {
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
    } else if (token1.variant === TokenVariant.FA2) {
        allBatch.push({
            kind: OpKind.TRANSACTION,
            ...token1Instance.methods
                .transfer(
                    [
                        {
                            from_ : caller,
                            txs : [
                                {
                                    to_ : routerAddress,
                                    token_id : token1.tokenId ?? 0,
                                    amount : token1Amount.multipliedBy(new BigNumber(10).pow(token1.decimals)),
                                }
                            ]
                        }
                    ]
                ).toTransferParams(),
          });
    }

    if (token2.variant === TokenVariant.FA12) {
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
    } else if (token2.variant === TokenVariant.FA2) {
        allBatch.push({
            kind: OpKind.TRANSACTION,
            ...token2Instance.methods
                .transfer(
                    [
                        {
                            from_ : caller,
                            txs : [
                                {
                                    to_ : routerAddress,
                                    token_id : token2.tokenId ?? 0,
                                    amount : token2Amount.multipliedBy(new BigNumber(10).pow(token2.decimals)),
                                }
                            ]
                        }
                    ]
                ).toTransferParams(),
          });
    }

    const lpTokenDecimals = Math.floor((token1.decimals + token2.decimals) / 2);
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
        .deployVolatilePair(
          token1.address,
          token1.tokenId ?? 0,
          token1Precision,
          token1.variant === TokenVariant.FA2 ? true : false,
          token2.address,
          token2.tokenId ?? 0,
          token2Precision,
          token2.variant === TokenVariant.FA2 ? true : false,
          char2Bytes(lpTokenDecimals.toString()),
          char2Bytes(`${token1.symbol}-${token2.symbol} PNLP`),
          caller
        )
        .toTransferParams(),
    });

    const batch = Tezos.wallet.batch(allBatch);

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
