import { BigNumber } from 'bignumber.js';
import { store } from '../../redux';
import { calculateTokensOutWrapper, loadSwapDataWrapper } from './wrappers';

let paths: string[] = [];

export const allPaths = (tokenIn: string, tokenOut: string): string[] => {
  const state = store.getState();
  const TOKEN = state.config.standard;
  // Making Empty Visited Array
  var visited: { [x: string]: boolean } = {};

  // Reinitializing paths to remove any gunk
  paths = [];

  // Initialise Visited with false
  Object.keys(TOKEN).forEach(function (key) {
    visited[key] = false;
  });
  allPathHelper(tokenIn, tokenOut, visited, tokenIn, TOKEN);

  return paths;
};

const allPathHelper = (
  src: string,
  dest: string,
  visited: any,
  psf: string,
  TOKEN: { [x: string]: any }
) => {
  if (src === dest) {
    paths.push(psf);
  }
  visited[src] = true;
  for (var x in TOKEN[src].pairs) {
    if (visited[TOKEN[src].pairs[x]] == false) {
      allPathHelper(
        TOKEN[src].pairs[x],
        dest,
        visited,
        psf + ' ' + TOKEN[src].pairs[x],
        TOKEN
      );
    }
  }
  visited[src] = false;
};

// Return Best Path and calculations
const computeAllPaths = async (
  paths: string[],
  tokenIn_amount: BigNumber,
  slippage: BigNumber
): Promise<{
  path: string[];
  tokenOut_amount: BigNumber;
  minimumTokenOut: BigNumber[];
  fees: BigNumber[];
  feePerc: BigNumber[];
  priceImpact: BigNumber[];
}> => {
  try {
    let bestPath;
    for (var i in paths) {
      // Adding input from user
      const tokenInAmount: BigNumber[] = [];
      tokenInAmount.push(tokenIn_amount);

      for (var i in paths) {
        // Adding input from user
        const tokenInAmount: BigNumber[] = [];
        tokenInAmount.push(tokenIn_amount);

        const fees: BigNumber[] = [];
        const minimumTokenOut: BigNumber[] = [];
        const feePerc: BigNumber[] = [];
        const priceImpact: BigNumber[] = [];

        const path = paths[i].split(' ');

        for (let j = 0; j < path.length - 1; j++) {
          // Getting Swap Details

          const res = await loadSwapDataWrapper(path[j], path[j + 1]);

          // Calculating individual Token out value
          const output = calculateTokensOutWrapper(
            tokenInAmount[j],
            res.exchangeFee,
            slippage,
            path[j],
            path[j + 1],
            res.tokenIn_supply ?? undefined,
            res.tokenOut_supply ?? undefined,
            res.tokenIn_precision ?? undefined,
            res.tokenOut_precision ?? undefined,
            res.tezSupply ?? undefined,
            res.ctezSupply ?? undefined,
            res.target ?? undefined
          );

          tokenInAmount.push(output.tokenOut_amount);
          minimumTokenOut.push(output.minimum_Out);
          fees.push(output.fees);
          feePerc.push(output.feePerc);
          priceImpact.push(output.priceImpact);
        }

        // Update bestPath
        if (bestPath) {
          // update best path
          if (
            tokenInAmount[tokenInAmount.length - 1] > bestPath.tokenOut_amount
          ) {
            bestPath.path = path;
            bestPath.tokenOut_amount = tokenInAmount[tokenInAmount.length - 1];
            bestPath.minimumTokenOut = minimumTokenOut;
            bestPath.fees = fees;
            bestPath.feePerc = feePerc;
            bestPath.priceImpact = priceImpact;
          }
        } else {
          // add current path as best path
          bestPath = {
            path: path,
            tokenOut_amount: tokenInAmount[tokenInAmount.length - 1],
            minimumTokenOut: minimumTokenOut,
            fees: fees,
            feePerc: feePerc,
            priceImpact: priceImpact,
          };
        }
      }
    }

    if (bestPath) return bestPath;
    else throw 'Can not calculate Route';
  } catch (error) {
    console.log(error);
    const bestPath = {
      path: [],
      tokenOut_amount: new BigNumber(0),
      minimumTokenOut: [],
      priceImpact: [],
      fees: [],
      feePerc: [],
    };
    return bestPath;
  }
};

export const computeAllPathsWrapper = async (
  paths: string[],
  tokenIn_amount: BigNumber,
  slippage: BigNumber
): Promise<{
  path: string[];
  tokenOut_amount: BigNumber;
  finalMinimumTokenOut: BigNumber;
  minimumTokenOut: BigNumber[];
  finalPriceImpact: BigNumber;
  finalFeePerc: BigNumber;
  feePerc: BigNumber[];
  isStable: boolean[];
  exchangeRate: BigNumber;
}> => {
  try {
    const bestPath = await computeAllPaths(paths, tokenIn_amount, slippage);

    const isStable: boolean[] = [];
    let finalPriceImpact = new BigNumber(0);
    let finalFeePerc = new BigNumber(0);

    for (var x of bestPath.priceImpact) {
      finalPriceImpact = finalPriceImpact.plus(x);
    }

    for (var x of bestPath.feePerc) {
      finalFeePerc = finalFeePerc.plus(x);
      if (x.isEqualTo(new BigNumber(0.1))) isStable.push(true);
      else isStable.push(false);
    }

    const exchangeRateCalculation = await computeAllPaths(
      [bestPath.path.join(' ')],
      new BigNumber(1),
      new BigNumber(0)
    );

    return {
      path: bestPath.path,
      tokenOut_amount: bestPath.tokenOut_amount,
      finalMinimumTokenOut:
        bestPath.minimumTokenOut[bestPath.minimumTokenOut.length - 1],
      minimumTokenOut: bestPath.minimumTokenOut,
      finalPriceImpact: finalPriceImpact,
      finalFeePerc: finalFeePerc,
      feePerc: bestPath.feePerc,
      isStable: isStable,
      exchangeRate: exchangeRateCalculation.tokenOut_amount,
    };
  } catch (error) {
    console.log(error);
    return {
      path: [],
      tokenOut_amount: new BigNumber(0),
      finalMinimumTokenOut: new BigNumber(0),
      minimumTokenOut: [],
      finalPriceImpact: new BigNumber(0),
      finalFeePerc: new BigNumber(0),
      feePerc: [],
      isStable: [],
      exchangeRate: new BigNumber(0),
    };
  }
};
