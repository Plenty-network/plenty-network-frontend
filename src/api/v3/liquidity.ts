import axios from 'axios';
import Config from '../../config/config';
import { Tick, Pool } from "@plenty-labs/v3-sdk";
import BigNumber from 'bignumber.js';
import { Token } from './types';

const v3ContractAddress = `KT1M5yHd85ikngHm5YCu9gkfM2oqtbsKak8Y`;
export const connectedNetwork = Config.NETWORK;

const TokenDetail = async(tokenSymbol : String) : Promise<Token> => {
    let configResponse :any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
    configResponse = configResponse.data[`${tokenSymbol}`];

    let tokenAddress = configResponse.address;
    let tokenStandard = configResponse.standard;
    let tokenDecimals = configResponse.decimals;

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
        
        console.log('v3', currentPrice)
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
            
          console.log("v3----", tickFullRange);
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

export const calculateNearTickSpacing = async ( tick: number, space: number
    ): Promise<any>  => {
      try {
          let nearestTick = Tick.nearestUsableTick(tick, space);
            
          console.log("v3----", nearestTick);
          return nearestTick;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}