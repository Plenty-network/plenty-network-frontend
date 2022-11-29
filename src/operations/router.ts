import { getDexAddress } from '../api/util/fetchConfig';
import { store } from '../redux';
import { BigNumber } from 'bignumber.js';
import { TokenStandard } from '../config/types';
import { MichelsonMap, OpKind } from '@taquito/taquito';
import Config from '../config/config';
import { dappClient } from '../common/walletconnect';
import { IOperationsResponse, TResetAllValues, TTransactionSubmitModal ,TSetShowConfirmTransaction } from './types';
import { IFlashMessageProps } from '../redux/flashMessage/type';
import { setFlashMessage } from '../redux/flashMessage';

export const routerSwap = async (
  path: string[],
  minimumOut_All: BigNumber[],
  caller: string,
  recipent: string,
  amount: BigNumber,
  transactionSubmitModal: TTransactionSubmitModal,
  resetAllValues: TResetAllValues,
  setShowConfirmTransaction: TSetShowConfirmTransaction,
  flashMessageContent?: IFlashMessageProps
): Promise<IOperationsResponse> => {
  try {
    const {CheckIfWalletConnected}=dappClient()
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }

    const state = store.getState();
    const TOKEN = state.config.tokens;

    const TOKEN_IN = TOKEN[path[0]];

    const routerAddress = Config.ROUTER[Config.NETWORK];
    const Tezos = await dappClient().tezos();
    const routerInstance: any = await Tezos.contract.at(routerAddress);

    let DataLiteral: any = [];
    for (let i = 0; i < path.length - 1; i++) {
      const dexAddress = getDexAddress(path[i], path[i + 1]);
      const minOut = minimumOut_All[i]
        .multipliedBy(new BigNumber(10).pow(TOKEN[path[i + 1]].decimals))
        .decimalPlaces(0, 1)
        .toString();
      const tokenAddress = TOKEN[path[i + 1]].address;
      const tokenId = TOKEN[path[i + 1]].tokenId ?? 0;
      DataLiteral[i] = {
        exchangeAddress: dexAddress,
        minimumOutput: minOut,
        requiredTokenAddress: tokenAddress ?? routerAddress,
        requiredTokenId: tokenId,
      };
    }

    const DataMap = MichelsonMap.fromLiteral(DataLiteral);
    let swapAmount = amount
      .multipliedBy(new BigNumber(10).pow(TOKEN_IN.decimals))
      .decimalPlaces(0,1)
      .toString();
    const tokenInCallType = TOKEN_IN.standard;

    let batch = null;
    if (tokenInCallType === TokenStandard.TEZ) {
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
    } else {
      const tokenInInstance: any = await Tezos.contract.at(TOKEN_IN.address as string);
      if (tokenInCallType === TokenStandard.FA12) {
        batch = Tezos.wallet
          .batch()
          .withContractCall(
            tokenInInstance.methods.transfer(caller, routerAddress, swapAmount)
          )
          .withContractCall(
            routerInstance.methods.routerSwap(DataMap, swapAmount, recipent)
          );
      } else if(tokenInCallType === TokenStandard.FA2) {
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
      else{
        throw new Error("Invalid Variant");
      }

      const batchOp = await batch.send();
      setShowConfirmTransaction(false);
      resetAllValues();

      transactionSubmitModal(batchOp.opHash);

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
    }
  } catch (error : any) {
    console.error(error);
    return {
      success: false,
      operationId: undefined,
      error : error.message,
    };
  }
};