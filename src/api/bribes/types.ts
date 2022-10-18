import { BigNumber } from "bignumber.js";
import { AMM_TYPE } from "../../config/types";
import { Bribes, VolumeVeData } from "../pools/types";

export interface IUserBribeIndexerData {
  value: string;
  name: string;
  amm: string;
  epoch: string;
  price : string;
}

export interface IUserBribeData {
  ammAddress: string;
  tokenA: string;
  tokenB: string;
  poolType: AMM_TYPE;
  bribeValue: BigNumber;
  bribeValuePerEpoch : BigNumber;
  bribeToken: string;
  epochStart: number;
  epochEnd: number;
  epochStartDate : number;
  epochEndDate : number;
}

export interface IGroupedData{
  key : string;
  value : number[];
}

export interface IPreProcessedMap{
  value : BigNumber;
  price : number;
}

export interface IUserBribeDataResponse {
  success: boolean;
  userBribesData: IUserBribeData[];
  error?: string;
}

export interface IPoolsDataObject {
  [key: string]: VolumeVeData;
}

export interface IPoolsBribeLiquidityData {
  [id: string]: {
    bribes: BigNumber;
    liquidity: BigNumber;
    bribesData: Bribes[];
    liquidityTokenA: BigNumber;
    liquidityTokenB: BigNumber;
  };
}

export interface IPoolsForBribesData{
  amm: string;
  tokenA: string;
  tokenB: string;
  poolType: AMM_TYPE;
  bribes : BigNumber;
  bribesData : Bribes[];
  liquidity : BigNumber;
  liquidityTokenA : BigNumber;
  liquidityTokenB : BigNumber;
  totalVotesCurrent : BigNumber;
  totalVotesPercentageCurrent : BigNumber;
  totalVotesPrevious : BigNumber;
  totalVotesPercentagePrevious : BigNumber;
}

export interface IPoolsForBribesResponse {
  success: boolean;
  poolsData: IPoolsForBribesData[],
  error?: string;
}