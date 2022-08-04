import {
  getDexAddress,
  isGeneralStablePair,
  isTezPair,
} from '../api/util/fetchConfig';
import { BigNumber } from 'bignumber.js';
import { dappClient } from '../common/walletconnect';
import { store } from '../redux';
import { TokenVariant } from '../config/types';
import {
  IOperationsResponse,
  TResetAllValues,
  TSetActiveState,
  TSetShowConfirmTransaction,
  TTransactionSubmitModal,
} from './types';

import { OpKind } from '@taquito/taquito';
import { ActiveLiquidity } from '../components/Pools/ManageLiquidityHeader';

/**
 * Add liquidity operation for given pair of tokens.
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param tokenOneAmount - Amount of first token entered by user
 * @param tokenTwoAmount - Amount of second token entered by user
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 */
export const addLiquidity = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneAmount: string | BigNumber,
  tokenTwoAmount: string | BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined
): Promise<IOperationsResponse> => {
  try {
    let addLiquidityResult: IOperationsResponse;
    if (isTezPair(tokenOneSymbol, tokenTwoSymbol)) {
      addLiquidityResult = await addTezPairsLiquidity(
        tokenOneSymbol,
        tokenTwoSymbol,
        new BigNumber(tokenOneAmount),
        new BigNumber(tokenTwoAmount),
        userTezosAddress,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        setActiveState
      );
    } else {
      addLiquidityResult = await addAllPairsLiquidity(
        tokenOneSymbol,
        tokenTwoSymbol,
        new BigNumber(tokenOneAmount),
        new BigNumber(tokenTwoAmount),
        userTezosAddress,
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        setActiveState
      );
    }
    return {
      success: addLiquidityResult.success,
      operationId: addLiquidityResult.operationId,
      error: addLiquidityResult.error,
    };
  } catch (error: any) {
    return {
      success: false,
      operationId: undefined,
      error: error.message,
    };
  }
};

