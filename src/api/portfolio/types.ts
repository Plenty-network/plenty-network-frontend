import { BigNumber } from 'bignumber.js';

export interface IVotesStatsDataResponse {
  success: boolean;
  totalEpochVotingPower: BigNumber;
  totalPlyLocked: BigNumber;
  error?: string;
}