import { BigNumber } from "bignumber.js";
import { IConfigLPToken } from "../../config/types";

export interface IBalanceResponse {
  success: boolean;
  balance: BigNumber;
  identifier: string;
  error?: any;
}

export interface ISwapData {
  tokenInSupply: BigNumber;
  tokenOutSupply: BigNumber;
  lpToken: IConfigLPToken | undefined;
  lpTokenSupply: BigNumber;
  isloading?: boolean;
}
export interface tokenParameterLiquidity {
  name: string;
  image: any;
  symbol: string;
}