/**
 * Add liquidity operation for given pair of tokens when niether of them is tez token.
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param tokenOneAmount - Amount of first token entered by user
 * @param tokenTwoAmount - Amount of second token entered by user
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 */
const addAllPairsLiquidity = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneAmount: BigNumber,
  tokenTwoAmount: BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined
): Promise<IOperationsResponse> => {
  try {
    let firstTokenSymbol: string | undefined,
      firstTokenAmount: BigNumber = new BigNumber(0),
      secondTokenSymbol: string | undefined,
      secondTokenAmount: BigNumber = new BigNumber(0);
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const AMM = state.config.AMMs;
    const TOKENS = state.config.standard;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('No dex found for the given pair of tokens.');
    }
    // Make the order of tokens according to the order in contract.
    [firstTokenSymbol, firstTokenAmount] =
      AMM[dexContractAddress].token1.symbol === tokenOneSymbol
        ? [tokenOneSymbol, tokenOneAmount]
        : [tokenTwoSymbol, tokenTwoAmount];
    [secondTokenSymbol, secondTokenAmount] =
      AMM[dexContractAddress].token2.symbol === tokenOneSymbol
        ? [tokenOneSymbol, tokenOneAmount]
        : [tokenTwoSymbol, tokenTwoAmount];

    const firstTokenAddress = TOKENS[firstTokenSymbol].address as string;
    const firstTokenId = TOKENS[firstTokenSymbol].tokenId ?? 0;
    const secondTokenAddress = TOKENS[secondTokenSymbol].address as string;
    const secondTokenId = TOKENS[secondTokenSymbol].tokenId ?? 0;
    const firstTokenInstance = await Tezos.wallet.at(firstTokenAddress);
    const secondTokenInstance = await Tezos.wallet.at(secondTokenAddress);
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

    firstTokenAmount = firstTokenAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[firstTokenSymbol].decimals)
    );
    secondTokenAmount = secondTokenAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[secondTokenSymbol].decimals)
    );

    let batch = null;
    if (
      TOKENS[firstTokenSymbol].variant === TokenVariant.FA12 &&
      TOKENS[secondTokenSymbol].variant === TokenVariant.FA2
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          firstTokenInstance.methods.approve(
            dexContractAddress,
            firstTokenAmount.toString()
          )
        )
        .withContractCall(
          secondTokenInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: secondTokenId,
              },
            },
          ])
        )
        .withContractCall(
          isGeneralStablePair(firstTokenSymbol, secondTokenSymbol)
            ? dexContractInstance.methods.add_liquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
            : dexContractInstance.methods.AddLiquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
        )
        .withContractCall(
          firstTokenInstance.methods.approve(dexContractAddress, 0)
        )
        .withContractCall(
          secondTokenInstance.methods.update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: secondTokenId,
              },
            },
          ])
        );
    } else if (
      TOKENS[firstTokenSymbol].variant === TokenVariant.FA2 &&
      TOKENS[secondTokenSymbol].variant === TokenVariant.FA12
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          firstTokenInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: firstTokenId,
              },
            },
          ])
        )
        .withContractCall(
          secondTokenInstance.methods.approve(
            dexContractAddress,
            secondTokenAmount.toString()
          )
        )
        .withContractCall(
          isGeneralStablePair(firstTokenSymbol, secondTokenSymbol)
            ? dexContractInstance.methods.add_liquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
            : dexContractInstance.methods.AddLiquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
        )
        .withContractCall(
          firstTokenInstance.methods.update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: firstTokenId,
              },
            },
          ])
        )
        .withContractCall(
          secondTokenInstance.methods.approve(dexContractAddress, 0)
        );
    } else if (
      TOKENS[firstTokenSymbol].variant === TokenVariant.FA2 &&
      TOKENS[secondTokenSymbol].variant === TokenVariant.FA2
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          firstTokenInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: firstTokenId,
              },
            },
          ])
        )
        .withContractCall(
          secondTokenInstance.methods.update_operators([
            {
              add_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: secondTokenId,
              },
            },
          ])
        )
        .withContractCall(
          isGeneralStablePair(firstTokenSymbol, secondTokenSymbol)
            ? dexContractInstance.methods.add_liquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
            : dexContractInstance.methods.AddLiquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
        )
        .withContractCall(
          firstTokenInstance.methods.update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: firstTokenId,
              },
            },
          ])
        )
        .withContractCall(
          secondTokenInstance.methods.update_operators([
            {
              remove_operator: {
                owner: userTezosAddress,
                operator: dexContractAddress,
                token_id: secondTokenId,
              },
            },
          ])
        );
    } else if (
      TOKENS[firstTokenSymbol].variant === TokenVariant.FA12 &&
      TOKENS[secondTokenSymbol].variant === TokenVariant.FA12
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          firstTokenInstance.methods.approve(
            dexContractAddress,
            firstTokenAmount.toString()
          )
        )
        .withContractCall(
          secondTokenInstance.methods.approve(
            dexContractAddress,
            secondTokenAmount.toString()
          )
        )
        .withContractCall(
          isGeneralStablePair(firstTokenSymbol, secondTokenSymbol)
            ? dexContractInstance.methods.add_liquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
            : dexContractInstance.methods.AddLiquidity(
                userTezosAddress,
                firstTokenAmount.toString(),
                secondTokenAmount.toString()
              )
        )
        .withContractCall(
          firstTokenInstance.methods.approve(dexContractAddress, 0)
        )
        .withContractCall(
          secondTokenInstance.methods.approve(dexContractAddress, 0)
        );
    } else {
      throw new Error(
        'Invalid token variants. Token variants can be FA1.2 or FA2.'
      );
    }
    const batchOperation = await batch?.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal &&
      transactionSubmitModal(batchOperation?.opHash as string);
    setActiveState && setActiveState(ActiveLiquidity.Staking);
    resetAllValues && resetAllValues();
    await batchOperation?.confirmation();
    return {
      success: true,
      operationId: batchOperation?.opHash,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Add liquidity operation for given pair of tokens when either of them is tez token.
 * @param tokenOneSymbol - Symbol of first token of the pair
 * @param tokenTwoSymbol - Symbol of second token of the pair
 * @param tokenOneAmount - Amount of first token entered by user
 * @param tokenTwoAmount - Amount of second token entered by user
 * @param userTezosAddress - Tezos wallet address of user
 * @param transactionSubmitModal - Callback to open modal when transaction is submiited
 * @param resetAllValues - Callback to reset values when transaction is submitted
 * @param setShowConfirmTransaction - Callback to show transaction confirmed
 * @param setActiveState - Callback to change active state
 */
const addTezPairsLiquidity = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  tokenOneAmount: BigNumber,
  tokenTwoAmount: BigNumber,
  userTezosAddress: string,
  transactionSubmitModal: TTransactionSubmitModal | undefined,
  resetAllValues: TResetAllValues | undefined,
  setShowConfirmTransaction: TSetShowConfirmTransaction | undefined,
  setActiveState: TSetActiveState | undefined
): Promise<IOperationsResponse> => {
  try {
    let tezSymbol: string | undefined,
      tezAmount: BigNumber = new BigNumber(0),
      secondTokenSymbol: string | undefined,
      secondTokenAmount: BigNumber = new BigNumber(0);
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const TOKENS = state.config.standard;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('No dex found for the given pair of tokens.');
    }
    // Make the order of tokens according to the order in contract.
    if (tokenOneSymbol === 'tez') {
      tezSymbol = tokenOneSymbol;
      tezAmount = tokenOneAmount;
      secondTokenSymbol = tokenTwoSymbol;
      secondTokenAmount = tokenTwoAmount;
    } else {
      tezSymbol = tokenTwoSymbol;
      tezAmount = tokenTwoAmount;
      secondTokenSymbol = tokenOneSymbol;
      secondTokenAmount = tokenOneAmount;
    }

    const secondTokenAddress = TOKENS[secondTokenSymbol].address as string;
    const secondTokenId = TOKENS[secondTokenSymbol].tokenId ?? 0;
    const secondTokenInstance = await Tezos.wallet.at(secondTokenAddress);
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

    tezAmount = tezAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[tezSymbol].decimals)
    );
    secondTokenAmount = secondTokenAmount.multipliedBy(
      new BigNumber(10).pow(TOKENS[secondTokenSymbol].decimals)
    );

    let batch = null;
    if (TOKENS[secondTokenSymbol].variant === TokenVariant.FA12) {
      batch = Tezos.wallet.batch([
        {
          kind: OpKind.TRANSACTION,
          ...secondTokenInstance.methods
            .approve(dexContractAddress, secondTokenAmount.toString())
            .toTransferParams(),
        },
        {
          kind: OpKind.TRANSACTION,
          ...dexContractInstance.methods
            .add_liquidity(secondTokenAmount.toString(), 0, userTezosAddress)
            .toTransferParams({ amount: tezAmount.toNumber(), mutez: true }),
        },
        {
          kind: OpKind.TRANSACTION,
          ...secondTokenInstance.methods
            .approve(dexContractAddress, 0)
            .toTransferParams(),
        },
      ]);
    } else if (TOKENS[secondTokenSymbol].variant === TokenVariant.FA2) {
      batch = Tezos.wallet.batch([
        {
          kind: OpKind.TRANSACTION,
          ...secondTokenInstance.methods
            .update_operators([
              {
                add_operator: {
                  owner: userTezosAddress,
                  operator: dexContractAddress,
                  token_id: secondTokenId,
                },
              },
            ])
            .toTransferParams(),
        },
        {
          kind: OpKind.TRANSACTION,
          ...dexContractInstance.methods
            .add_liquidity(secondTokenAmount.toString(), 0, userTezosAddress)
            .toTransferParams({ amount: tezAmount.toNumber(), mutez: true }),
        },
        {
          kind: OpKind.TRANSACTION,
          ...secondTokenInstance.methods
            .update_operators([
              {
                remove_operator: {
                  owner: userTezosAddress,
                  operator: dexContractAddress,
                  token_id: secondTokenId,
                },
              },
            ])
            .toTransferParams(),
        },
      ]);
    } else {
      throw new Error(
        'Invalid token variant. Token variant can be FA1.2 or FA2.'
      );
    }
    const batchOperation = await batch?.send();
    setShowConfirmTransaction && setShowConfirmTransaction(false);
    transactionSubmitModal && transactionSubmitModal(batchOperation?.opHash);
    setActiveState && setActiveState(ActiveLiquidity.Staking);
    resetAllValues && resetAllValues();
    await batchOperation?.confirmation();
    return {
      success: true,
      operationId: batchOperation?.opHash,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
