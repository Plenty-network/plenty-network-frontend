import { BigNumber } from "bignumber.js";
import { getDexAddress } from '../api/util/fetchConfig';
import { dappClient } from '../common/walletconnect';
import { TokenVariant } from "../config/types";
import { store } from '../redux';
import { IOperationsResponse, TResetAllValues, TSetShowConfirmTransaction, TTransactionSubmitModal } from './types';


export const stakePnlpTokens = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  pnlpAmount: string | BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined
): Promise<IOperationsResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gaugeAddress;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }

    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error("Wallet connection failed.");
    }
    const Tezos = await dappClient().tezos();

    const PNLP_TOKEN = AMM[dexContractAddress].lpToken;

    const pnlpTokenContractInstance = await Tezos.wallet.at(
      PNLP_TOKEN.address as string
    );
    const gaugeContractInstance = await Tezos.wallet.at(gaugeAddress);

    const pnlpAmountToStake = new BigNumber(pnlpAmount).multipliedBy(
      new BigNumber(10).pow(PNLP_TOKEN.decimals)
    );

    let batch = null;

    if (PNLP_TOKEN.variant === TokenVariant.FA12) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          pnlpTokenContractInstance.methods.approve(
            gaugeAddress,
            pnlpAmountToStake.toString()
          )
        )
        .withContractCall(
          gaugeContractInstance.methods.stake(pnlpAmountToStake.toString(), 0)
        );
    } else if (PNLP_TOKEN.variant === TokenVariant.FA2) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          pnlpTokenContractInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: gaugeAddress,
                token_id: PNLP_TOKEN.tokenId as number,
              },
            },
          ])
        )
        .withContractCall(
          gaugeContractInstance.methods.stake(pnlpAmountToStake.toString(), 0)
        )
        .withContractCall(
          pnlpTokenContractInstance.methods.update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: gaugeAddress,
                token_id: PNLP_TOKEN.tokenId as number,
              },
            },
          ])
        );
    } else {
      throw new Error(
        "Invalid token variant for the PNLP selected. Token variants can be FA1.2 or FA2."
      );
    }

    const batchOperation = await batch.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(batchOperation.opHash as string);
    resetAllValues && resetAllValues();
    await batchOperation.confirmation();
    return {
      success: true,
      operationId: batchOperation.opHash,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};