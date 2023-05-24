import { BigNumber } from 'bignumber.js'
import { DefaultContractType, MichelsonMap, WalletContract } from "@taquito/taquito";
export declare type Contract = DefaultContractType | WalletContract;

export interface Token {
    address: string;
    standard: string;
    decimals: number;
}

export interface BalanceNat {
    x: BigNumber;
    y: BigNumber;
}