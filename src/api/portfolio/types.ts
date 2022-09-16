import { BigNumber } from 'bignumber.js';
import { AMM_TYPE } from '../../config/types';

export interface IVotesStatsDataResponse {
  success: boolean;
  totalEpochVotingPower: BigNumber;
  totalPlyLocked: BigNumber;
  error?: string;
}

export interface IPositionsIndexerData {
  amm: string;
  lqtBalance: string;
  stakedBalance: string;
  derivedBalance: string;
  boostTokenId: string;
  poolAPR: string;
}

export interface IPositionsData {
  ammAddress: string;
  tokenA: string;
  tokenB: string;
  ammType: AMM_TYPE
  totalLiquidityAmount: BigNumber;
  stakedPercentage: BigNumber;
  userAPR: BigNumber;
  boostValue: BigNumber;
}

export interface IPositionsResponse {
  success: boolean;
  liquidityAmountSum: BigNumber;
  positionPoolsData: IPositionsData[],
  error?: string;
}

export interface IPositionStatsResponse {
  success: boolean;
  tvl: BigNumber;
  totalEpochVotingPower: BigNumber;
  totalPLYLocked: BigNumber;
  error?: string;
}