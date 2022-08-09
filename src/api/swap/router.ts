import { BigNumber } from 'bignumber.js';
import { store } from '../../redux';
import { calculateTokensOutWrapper, loadSwapDataWrapper } from './wrappers';
import { IBestPathResponse, ISwapDataResponse} from './types'
import { ITokens } from '../../config/types';

let paths: string[] = [];

export const allPaths = async (tokenIn: string, tokenOut: string , multihop : boolean): Promise<{ paths: string[], swapData: ISwapDataResponse[][] }> => {
    try {
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

        let tempPaths : string[] = [];

        for (var i in paths){
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
        paths = tempPaths;
    
        let swapData: ISwapDataResponse[][] = [[], []];

        for (var i in paths) {
            const path = paths[i].split(' ');
            for (let j = 0; j < path.length - 1; j++) {
                // Getting Swap Details
                swapData[i][j] = await loadSwapDataWrapper(path[j], path[j + 1]);
            }
        }
        return {
            paths,
            swapData
        };

    } catch (error) {
        console.log(error);
        return {
            paths: [],
            swapData: [[], []]
        };
    }
};

const allPathHelper = (
    src: string,
    dest: string,
    visited: { [x: string]: boolean },
    psf: string,
    TOKEN: ITokens
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

export const computeAllPaths = (
    paths: string[],
    tokenInAmount: BigNumber,
    slippage: BigNumber,
    swapData: ISwapDataResponse[][],
): IBestPathResponse => {
    try {
        let bestPath;

            for (var i in paths) {
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
                        tokenInAmountArr[tokenInAmountArr.length - 1] > bestPath.tokenOutAmount
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


