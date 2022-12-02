import { IConfigToken } from "../config/types";

export interface tokenParameter {
  name: string;
  image: any;
}

export type tokenType = "tokenIn" | "tokenOut";

export interface tokensModal {
  name: string;
  image: any;
  new: boolean;
  chainType?: string;
  address?: string;
}
export interface tokensModalNewPool {
  name: string;
  interface: IConfigToken;
  image: any;
  new: boolean;
  chainType?: string;
  address?: string;
  extra?: { text: string; link: string } | undefined;
}

export const ERRORMESSAGES = {
  INSUFFICIENT_LIQUIDITY: "Insufficient Liquidity for this trade",
  TRANSACTIONSETTINGSWARNING: "Your transaction may be frontrun",
  TRANSACTIONSETTINGSERROR: "Enter a valid slippage percentage",
  SWAPROUTER:
    "The exchange route doesn't exist for the selected tokens. Please try with other tokens.",
  SWAPMULTIHOP:
    "Direct swap for this pair doesn't exist. Enable multihop in the settings, if you want to swap through a route.",
};
