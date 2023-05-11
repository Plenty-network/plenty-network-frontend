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

export const calculateCurrentPrice = async (
  ): Promise<any>  => {
    try {
        const v3ContractStorage = await axios.get(`${Config.RPC_NODES.testnet}/chains/main/blocks/head/context/contracts/${v3ContractAddress}/storage`);
        let sqrtPriceValue = BigNumber(parseInt(v3ContractStorage.data.args[3].int));
        let currTickIndex = parseInt(v3ContractStorage.data.args[0].args[0].args[1].int);
        let tickSpacing = parseInt(v3ContractStorage.data.args[0].args[0].args[0].args[0].args[4].int);
        
        let tokenXSymbol = "CTez";
        let tokenYSymbol = "PLY";

        let tokenX = await TokenDetail(tokenXSymbol);
        let tokenY = await TokenDetail(tokenYSymbol);

        let PoolObject = new Pool(tokenX, tokenY, currTickIndex, tickSpacing, sqrtPriceValue);
        
        let currentPriceTokenY = PoolObject.getRealPriceTokenY();
        let currentPriceTokenX = PoolObject.getRealPriceTokenX();

        let estimateAmountXFromY = PoolObject.estimateAmountXFromY(BigNumber(2), 0, 1);
        let estimateAmountYFromX = PoolObject.estimateAmountYFromX(BigNumber(2), 0, 1);

        console.log('v3-------v3', PoolObject);
    }
    catch(error) {
        console.log("v3 error: ", error);
    }
}

export const calculatePriceRange = async (
    ): Promise<any>  => {
      try {
          let minTickPriceValue = Tick.computeRealPriceFromTick(2, tokenX, tokenY);
          let maxTickPriceValue = Tick.computeRealPriceFromTick(4, tokenX, tokenY);
    
          console.log('v3-------v3', minTickPriceValue, maxTickPriceValue);
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
  }
