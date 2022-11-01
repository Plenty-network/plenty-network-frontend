import { BigNumber } from "bignumber.js";
import { IVestAndClaim } from "../../api/migrate/types";
export interface IVestedPlyTopbarProps {
  isLoading: boolean;
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
  value: BigNumber;
  vestedData: IVestAndClaim;
}
