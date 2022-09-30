import { ParamsWithKind } from "@taquito/taquito";
import { WalletParamsWithKind } from "@taquito/taquito/dist/types/wallet";
import cloneDeep from "lodash-es/cloneDeep";
import slice from "lodash-es/slice";
import { dappClient } from "../../common/walletconnect";

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