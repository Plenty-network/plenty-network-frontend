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