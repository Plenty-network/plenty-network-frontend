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

export interface initialBoundaries {
  minTick: number;
  maxTick: number;
  minValue: BigNumber;
  maxValue: BigNumber;
}

export interface IV3Position {
  key_id: string;
  amm: string;
  owner: string;
  upper_tick_index: string;
  lower_tick_index: string;
  liquidity: string;
  fee_growth_inside_last_x: string;
  fee_growth_inside_last_y: string;
}

export interface IV3PositionObject {
  liquidity: {
    x: BigNumber;
    y: BigNumber;
  };
  liquidityDollar: BigNumber;
  minPrice: BigNumber;
  maxPrice: BigNumber;
  fees: {
    x: BigNumber;
    y: BigNumber;
  };
  feesDollar: BigNumber;
  isInRange: boolean;
  isMaxPriceInfinity: boolean;
  position: IV3Position;
  tokenX?: String;
  tokenY?: String;
  currentTickIndex: number;
}
