import { BigNumber } from "bignumber.js";
import { PoolType } from "../../config/types";
import { Bribes, VolumeVeData } from "../pools/types";


export interface ITotalAmmVotesData {
  amm: string;
  epoch: string;
}

export interface ITotalAmmVotesBigMap {
  key: ITotalAmmVotesData;
  value: string;
}

export interface IMyAmmVotesData extends ITotalAmmVotesData {
  token_id: string;
}

export interface IMyAmmVotesBigMap {
  key: IMyAmmVotesData;
  value: string;
}

export interface IVeNFTData {
  tokenId: BigNumber;
  baseValue: BigNumber;
  votingPower: BigNumber;
  epochVotingPower: BigNumber;
  consumedVotingPower: BigNumber;
  currentVotingPower: BigNumber;
  nextEpochVotingPower: BigNumber;
  locksState: ELocksState;
}

export interface ISelectedPool {
  tokenA: string;
  tokenB: string;
  votingPower: number;
}

export interface IVeNFTListResponse {
  success: boolean;
  veNFTData: IVeNFTData[];
  error?: string;
}

export interface IVotesData {
  dexContractAddress: string | undefined;
  votePercentage: BigNumber;
  votes: BigNumber;
  tokenOneSymbol: string | undefined;
  tokenTwoSymbol: string | undefined;
}

export interface IVotesResponse {
  success: boolean;
  isOtherDataAvailable: boolean;
  allData: IVotesData[];
  topAmmData: IVotesData[];
  otherData: IVotesData | {};
  error?: string;
}

export interface IAllVotesData {
  [key: string]: IVotesData;
}

export interface IAllVotesResponse {
  success: boolean;
  totalVotesData: IAllVotesData;
  myVotesData: IAllVotesData;
  error?: string;
}

export interface IBribesResponse {
  pool : string;
  bribes : Bribes[];
}

export interface IVotePageRewardData{ [id: string]: {bribes: BigNumber , fees: BigNumber , bribesData : Bribes[] , feesTokenA : BigNumber , feesTokenB : BigNumber} }

export interface IVotePageRewardDataResponse{
  success : boolean;
  allData : IVotePageRewardData;
  error?: string;
}

export interface IVotePageData{
        tokenA: string;
        tokenB: string;
        poolType: PoolType;
        bribes : BigNumber;
        bribesData : Bribes[];
        fees : BigNumber;
        feesTokenA : BigNumber;
        feesTokenB : BigNumber;
        totalVotes : BigNumber;
        totalVotesPercentage : BigNumber;
        myVotes : BigNumber;
        myVotesPercentage : BigNumber;
}

export interface IVotePageDataResponse {
  success: boolean;
  allData: { [id: string]: IVotePageData };
  error?: string;
}

export interface IFeesDataObject {
  [key: string]: VolumeVeData;
}

export enum ELocksState {
  AVAILABLE,
  CONSUMED,
  DISABLED,
  EXPIRED,
}