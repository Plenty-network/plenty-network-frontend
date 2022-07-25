import { BigNumber } from 'bignumber.js'

export interface IBalanceResponse {
        success: boolean;
        balance: BigNumber;
        identifier: string;
        error?: any;
}

export interface IAllBalanceResponse {
     success: boolean; 
     userBalance: { [id: string]: BigNumber } 
    }