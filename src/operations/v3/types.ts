import { BigNumber } from 'bignumber.js'

import { DefaultContractType, MichelsonMap, WalletContract } from "@taquito/taquito";
export declare type Contract = DefaultContractType | WalletContract;

export interface Token {
    address: string;
    standard: string;
    decimals: number;
}

export enum Chain {
    ETHEREUM = "ETHEREUM",
    BSC = "BSC",
    POLYGON = "POLYGON",
    TEZOS = "TEZOS",
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
  
export interface IConfigToken {
    name: string;
    symbol: string;
    decimals?: number;
    standard?: TokenStandard;
    address?: string;
    tokenId?: number;
    thumbnailUri?: string;
    originChain?: Chain;
    pairs?: string[];
    iconUrl?: string;
}