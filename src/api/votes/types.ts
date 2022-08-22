import { BigNumber } from "bignumber.js";
export interface IEpochListObject {
  epochNumber: number;
  isCurrent: boolean;
  startTimestamp: number;
  endTimestamp: number;
}

export interface IEpochDataResponse {
  success: boolean;
  epochData: IEpochListObject[];
  error?: string;
}

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