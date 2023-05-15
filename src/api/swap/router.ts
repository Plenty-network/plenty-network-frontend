import { BigNumber } from 'bignumber.js';
import { store } from '../../redux';
import { calculateTokensInWrapper, calculateTokensOutWrapper, loadSwapDataWrapper } from './wrappers';
import { IBestPathResponse, ISwapDataResponse} from './types'
import { IConfigTokens } from '../../config/types';
import { ROUTER_BLACKLISTED_TOKENS } from '../../constants/global';


export const allPaths = async (tokenIn: string, tokenOut: string , multihop : boolean): Promise<{ paths: string[], swapData: ISwapDataResponse[][] }> => {
    try {
        const state = store.getState();
        const TOKEN = state.config.tokens;
        // Making Empty Visited Array
        const visited: { [x: string]: boolean } = {};

        // Reinitializing paths to remove any gunk
        let paths : string[] = [];
       
        // Initialise Visited with false
        Object.keys(TOKEN).forEach(function (key) {
            visited[key] = false;
        });
        
        allPathHelper(tokenIn, tokenOut, visited, tokenIn, TOKEN , paths);

        let tempPaths : string[] = [];

        for (const i in paths){
            const path = paths[i].split(' ');
            if(!multihop){
                if(path.length === 2)   // To show only directSwap
                tempPaths.push(paths[i]);
            }
            else{
                if(path.length <= 5) //To prevent 5 swaps if required
                tempPaths.push(paths[i]);
            }
        }

        const filteredPaths = filterPathsWithBlacklistedTokens(tempPaths);
        filteredPaths.sort((a, b) => a.length - b.length);
        paths = filteredPaths;
    
        let swapData: ISwapDataResponse[][] = [];
        // const allSwapDataPromises: Promise<ISwapDataResponse>[][] = [];
        const preLoadedSwapData: { [tokenPair:string] : ISwapDataResponse } = {};

        for (const i in paths) {
            const path = paths[i].split(' ');
            // const swapDataPromises: Promise<ISwapDataResponse>[] = [];
            swapData[i] = [];
            for (let j = 0; j < path.length - 1; j++) {
                // Getting Swap Details
                // swapData[i][j] = await loadSwapDataWrapper(path[j], path[j + 1]);
                // swapDataPromises.push(loadSwapDataWrapper(path[j], path[j + 1]));  // Creating array of promises for all pairs in path
                // Check if swap data exists for the pair and use it if found
                if(preLoadedSwapData[`${path[j]}_${path[j + 1]}`]) {
                    swapData[i][j] = preLoadedSwapData[`${path[j]}_${path[j + 1]}`]
                } else {
                    swapData[i][j] = await loadSwapDataWrapper(path[j], path[j + 1]);
                    // Store the swap data for later use if the same pair occurs again
                    preLoadedSwapData[`${path[j]}_${path[j + 1]}`] = swapData[i][j];
                }
            }
            // allSwapDataPromises.push(swapDataPromises); // Creating array of promises for all paths.
        }
        // Executing array of array of promises
        // swapData = await Promise.all(
        //   allSwapDataPromises.map((swapDataPromises) => Promise.all(swapDataPromises))
        // ); 

        return {
            paths,
            swapData
        };

    } catch (error) {
        console.log(error);
        return {
            paths: [],
            swapData: []
        };
    }
};

const allPathHelper = (
    src: string,
    dest: string,
    visited: { [x: string]: boolean },
    psf: string,
    TOKEN: IConfigTokens,
    paths : string[],
) => {
    // console.log(src, dest, TOKEN[src]);
    if (src === dest) {
        paths.push(psf);
    }
    visited[src] = true;
    for (const x in TOKEN[src].pairs) {
        if (visited[TOKEN[src].pairs[x]] == false) {
            allPathHelper(
                TOKEN[src].pairs[x],
                dest,
                visited,
                psf + ' ' + TOKEN[src].pairs[x],
                TOKEN,
                paths
            );
        }
    }
    visited[src] = false;
};



