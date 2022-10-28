import { BigNumber } from "bignumber.js";

export enum MigrateToken {
    PLENTY = 0 ,
    WRAP = 1
}

export interface IMigrateExchange {
    success : boolean;
     claimableAmount : BigNumber;
      vestedAmount : BigNumber;
       exchangeRate : BigNumber;
}

export interface IVestAndClaim {
    success : boolean;
    isClaimable : boolean;
    claimableAmount : BigNumber;
    vestedAmount : BigNumber;
    lastClaim : BigNumber;
    nextClaim : BigNumber;
}
