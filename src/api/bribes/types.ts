import { BigNumber } from 'bignumber.js'
import { AMM_TYPE } from '../../config/types';

export interface IuserBribeData {
    value : BigNumber;
    name : string;
    amm : string;
    epoch : number;
}

export interface IuserBribeDataResponse {
    tokenA : string;
    tokenB : string;
    poolType : AMM_TYPE;
    bribeValue : BigNumber;
    bribeToken : string,
    epoch : number  
  }