import { BigNumber } from "bignumber.js";
export interface IStatsProps {
  tokenPricePly: number;
  plyBalance: BigNumber;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IStatsCardProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: BigNumber | string;
  subValue?: string | number;
  isLast?: boolean;
  plyBalance?: BigNumber;
  tokenPricePly?: number;
}
