import { BigNumber } from "bignumber.js";
export interface IVestedPlyTopbarProps {
  isLoading: boolean;
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
  value: BigNumber;
}
