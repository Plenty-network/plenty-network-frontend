import { BigNumber } from "bignumber.js";
import { DefaultContractType, MichelsonMap, WalletContract } from "@taquito/taquito";
export declare type Contract = DefaultContractType | WalletContract;

export declare enum TokenStandard {
  FA12 = "FA1.2",
  FA2 = "FA2",
}

export interface Token {
  address: string;
  tokenId?: number;
  standard: TokenStandard;
  decimals: number;
}

export interface BalanceNat {
  x: BigNumber;
  y: BigNumber;
}
