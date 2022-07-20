import { getDexAddress } from '../api/util/fetchConfig';
import {
  CheckIfWalletConnected,
  wallet,
  tezos as Tezos,
} from '../common/wallet';
import { store } from '../redux';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../config/types';
import { OpKind } from '@taquito/taquito';
import { routerSwap } from './router';

export const allSwapWrapper = async (
  tokenInAmount: BigNumber,
  path : string[],
  minimum_Out_All : BigNumber[],
  caller: string,
  recipent: string,
  transactionSubmitModal: any,
  resetAllValues: any,
  setShowConfirmTransaction: any,
  setShowConfirmSwap : any,

): Promise<{ success: boolean; operationId: any; error: any }> => {
  try {
    let res;
    if(path.length === 2){
      // directSwap
      res = await directSwapWrapper(path[0] , path[1] , minimum_Out_All[0] , recipent ,tokenInAmount ,caller ,transactionSubmitModal ,resetAllValues ,setShowConfirmTransaction);
    }else{
      // routerSwap
      res = await routerSwap(path ,minimum_Out_All ,caller , recipent ,tokenInAmount ,transactionSubmitModal ,setShowConfirmSwap ,resetAllValues ,setShowConfirmTransaction);
    }
    return {
      success: res.success,
      operationId: res.operationId ?? null,
      error: res.error ?? null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      operationId: null,
      error: error,
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
  transactionSubmitModal: any,
  resetAllValues: any,
  setShowConfirmTransaction: any
): Promise<{ success: boolean; operationId: any; error: any }> => {
  try {
    let res;
    if (tokenIn === 'tez' && tokenOut === 'ctez') {
      res = await tez_to_ctez(
        tokenIn,
        tokenOut,
        minimumTokenOut,
        recipent,
        tokenInAmount,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction
      );
    } else if (tokenIn === 'ctez' && tokenOut === 'tez') {
      res = await ctez_to_tez(
        tokenIn,
        tokenOut,
        minimumTokenOut,
        recipent,
        tokenInAmount,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction
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
        setShowConfirmTransaction
      );
    }
    return {
      success: res.success,
      operationId: res.operationId ?? null,
      error: res.error ?? null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      operationId: null,
      error: error,
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
  transactionSubmitModal: any,
  resetAllValues: any,
  setShowConfirmTransaction: any
) => {
  try {
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }

    // const TOKEN = useAppSelector((state) => state.config.standard);
    const state = store.getState();
    const TOKEN = state.config.standard;

    const TOKEN_IN = TOKEN[tokenIn];
    const TOKEN_OUT = TOKEN[tokenOut];

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    const tokenInId = TOKEN_IN.tokenId ?? 0;
    const tokenOutAddress = TOKEN_OUT.address;
    const tokenOutId = TOKEN_OUT.tokenId ?? 0;
    const tokenInAddress = TOKEN_IN.address;
    const tokenInInstance: any = await Tezos.contract.at(tokenInAddress);
    const dexContractInstance: any = await Tezos.contract.at(
      dexContractAddress
    );

    tokenInAmount = tokenInAmount.multipliedBy(Math.pow(10, TOKEN_IN.decimals));
    minimumTokenOut = minimumTokenOut.multipliedBy(
      Math.pow(10, TOKEN_OUT.decimals)
    );

    let batch = null;
    // Approve call for FA1.2 type token
    if (TOKEN_IN.variant === TokenType.FA12) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.approve(dexContractAddress, tokenInAmount)
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut.toFixed(0),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount
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
            minimumTokenOut.toFixed(0),
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount
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

    const opHash = await batchOperation.confirmation();

    return {
      success: true,
      operationId: batchOperation.opHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

async function ctez_to_tez(
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  transactionSubmitModal: any,

  resetAllValues: any,
  setShowConfirmTransaction: any
) {
  try {
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }

    // const TOKEN = useAppSelector((state) => state.config.standard);
    const state = store.getState();
    const TOKEN = state.config.standard;

    const TOKEN_IN = TOKEN[tokenIn];

    const contractAddress = getDexAddress(tokenIn, tokenOut);
    const CTEZ = TOKEN_IN.address;
    const tokenInDecimals = TOKEN_IN.decimals;
    const contract = await Tezos.wallet.at(contractAddress);
    const ctez_contract = await Tezos.wallet.at(CTEZ);
    const batch = Tezos.wallet
      .batch()
      .withContractCall(
        ctez_contract.methods.approve(
          contractAddress,
          tokenInAmount.multipliedBy(10 ** tokenInDecimals).toString()
        )
      )
      .withContractCall(
        contract.methods.ctez_to_tez(
          tokenInAmount.multipliedBy(10 ** tokenInDecimals).toString(),
          minimumTokenOut.multipliedBy(10 ** tokenInDecimals).toFixed(0),
          recipent
        )
      )
      // .send();
      // await op2.confirmation();
      .withContractCall(ctez_contract.methods.approve(contractAddress, 0));
    // .send();
    const batchOp: any = await batch.send();
    // eslint-disable-next-line no-lone-blocks
    {
      batchOp.opHash === null
        ? console.log('operation getting injected')
        : console.log('operation injected');
    }

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues();
    transactionSubmitModal(batchOp.opHash);

    await batchOp.confirmation();
    return {
      success: true,
      operationId: batchOp.opHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

async function tez_to_ctez(
  tokenIn: string,
  tokenOut: string,
  minimumTokenOut: BigNumber,
  recipent: string,
  tokenInAmount: BigNumber,
  transactionSubmitModal: any,

  resetAllValues: any,
  setShowConfirmTransaction: any
) {
  try {
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }

    const contractAddress = getDexAddress(tokenIn, tokenOut);
    const contract = await Tezos.wallet.at(contractAddress);

    const tokenInDecimals = 6;
    const tokenOutDecimals = 6;
    const batch = Tezos.wallet.batch([
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .tez_to_ctez(
            minimumTokenOut.multipliedBy(10 ** tokenOutDecimals).toFixed(0),
            recipent
          )
          .toTransferParams({
            amount: Number(
              tokenInAmount.multipliedBy(10 ** tokenInDecimals).toFixed(0)
            ),
            mutez: true,
          }),
      },
    ]);

    const batchOp: any = await batch.send();

    setShowConfirmTransaction && setShowConfirmTransaction(false);
    resetAllValues();
    transactionSubmitModal(batchOp.opHash);
    await batchOp.confirmation();

    return {
      success: true,
      operationId: batchOp.opHash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
