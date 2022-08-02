import { BigNumber } from 'bignumber.js'
import { ITokenInterface } from '../../config/types';

export interface ISwapDataResponse {
  success: boolean;
  tokenIn: string;
  tokenOut: string;
  exchangeFee: BigNumber;
  lpTokenSupply: BigNumber;
  lpToken: ITokenInterface | undefined;
  tokenInPrecision?: BigNumber;
  tokenOutPrecision?: BigNumber;
  tokenInSupply: BigNumber;
  tokenOutSupply: BigNumber;
  target?: BigNumber;
}

export interface ICalculateTokenResponse {
    tokenOutAmount: BigNumber;
    fees: BigNumber;
    feePerc : BigNumber;
    minimumOut: BigNumber;
    exchangeRate: BigNumber;
    priceImpact: BigNumber;
    error?: any;
  }

export interface IRouterResponse {
  path: string[];
  tokenOutAmount: BigNumber;
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
  tokenOutAmount: BigNumber;
  minimumTokenOut: BigNumber[];
  fees: BigNumber[];
  feePerc: BigNumber[];
  priceImpact: BigNumber[];
}