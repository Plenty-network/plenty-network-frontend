import { getDexAddress } from '../api/util/fetchConfig';
import {
  CheckIfWalletConnected,
  wallet,
  tezos as Tezos,
} from '../common/wallet';
import { store } from '../redux';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../config/types';
import { MichelsonMap, OpKind } from '@taquito/taquito';
import Config from '../config/config';

export const routerSwap = async (
  path: string[],
  minimum_Out_All: BigNumber[],
  caller: string,
  recipent: string,
  amount: BigNumber,
  transactionSubmitModal: any,
  resetAllValues: any,
  setShowConfirmTransaction: any
): Promise<{ success: boolean; operationId: any; error?: any }> => {
  try {
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }

    const state = store.getState();
    const TOKEN = state.config.standard;

    const TOKEN_IN = TOKEN[path[0]];

    const routerAddress = Config.ROUTER[Config.NETWORK];
    const routerInstance: any = await Tezos.contract.at(routerAddress);

    let DataLiteral: any;
    for (let i = 0; i < path.length - 1; i++) {
      const dexAddress = getDexAddress(path[i], path[i + 1]);
      const minOut = minimum_Out_All[i]
        .multipliedBy(Math.pow(10, TOKEN[path[i + 1]].decimals))
        .toFixed(0);
      const tokenAddress = TOKEN[path[i + 1]].address;
      const tokenId = TOKEN[path[i + 1]].tokenId ?? 0;
      DataLiteral[i] = {
        exchangeAddress: dexAddress,
        minimumOutput: minOut,
        requiredTokenAddress: tokenAddress,
        requiredTokenId: tokenId,
      };
    }

    const DataMap = MichelsonMap.fromLiteral(DataLiteral);
    let swapAmount = amount
      .multipliedBy(Math.pow(10, TOKEN_IN.decimals))
      .toFixed(0);
    const tokenInCallType = TOKEN_IN.variant;

    let batch = null;
    if (tokenInCallType === TokenType.TEZ) {
      batch = Tezos.wallet.batch([
        {
          kind: OpKind.TRANSACTION,
          ...routerInstance.methods
            .routerSwap(DataMap, swapAmount, recipent)
            .toTransferParams({ amount: Number(swapAmount), mutez: true }),
        },
      ]);

      const batchOp = await batch.send();

      resetAllValues();

      setShowConfirmTransaction(false);
      transactionSubmitModal(batchOp.opHash);
      await batchOp.confirmation();
      return {
        success: true,
        operationId: batchOp.opHash,
      };
      // const hash = await routerInstance.methods.routerSwap(DataMap, swapAmount, caller).send({amount : swapAmount});
      // await hash.confirmation();
      // return {
      //   success: true,
      // };
    } else {
      const tokenInInstance: any = await Tezos.contract.at(TOKEN_IN.address);
      if (tokenInCallType === TokenType.FA12) {
        batch = Tezos.wallet
          .batch()
          .withContractCall(
            tokenInInstance.methods.transfer(caller, routerAddress, swapAmount)
          )
          .withContractCall(
            routerInstance.methods.routerSwap(DataMap, swapAmount, recipent)
          );
      } else {
        // FA2 Call
        batch = Tezos.wallet
          .batch()
          .withContractCall(
            tokenInInstance.methods.transfer([
              {
                from_: caller,
                txs: [
                  {
                    to_: routerAddress,
                    token_id: TOKEN_IN.tokenId,
                    amount: swapAmount,
                  },
                ],
              },
            ])
          )
          .withContractCall(
            routerInstance.methods.routerSwap(DataMap, swapAmount, recipent)
          );
      }

      const batchOp = await batch.send();
      setShowConfirmTransaction(false);
      resetAllValues();

      transactionSubmitModal(batchOp.opHash);

      await batchOp.confirmation();
      return {
        success: true,
        operationId: batchOp.opHash,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      operationId: null,
      error,
    };
  }
};
