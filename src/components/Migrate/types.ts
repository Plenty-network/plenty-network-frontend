import { BigNumber } from "bignumber.js";
import { IVestAndClaim } from "../../api/migrate/types";
export interface IVestedPlyTopbarProps {
  isLoading: boolean;
  onClick: () => void;
  value: BigNumber;
  vestedData: IVestAndClaim;
  plentyBal: BigNumber;
  wrapBal: BigNumber;
}
