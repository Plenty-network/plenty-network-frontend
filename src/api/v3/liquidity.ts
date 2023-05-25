import BigNumber from 'bignumber.js';
import { Tick, Pool } from "@plenty-labs/v3-sdk";
import Config from '../../config/config';
import { ContractStorage } from "./helper";

export const connectedNetwork = Config.NETWORK;

export const calculateCurrentPrice = async ( tokenXSymbol: string, tokenYSymbol: string, refernceToken: String
  ): Promise<any>  => {
    try {
        let currentPrice;

        let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
        let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);

        if(refernceToken === "tokenYSymbol") {
            currentPrice = PoolObject.getRealPriceTokenY();
        } else {
            currentPrice = PoolObject.getRealPriceTokenX();
        }
        
        return currentPrice;
    }
    catch(error) {
        console.log("v3 error: ", error);
    }
}

export const calculateFullRange = async ( tokenXSymbol: string, tokenYSymbol: string
    ): Promise<any>  => {
      try {
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);
          let tickFullRange = PoolObject.getFullRangeBoundaries();
            
          return tickFullRange;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const getInitialBoundaries = async (tokenXSymbol: string, tokenYSymbol: string
    ): Promise<any>  => {
      try {
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);

          let initialBoundaries = PoolObject.getInitialBoundaries();
          let minTick = initialBoundaries[0];
          let maxTick = initialBoundaries[1];

          let minPriceValue = Tick.computeRealPriceFromTick(minTick, contractStorageParameters.tokenX, contractStorageParameters.tokenY);
          let maxPriceValue = Tick.computeRealPriceFromTick(maxTick, contractStorageParameters.tokenX, contractStorageParameters.tokenY);
    
          console.log('v3-------calculateMinandMaxPriceFromTick', minTick, maxTick, minPriceValue, maxPriceValue);

          return {
            minTick : minTick,
            maxTick : maxTick,
            minValue : minPriceValue,
            maxValue : minPriceValue,
          }
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const estimateTokenAFromTokenB = async ( amount: BigNumber, tokenXSymbol: string, tokenYSymbol: string
    ): Promise<any>  => {
      try {
          let estimatedAmount;
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);

          let initialBoundaries = PoolObject.getInitialBoundaries();
          let lowerTickIndex = initialBoundaries[0];
          let upperTickIndex = initialBoundaries[1];

          estimatedAmount = PoolObject.estimateAmountXFromY(amount, lowerTickIndex, upperTickIndex);

        //   console.log('v3-------estimateTokenAFromTokenB', estimatedAmount);
          return estimatedAmount;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const estimateTokenBFromTokenA = async ( amount: BigNumber, tokenXSymbol: string, tokenYSymbol: string
    ): Promise<any>  => {
      try {
          let estimatedAmount;
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);
          
          let initialBoundaries = PoolObject.getInitialBoundaries();
          let lowerTickIndex = initialBoundaries[0];
          let upperTickIndex = initialBoundaries[1];
          
          estimatedAmount = PoolObject.estimateAmountYFromX(amount, lowerTickIndex, upperTickIndex);

        //   console.log('v3-------estimateTokenBFromTokenA', estimatedAmount);
          return estimatedAmount;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}