export const computeAllPaths = (
    paths: string[],
    tokenInAmount: BigNumber,
    slippage: BigNumber,
    swapData: ISwapDataResponse[][],
): IBestPathResponse => {
    try {
        let bestPath;

            for (const i in paths) {
                // Adding input from user
                const tokenInAmountArr: BigNumber[] = [];
                tokenInAmountArr.push(tokenInAmount);

                const fees: BigNumber[] = [];
                const minimumTokenOut: BigNumber[] = [];
                const feePerc: BigNumber[] = [];
                const priceImpact: BigNumber[] = [];

                const path = paths[i].split(' ');
                for (let j = 0; j < path.length - 1; j++) {
                    // Getting Swap Details
                    const res = swapData[i][j];

                    // Calculating individual Token out value
                    const output = calculateTokensOutWrapper(
                        tokenInAmountArr[j],
                        res.exchangeFee,
                        slippage,
                        path[j],
                        path[j + 1],
                        res.tokenInSupply,
                        res.tokenOutSupply,
                        res.tokenInPrecision ?? undefined,
                        res.tokenOutPrecision ?? undefined,
                        res.target ?? undefined
                    );

                    tokenInAmountArr.push(output.tokenOutAmount);
                    minimumTokenOut.push(output.minimumOut);
                    fees.push(output.fees);
                    feePerc.push(output.feePerc);
                    priceImpact.push(output.priceImpact);
                }

                // Update bestPath
                if (bestPath) {
                    // update best path
                    if (
                        tokenInAmountArr[tokenInAmountArr.length - 1].isGreaterThan(bestPath.tokenOutAmount)
                    ) {
                        bestPath.path = path;
                        bestPath.tokenOutAmount = tokenInAmountArr[tokenInAmountArr.length - 1];
                        bestPath.minimumTokenOut = minimumTokenOut;
                        bestPath.fees = fees;
                        bestPath.feePerc = feePerc;
                        bestPath.priceImpact = priceImpact;
                        bestPath.bestPathSwapData = swapData[i];
                    }
                } else {
                    // add current path as best path
                    bestPath = {
                        path: path,
                        tokenOutAmount: tokenInAmountArr[tokenInAmountArr.length - 1],
                        minimumTokenOut: minimumTokenOut,
                        fees: fees,
                        feePerc: feePerc,
                        priceImpact: priceImpact,
                        bestPathSwapData : swapData[i],
                    };
                }
            }

        if (bestPath) return bestPath;
        else throw new Error('Can not calculate Route');
    } catch (error) {
        console.log(error);
        const bestPath = {
            path: [],
            bestPathSwapData : [],
            tokenOutAmount: new BigNumber(0),
            minimumTokenOut: [],
            priceImpact: [],
            fees: [],
            feePerc: [],
        };
        return bestPath;
    }
};

export const computeAllPathsReverse = (
    paths: string[],
    tokenInAmount: BigNumber,
    slippage: BigNumber,
    swapData: ISwapDataResponse[][],
): IBestPathResponse => {
    try {
        let bestPath;

            for (const i in paths) {
                // Adding input from user
                const tokenInAmountArr: BigNumber[] = [];
                tokenInAmountArr.push(tokenInAmount);

                const fees: BigNumber[] = [];
                const minimumTokenOut: BigNumber[] = [];
                const feePerc: BigNumber[] = [];
                const priceImpact: BigNumber[] = [];

                const path = paths[i].split(' ');
                for (let j = 0; j < path.length - 1; j++) {
                    // Getting Swap Details
                    const res = swapData[i][j];

                    // Calculating individual Token out value
                    const output = calculateTokensInWrapper(
                        tokenInAmountArr[j],
                        res.exchangeFee,
                        slippage,
                        path[j],
                        path[j + 1],
                        res.tokenInSupply,
                        res.tokenOutSupply,
                        res.tokenInPrecision ?? undefined,
                        res.tokenOutPrecision ?? undefined,
                        res.target ?? undefined
                    );

                    tokenInAmountArr.push(output.tokenOutAmount);
                    minimumTokenOut.push(output.minimumOut);
                    fees.push(output.fees);
                    feePerc.push(output.feePerc);
                    priceImpact.push(output.priceImpact);
                }

                // Update bestPath
                if (bestPath) {
                    // update best path
                    if (
                        tokenInAmountArr[tokenInAmountArr.length - 1].isGreaterThan(bestPath.tokenOutAmount)
                    ) {
                        bestPath.path = path;
                        bestPath.tokenOutAmount = tokenInAmountArr[tokenInAmountArr.length - 1];
                        bestPath.minimumTokenOut = minimumTokenOut;
                        bestPath.fees = fees;
                        bestPath.feePerc = feePerc;
                        bestPath.priceImpact = priceImpact;
                        bestPath.bestPathSwapData = swapData[i];
                    }
                } else {
                    // add current path as best path
                    bestPath = {
                        path: path,
                        tokenOutAmount: tokenInAmountArr[tokenInAmountArr.length - 1],
                        minimumTokenOut: minimumTokenOut,
                        fees: fees,
                        feePerc: feePerc,
                        priceImpact: priceImpact,
                        bestPathSwapData : swapData[i],
                    };
                }
            }

        if (bestPath) return bestPath;
        else throw new Error('Can not calculate Route');
    } catch (error) {
        console.log(error);
        const bestPath = {
            path: [],
            bestPathSwapData : [],
            tokenOutAmount: new BigNumber(0),
            minimumTokenOut: [],
            priceImpact: [],
            fees: [],
            feePerc: [],
        };
        return bestPath;
    }
};

/**
 * Returns all possible paths after filtering out the paths which include
 * any of the blacklisted tokens from router
 * @param paths All possible paths between selected tokens for swapping
 */
const filterPathsWithBlacklistedTokens = (paths: string[]): string[] =>
  paths.reduce((finalPaths: string[], currPath: string) => {
    const blacklistedTokenExistsInPath = ROUTER_BLACKLISTED_TOKENS.some((token) =>
      currPath.includes(token)
    );
    if (!blacklistedTokenExistsInPath) {
      finalPaths.push(currPath);
    }
    return finalPaths;
  }, []);
