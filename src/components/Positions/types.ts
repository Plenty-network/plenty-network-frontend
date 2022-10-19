import { BigNumber } from "bignumber.js";
import {
  IPositionStatsResponse,
  ITvlStatsResponse,
  IVotesStatsDataResponse,
} from "../../api/portfolio/types";
export interface IStatsProps {
  statsPositions: {
    success: boolean;
    tvl: BigNumber;
    isFetching: boolean;
  };
  tokenPricePly: number;
  plyBalance: BigNumber;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  stats1: {
    success: boolean;
    totalEpochVotingPower: BigNumber;
    totalPlyLocked: BigNumber;
    isFetching: boolean;
  };
}
export interface IStatsCardProps {
  isLoading?: boolean;
  toolTipMessage: string;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: BigNumber | string;
  subValue?: string | number;
  isLast?: boolean;
  plyBalance?: BigNumber;
  tokenPricePly?: number;
}
