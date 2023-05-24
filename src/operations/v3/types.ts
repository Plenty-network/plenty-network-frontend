import { BigNumber } from 'bignumber.js'

import { DefaultContractType, MichelsonMap, WalletContract } from "@taquito/taquito";
export declare type Contract = DefaultContractType | WalletContract;

export interface Token {
    address: string;
    standard: string;
    decimals: number;
}

export enum TokenStandard {
    FA12 = "FA1.2",
    FA2 = "FA2",
    TEZ = "TEZ",
}
  
export interface BalanceNat {
    x: BigNumber;
    y: BigNumber;
}