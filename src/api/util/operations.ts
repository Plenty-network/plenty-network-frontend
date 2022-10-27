import { ParamsWithKind } from "@taquito/taquito";
import { WalletParamsWithKind } from "@taquito/taquito/dist/types/wallet";
import cloneDeep from "lodash-es/cloneDeep";
import slice from "lodash-es/slice";
import concat from "lodash-es/concat";
import findLastIndex from "lodash-es/findLastIndex"
import { dappClient, tzktNode } from "../../common/walletconnect";
import axios from 'axios';

/**
 * Find and return the maximum possible length of batch possible to run without exhausting the gas.
 * @param operationsBatch - Array of all batch operations
 */
export const getMaxPossibleBatchArray = async (
  operationsBatch: WalletParamsWithKind[]
): Promise<WalletParamsWithKind[]> => {
  try {
    let maxPossibleBatch: ParamsWithKind[] = cloneDeep(operationsBatch) as ParamsWithKind[];
    let leftoverBatch: ParamsWithKind[] = [];
    const Tezos = await dappClient().tezos();
    // let gasConsumed = 0;
    //Find the approx max possible 
    while (maxPossibleBatch.length > 0) {
      const isTransactionPossible: boolean = await Tezos.estimate
        .batch(maxPossibleBatch)
        .then((_est) => true)
        .catch((_err) => false);
      if (isTransactionPossible) {
        break;
      } else {
        const midIndex = Math.floor(maxPossibleBatch.length / 2);
        leftoverBatch = slice(maxPossibleBatch, midIndex, maxPossibleBatch.length);
        maxPossibleBatch = slice(maxPossibleBatch, 0, midIndex);
      }
    }
    // Add dust to maximise the possibility
    for (let i = 0; i < leftoverBatch.length; i++) {
      maxPossibleBatch.push(leftoverBatch[i]);
      const isTransactionPossible: boolean = await Tezos.estimate
        .batch(maxPossibleBatch)
        .then((_est) => true)
        // .then((_est) => {let gas = 0; _est.forEach((est) => {gas += est.gasLimit}); gasConsumed = gas; return true;})
        .catch((_err) => false);
      if (!isTransactionPossible) {
        maxPossibleBatch.pop();
        break;
      }
    }
    // console.log(gasConsumed);
    return maxPossibleBatch as WalletParamsWithKind[];
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * Find and return the maximum possible length of batch possible to run without exhausting the gas,
 * optimised to reduce network fetch time.
 * @param operationsBatch - Array of all batch operations
 */
export const getMaxPossibleBatchArrayV2 = async (
  operationsBatch: WalletParamsWithKind[]
): Promise<WalletParamsWithKind[]> => {
  try {
    let maxPossibleBatch: ParamsWithKind[] = cloneDeep(operationsBatch) as ParamsWithKind[];
    // maxPossibleBatch.shift(); //TODO: remove this after tzkt issue is resolved.
    let leftoverBatch: ParamsWithKind[] = [];
    const listOfAllBatches: ParamsWithKind[][] = [];
    const listOfLeftoverBatches: ParamsWithKind[][] = [];
    const Tezos = await dappClient().tezos();
    // Add complete list as first possibility
    // listOfAllBatches.push(maxPossibleBatch);
    // listOfLeftoverBatches.push([]);
    // Check if it's possible to execute the original batch and return immediately if so.
    const isTransactionPossible: boolean = await Tezos.estimate
        .batch(maxPossibleBatch)
        .then((_est) => true)
        .catch((_err) => false);
    if(isTransactionPossible) {
      return maxPossibleBatch as WalletParamsWithKind[];
    }
    // Create the approx max possible batches list
    while (maxPossibleBatch.length > 0) {
      const midIndex = Math.floor(maxPossibleBatch.length / 2);
      listOfLeftoverBatches.push(slice(maxPossibleBatch, midIndex, maxPossibleBatch.length));
      listOfAllBatches.push(slice(maxPossibleBatch, 0, midIndex));
      maxPossibleBatch = slice(maxPossibleBatch, 0, midIndex);
    }

    const promisesResult = await Promise.allSettled(
      listOfAllBatches.map((batch) => Tezos.estimate.batch(batch))
    );
    // Find the first(largest) successful batch
    const maxPossibleBatchIndex = promisesResult.findIndex(
      (result) => result.status === "fulfilled"
    );
    if (maxPossibleBatchIndex < 0) {
      throw new Error("Couldn't find successful batch operations possible.");
    }
    
    const maxPossibleBatchesWithDust = [];
    maxPossibleBatch = listOfAllBatches[maxPossibleBatchIndex];
    leftoverBatch = listOfLeftoverBatches[maxPossibleBatchIndex];

    // Add elements of leftover array(dust) one by one to maximise the possibility
    for (let i = 0; i < leftoverBatch.length; i++) {
      maxPossibleBatchesWithDust.push(concat(maxPossibleBatch, slice(leftoverBatch, 0, i + 1)));
    }
    
    const maxPromisesReult = await Promise.allSettled(
      maxPossibleBatchesWithDust.map((batch) => Tezos.estimate.batch(batch))
    );
    // Find the last(largest) successful batch
    const finalMaxPossibleBatchIndex = findLastIndex(
      maxPromisesReult,
      (result) => result.status === "fulfilled"
    );
    
    maxPossibleBatch =
      finalMaxPossibleBatchIndex >= 0
        ? maxPossibleBatchesWithDust[finalMaxPossibleBatchIndex]
        : maxPossibleBatch;

    return maxPossibleBatch as WalletParamsWithKind[];
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
