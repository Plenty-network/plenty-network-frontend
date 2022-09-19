import { BigNumber } from 'bignumber.js';
import { AMM_TYPE } from '../../config/types';
import { IVeNFTData } from '../votes/types';

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

export interface IAllLocksPositionData extends IVeNFTData {
  endTimeStamp: number;
  attached: boolean;
  attachedGaugeAddress: string | undefined;
  attachedAmmAddress: string | undefined;
  attachedTokenASymbol: string | undefined;
  attachedTokenBSymbol: string | undefined;
}

export interface IAttachedTzktResponse {
  key: string;
  value: string;
}

export interface IAttachedData {
  [key: string]: string;
}

export interface IAllLocksPositionResponse {
  success: boolean;
  allLocksData: IAllLocksPositionData[];
  error?: string;
}