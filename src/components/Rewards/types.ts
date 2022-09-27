import { BigNumber } from "bignumber.js";
export interface IStatsProps {}
export interface IStatsCardProps {
  setShowCreateLockModal?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: string;
  subValue?: string;
  isLast?: boolean;
  disable: boolean;
  setShowClaimAllPly: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IStatsRewardsProps {
  setShowClaimAllPly: React.Dispatch<React.SetStateAction<boolean>>;
  plyEmission: BigNumber;
}
