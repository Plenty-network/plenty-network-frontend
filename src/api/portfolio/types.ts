import { BigNumber } from 'bignumber.js';
import { PoolType } from '../../config/types';
import { IVeNFTData } from '../votes/types';

export interface IVotesStatsDataResponse {
  // success: boolean;
  totalEpochVotingPower: BigNumber;
  totalPlyLocked: BigNumber;
  error?: string;
}

export interface IPositionsData {
  ammAddress: string;
  tokenA: string;
  tokenB: string;
  ammType: PoolType
  totalLiquidityAmount: BigNumber;
  stakedPercentage: BigNumber;
  userAPR: BigNumber;
  boostValue: BigNumber;
  isGaugeAvailable: boolean;
}

export interface IPositionsResponse {
  success: boolean;
  liquidityAmountSum: BigNumber;
  positionPoolsData: IPositionsData[],
  error?: string;
}

export interface ITvlStatsResponse {
  success: boolean;
  tvl: BigNumber;
  error?: string;
}

export interface IPositionStatsResponse extends ITvlStatsResponse {
  totalEpochVotingPower: BigNumber;
  totalPLYLocked: BigNumber;
}

export interface IAllLocksPositionData extends IVeNFTData {
  endTimeStamp: number;
  attached: boolean;
  attachedGaugeAddress: string | undefined;
  attachedAmmAddress: string | undefined;
  attachedTokenASymbol: string | undefined;
  attachedTokenBSymbol: string | undefined;
  thumbnailUri: string,
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

export interface IPoolsRewardsData {
  tokenOneSymbol: string;
  tokenTwoSymbol: string;
  ammAddress: string;
  ammType: PoolType;
  gaugeAddress: string | undefined;
  gaugeEmission: BigNumber;
  gaugeEmissionValue: BigNumber;
  boostValue: BigNumber;
}

export interface IPoolsRewardsResponse {
  success: boolean;
  gaugeEmissionsTotal: BigNumber;
  gaugeEmissionsTotalValue: BigNumber;
  poolsRewardsData: IPoolsRewardsData[];
  gaugeAddresses: string[];
  error?: string;
}


export enum EFeesStatus {
  GENERATED,
  NOT_PULLED,
  CLAIMED
}

export interface ILockRewardsBribeData {
  bribeValue: BigNumber;
  bribePrice: BigNumber;
  tokenSymbol: string;
}

export interface ILockRewardsFeeData {
  tokenAFees: BigNumber;
  tokenBFees: BigNumber;
}

export interface ILockRewardsEpochData {
  ammAddress: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  ammType: PoolType;
  votes: BigNumber;
  votesPercentage: BigNumber;
  bribesAmount: BigNumber;
  feesAmount: BigNumber;
  feesStatus: EFeesStatus;
  feesData: ILockRewardsFeeData;
  bribesData: ILockRewardsBribeData[];
}

export interface ILocksRewardsTokenData {
  [epoch: string]: ILockRewardsEpochData[];
}

export interface IAllLocksRewardsData {
  [tokenId: string]: ILocksRewardsTokenData;
}

export interface IAllLocksRewardsResponse {
  allLocksRewardsData: IAllLocksRewardsData;
  totalTradingFeesAmount: BigNumber;
  totalBribesAmount: BigNumber;
}

export interface IBribesValueAndData {
  bribesValue: BigNumber;
  bribesData: ILockRewardsBribeData[];
}

export interface IFeesValueAndData {
  feesAmount: BigNumber;
  feesStatus: EFeesStatus;
  feesData: ILockRewardsFeeData;
}

export interface IUnclaimedInflationData {
  unclaimedInflationAmount: BigNumber;
  unclaimedInflationValue: BigNumber;
}

export interface ILockInflationData {
  epoch: number;
  inflationValue: BigNumber;
  inflationInPly: BigNumber;
}

export interface IAllLocksInflationData {
  [tokenId: string]: ILockInflationData[];
}

export interface IUnclaimedInflationResponse {
  unclaimedInflationData: IUnclaimedInflationData;
  claimAllInflationData: IClaimInflationOperationData[];
  allLocksInflationData: IAllLocksInflationData;
}

export interface ILockRewardsData {
  unclaimedFeesValue: BigNumber;
  unclaimedBribesValue: BigNumber;
  unclaimedInflationValue: BigNumber;
  unclaimedInflationInPLY: BigNumber;
}

export interface ILockRewardsOperationData {
  lockFeesClaimData: IAllClaimableFeesData[];
  lockBribesClaimData: IAllBribesOperationData[];
  lockInflationClaimData: IClaimInflationOperationData[];
}

export interface IUnclaimedRewardsForLockData {
  success: boolean;
  unclaimedRewardsExist: boolean;
  lockRewardsData: ILockRewardsData;
  lockRewardsOperationData: ILockRewardsOperationData;
  error?: string;
}

//Claim rewards of locks operations Types
export interface IAllEpochClaimBribeData {
  bribeId: number;
  amm: string;
}

export interface IAllEpochClaimData {
  tokenId: number;
  epoch: number;
  bribeData: IAllEpochClaimBribeData[];
  feeData: string[];
}

export interface IAllEpochClaimTokenData {
  [epoch: string]: IAllEpochClaimData;
}

export interface IAllEpochClaimOperationData {
  [tokenId: string]: IAllEpochClaimTokenData;
}

export interface IAllBribesOperationData {
  tokenId: number;
  epoch: number;
  bribeId: number;
  amm: string;
}

export interface IAmmEpochData {
  [amm: string]: number[]; //"amm_address_as_key": array_of_epoch_numbers[]
}

export interface IAllFeesOperationData {
  tokenId: number;
  amms: IAmmEpochData;
}

export interface IAllClaimableFeesData {
  tokenId: number;
  amm: string;
  epoch: number[];
}

export interface IAllRewardsOperationsData {
  epochClaimData: IAllEpochClaimOperationData;
  feesClaimData: IAllClaimableFeesData[];
  bribesClaimData: IAllBribesOperationData[];
}

export interface IClaimInflationOperationData {
  tokenId: number;
  epochs: number[]
}


// Indexer Responses Types
export interface IPositionsAprIndexerData {
  current: string;
  future: string;
}

export interface IPositionsIndexerData {
  amm: string;
  lqtBalance: string;
  stakedBalance: string;
  derivedBalance: string;
  boostTokenId: string;
  poolAPR: IPositionsAprIndexerData;
}

export interface IAllLocksRewardsIndexerData {
  votesUnclaimed: IVotesUnclaimedIndexer[];
  lockId: string;
}

export interface IVotesUnclaimedIndexer {
  epoch: string;
  amm: string;
  votes: string;
  fee: IFeeIndexer;
  bribes: IBribeIndexer[];
  unclaimedBribes: number[];
  feeClaimed: boolean;
  voteShare: string;
}

export interface IBribeIndexer {
  amm: string;
  epoch: string;
  bribeId: string;
  provider: string;
  value: string;
  name: string;
}

export interface IFeeIndexer {
  token1Fee: string;
  token2Fee: string;
  token1Symbol: string;
  token2Symbol: string;
}


export interface IEpochInflationIndexer {
  epoch: string;
  inflationShare: string;
}

export interface IUnclaimedInflationIndexer {
  id: string;
  unclaimedInflation: IEpochInflationIndexer[];
}