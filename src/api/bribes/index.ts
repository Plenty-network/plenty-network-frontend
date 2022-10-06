import { store } from '../../redux';
import axios from 'axios';
import Config from '../../config/config';
import { IuserBribeData, IuserBribeDataResponse } from './types';
import {BigNumber} from 'bignumber.js';

export const userBribeData = async (address : string , tokenPrice: { [id: string]: number }) : Promise<{success : boolean , allData : { [id: string]: IuserBribeDataResponse }}> => {
    try {

        const state = store.getState();
        const AMMS = state.config.AMMs;
        const TOKEN = state.config.tokens;

        const userBribeResponse = await axios.get(`${Config.VE_INDEXER}bribes-provider?address=${address}`);
        const myBribesData : IuserBribeData[] = userBribeResponse.data;

        const allData: { [id: string]: IuserBribeDataResponse } = {};

        for(var bribe of myBribesData){
            const AMM = AMMS[bribe.amm];

            allData[bribe.amm]= {
            tokenA: AMM.token1.symbol,
            tokenB: AMM.token2.symbol,
            poolType: AMM.type,

            bribeValue : bribe.value.dividedBy(new BigNumber(10).pow(TOKEN[bribe.name].decimals)).multipliedBy(tokenPrice[bribe.name]),
            bribeToken : bribe.name , 

            epoch : bribe.epoch
        };

        }

        return{
            success : true,
            allData : allData
        };

        
    } catch (error) {
        console.log(error);
        return{
            success : false,
            allData : {}
        };
    }
    
}