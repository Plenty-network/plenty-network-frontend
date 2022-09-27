import { BigNumber } from "bignumber.js";
export interface IStatsProps {}
export interface IStatsCardProps {
  setShowCreateLockModal?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: string;
  subValue?: string;
  isLast?: boolean;
  disable: boolean;
  isDollar?: boolean;
  setShowClaimAllPly: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IStatsRewardsProps {
  tradingfeeStats: BigNumber;
  bribesStats: BigNumber;

  setShowClaimAllPly: React.Dispatch<React.SetStateAction<boolean>>;
  plyEmission: BigNumber;
}
