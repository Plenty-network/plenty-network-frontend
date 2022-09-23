import { BigNumber } from "bignumber.js";
export interface IStatsProps {}
export interface IStatsCardProps {
  setShowCreateLockModal?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: string;
  subValue?: string;
  isLast?: boolean;
}
export interface IStatsRewardsProps {
  plyEmission: BigNumber;
}
