import { BigNumber } from 'bignumber.js';
import { store } from '../../redux';
import { calculateTokensOutWrapper, loadSwapDataWrapper } from './wrappers';

let paths: string[] = [];

export const allPaths = (tokenIn : string , tokenOut:string) : string[] => {
    const state = store.getState();
    const TOKEN = state.config.standard;

    // Making Empty Visited Array
    var visited : { [x: string]: boolean } = {};

    // Reinitializing paths to remove any gunk
    paths = [];

    // Initialise Visited with false
    Object.keys(TOKEN).forEach(function (key) {
        visited[key] = false;
      });
    allPathHelper(tokenIn , tokenOut , visited , tokenIn , TOKEN );

    console.log(paths);
    return paths;
}


const allPathHelper = (src : string , dest : string , visited : any , psf : string , TOKEN : { [x: string]: any }) => {
    if(src === dest){
        paths.push(psf);
    }
    visited[src] = true;
    for(var x in TOKEN[src].pairs){
        if(visited[TOKEN[src].pairs[x]] == false){
            allPathHelper( TOKEN[src].pairs[x] , dest , visited , psf + " " + TOKEN[src].pairs[x] , TOKEN);
        }
    }
    visited[src] = false;
}

// Return Best Path and calculations
export const computeAllPaths =async (paths : string[] , tokenIn_amount : BigNumber , slippage : BigNumber) :  Promise<{path : string[] , tokenOut_amount : BigNumber ,minimumTokenOut : BigNumber[] ,fees : BigNumber[] , feePerc : BigNumber[] }> => {

    try {
        let bestPath;

        for(var i in paths){
            // Adding input from user
            const tokenInAmount : BigNumber[] = [];
            tokenInAmount.push(tokenIn_amount);
    
            const fees: BigNumber[]  = [];
            const minimumTokenOut: BigNumber[]  = [];
            const feePerc: BigNumber[]  = [];
    
            const path = paths[i].split(" ");
    
            for(let j = 0 ; j<path.length-1 ;  j++){
                // Getting Swap Details
                console.log(path[j] , path[j+1]);
                const res = await loadSwapDataWrapper(path[j] , path[j+1]);
                console.log(res);
                // Calculating individual Token out value
                const output = calculateTokensOutWrapper(
                tokenInAmount[j],
                res.exchangeFee,
                slippage,
                path[j],
                path[j+1],
                res.tokenIn_supply ?? undefined,
                res.tokenOut_supply ?? undefined,
                res.tokenIn_precision ?? undefined,
                res.tokenOut_precision ?? undefined,
                res.tezSupply ?? undefined,
                res.ctezSupply ?? undefined,
                res.target ?? undefined);
    
                tokenInAmount.push(output.tokenOut_amount)
                minimumTokenOut.push(output.minimum_Out);
                fees.push(output.fees);
                feePerc.push(output.feePerc);
            }
    
            // Update bestPath
            if(bestPath){
                // update best path
                if(tokenInAmount[tokenInAmount.length-1] > bestPath.tokenOut_amount){
                    bestPath.path = path;
                    bestPath.tokenOut_amount = tokenInAmount[tokenInAmount.length-1];
                    bestPath.minimumTokenOut = minimumTokenOut;
                    bestPath.fees = fees;
                    bestPath.feePerc = feePerc;
                }
            }else{
                // add current path as best path
                bestPath = {
                    path : path,
                    tokenOut_amount : tokenInAmount[tokenInAmount.length-1],
                    minimumTokenOut : minimumTokenOut,
                    fees : fees , 
                    feePerc : feePerc
                }
            }
    
    
        }
    
        console.log(bestPath);

        if(bestPath)
        return bestPath;
        else
        throw "Can not calculate Route";
        
        
    } catch (error) {
        console.log(error);
        const bestPath = {
            path : [],
            tokenOut_amount : new BigNumber(0),
            minimumTokenOut : [],
            fees : [] , 
            feePerc : []

        };
        return bestPath;
    }
}
