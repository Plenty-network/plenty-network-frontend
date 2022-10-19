import { AMM_TYPE, IAMM } from "../../config/types";
import { BigNumber } from 'bignumber.js'

export interface VolumeV1Data {
  pool: string;
  bribes: Bribes[];
  apr: string;
  futureApr : number
}

export interface Volume24H {
  value: string;
  token1: string;
  token2: string;
}

export interface Volume7D {
  value: string;
  token1: string;
  token2: string;
}

export interface Fees24H {
  value: string;
  token1: string;
  token2: string;
}

export interface Fees7D {
  value: string;
  token1: string;
  token2: string;
}

export interface FeesEpoch {
  value: string;
  token1: string;
  token2: string;
}

export interface Tvl {
  value: string;
  token1: string;
  token2: string;
}

export interface VolumeVeData {
  pool: string;
  volume24H: Volume24H;
  volume7D: Volume7D;
  fees24H: Fees24H;
  fees7D: Fees7D;
  feesEpoch: FeesEpoch;
  tvl: Tvl;
}

export interface Bribes{
  value : BigNumber;
  price : BigNumber;
  name : string;
}

export interface IPoolsDataWrapperResponse {
  tokenA : String;
  tokenB : String;
  poolType : AMM_TYPE;
  apr : BigNumber;
  futureApr : BigNumber;
  boostedApr : BigNumber;
  volume : BigNumber;
  volumeTokenA : BigNumber;
  volumeTokenB : BigNumber;
  tvl : BigNumber;
  tvlTokenA : BigNumber;
  tvlTokenB : BigNumber;
  fees : BigNumber;
  feesTokenA : BigNumber;
  feesTokenB : BigNumber;
  bribeUSD : BigNumber;
  bribes : Bribes[];
  isLiquidityAvailable : boolean;
  isStakeAvailable: boolean;

}

export interface IAnalyticsDataObject {
  [key: string]: VolumeVeData;
}
