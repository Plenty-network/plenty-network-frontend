import axios from 'axios';
import Config from '../../config/config';
import { Tick, Pool } from "@plenty-labs/v3-sdk";
import BigNumber from 'bignumber.js';
import { Token } from './types';

const v3ContractAddress = `KT1M5yHd85ikngHm5YCu9gkfM2oqtbsKak8Y`;
export const connectedNetwork = Config.NETWORK;

const TokenDetail = async(tokenSymbol : String) : Promise<Token> => {
    const configResponse = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}analytics/tokens/${tokenSymbol}`);
    let tokenAddress = configResponse.data[0].contract;
    let tokenStandard = configResponse.data[0].standard;
    let tokenDecimals = configResponse.data[0].decimals;

    return {
        address: tokenAddress,
        standard: tokenStandard,
        decimals: tokenDecimals,
    }
}

const ContractStorage = async(tokenXSymbol : String, tokenYSymbol : String) : Promise<any> => {
    const v3ContractStorage = await axios.get(`${Config.RPC_NODES.testnet}/chains/main/blocks/head/context/contracts/${v3ContractAddress}/storage`);
    let sqrtPriceValue = BigNumber(parseInt(v3ContractStorage.data.args[3].int));
    let currTickIndex = parseInt(v3ContractStorage.data.args[0].args[0].args[1].int);
    let tickSpacing = parseInt(v3ContractStorage.data.args[0].args[0].args[0].args[0].args[4].int);
    
    let tokenX = await TokenDetail(tokenXSymbol);
    let tokenY = await TokenDetail(tokenYSymbol);
    
    return {
        sqrtPriceValue : sqrtPriceValue,
        currTickIndex : currTickIndex,
        tickSpacing : tickSpacing,
        tokenX : tokenX,
        tokenY : tokenY,
    };
}

export const calculateCurrentPrice = async ( tokenXSymbol: String, tokenYSymbol: String, refernceToken: String
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

export const calculateFullRange = async ( tokenXSymbol: String, tokenYSymbol: String
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

export const calculateMinandMaxPriceFromTick = async (tokenXSymbol: String, tokenYSymbol: String
    ): Promise<any>  => {
      try {
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);

          let initialBoundaries = PoolObject.getInitialBoundaries();
          let minTick = initialBoundaries[0];
          let maxTick = initialBoundaries[1];

          let minPriceValue = Tick.computeRealPriceFromTick(minTick, contractStorageParameters.tokenX, contractStorageParameters.tokenY);
          let maxPriceValue = Tick.computeRealPriceFromTick(maxTick, contractStorageParameters.tokenX, contractStorageParameters.tokenY);
    
          console.log('v3-------v3', minTick, maxTick, minPriceValue, maxPriceValue);

          return {
            minValue : minPriceValue,
            maxValue : minPriceValue,
          }
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const estimateTokenAFromTokenB = async ( amount: BigNumber, tokenXSymbol: String, tokenYSymbol: String
    ): Promise<any>  => {
      try {
          let estimatedAmount;
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);

          let initialBoundaries = PoolObject.getInitialBoundaries();
          let lowerTickIndex = initialBoundaries[0];
          let upperTickIndex = initialBoundaries[1];

          estimatedAmount = PoolObject.estimateAmountXFromY(amount, lowerTickIndex, upperTickIndex);

          return estimatedAmount;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const estimateTokenBFromTokenA = async ( amount: BigNumber, tokenXSymbol: String, tokenYSymbol: String
    ): Promise<any>  => {
      try {
          let estimatedAmount;
          let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
          let PoolObject = new Pool(contractStorageParameters.tokenX, contractStorageParameters.tokenY, contractStorageParameters.currTickIndex, contractStorageParameters.tickSpacing, contractStorageParameters.sqrtPriceValue);
          
          let initialBoundaries = PoolObject.getInitialBoundaries();
          let lowerTickIndex = initialBoundaries[0];
          let upperTickIndex = initialBoundaries[1];
          
          estimatedAmount = PoolObject.estimateAmountYFromX(amount, lowerTickIndex, upperTickIndex);

          return estimatedAmount;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}