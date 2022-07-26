import { BigNumber } from 'bignumber.js'
import { ITokenInterface } from '../../config/types';

export interface ISwapDataResponse {
  success: boolean;
  tokenIn: string;
  tokenOut: string;
  exchangeFee: BigNumber;
  lpTokenSupply: BigNumber;
  lpToken: ITokenInterface | undefined;
  tokenIn_precision?: BigNumber;
  tokenOut_precision?: BigNumber;
  tokenIn_supply?: BigNumber;
  tokenOut_supply?: BigNumber;
  tezSupply?: BigNumber;
  ctezSupply?: BigNumber;
  target?: BigNumber;
}

export interface ICalculateTokenResponse {
    tokenOut_amount: BigNumber;
    fees: BigNumber;
    feePerc : BigNumber;
    minimum_Out: BigNumber;
    exchangeRate: BigNumber;
    priceImpact: BigNumber;
    error?: any;
  }

export interface IRouterResponse {
  path: string[];
  tokenOut_amount: BigNumber;
  finalMinimumTokenOut: BigNumber;
  minimumTokenOut: BigNumber[];
  finalPriceImpact: BigNumber;
  finalFeePerc: BigNumber;
  feePerc: BigNumber[];
  isStable: boolean[];
  exchangeRate: BigNumber;
}

export interface IBestPathResponse {
  path: string[];
  bestPathSwapData : ISwapDataResponse[];
  tokenOut_amount: BigNumber;
  minimumTokenOut: BigNumber[];
  fees: BigNumber[];
  feePerc: BigNumber[];
  priceImpact: BigNumber[];
}