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
  feeTier: any;
}

export interface IV3ContractStorageParams {
  currTickIndex: number;
  currentTickWitness: number;
  tickSpacing: number;
  sqrtPriceValue: BigNumber;
  liquidity: BigNumber;
  feeBps: number;
  tokenX: Token;
  tokenY: Token;
  feeGrowth: {
    x: BigNumber;
    y: BigNumber;
  };
  poolAddress: string;
  ticksBigMap: number;
}

export interface IAllPoolsData {
  tokenA: String;
  tokenB: String;
  feeTier: BigNumber;
  apr: BigNumber;
  volume: BigNumber;
  tvl: BigNumber;
  fees: BigNumber;
}

export interface IAllPoolsDataResponse {
  success: boolean;
  allData: any;
  error?: string;
}

export interface IMyPoolsDataResponse {
  success: boolean;
  allData: any;
  error?: string;
}

export interface IDataResponse {
  symbolX: string;
  symbolY: string;
  address: string;
  feebps: any;
  tvl?: any;
  poolShare?: any;
}