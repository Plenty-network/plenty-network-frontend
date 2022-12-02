import { BigNumber } from "bignumber.js";

// export enum MigrateToken {
//   PLENTY,
//   WRAP,
// }

export interface IMigrateExchange {
  success: boolean;
  claimableAmount: BigNumber;
  vestedAmount: BigNumber;
  exchangeRate: BigNumber;
}

export interface IVestAndClaim {
  success: boolean;
  isClaimable: boolean;
  claimableAmount: BigNumber;
  vestedAmount: BigNumber;
  lastClaim: BigNumber;
  nextClaim: BigNumber;
}

export interface IveResponse{
  balance : BigNumber;
  last_claim : number;
  release_rate : BigNumber;
  vested : BigNumber;
}
