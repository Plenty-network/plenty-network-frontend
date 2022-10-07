import { BigNumber } from "bignumber.js";
import { AMM_TYPE } from "../../config/types";

export interface IUserBribeIndexerData {
  value: string;
  name: string;
  amm: string;
  epoch: string;
}

export interface IUserBribeData {
  ammAddress: string;
  tokenA: string;
  tokenB: string;
  poolType: AMM_TYPE;
  bribeValue: BigNumber;
  bribeToken: string;
  epoch: number;
}

export interface IUserBribeDataResponse {
  success: boolean;
  userBribesData: IUserBribeData[];
  error?: string;
}
