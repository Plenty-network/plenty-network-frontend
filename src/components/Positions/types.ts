import { BigNumber } from "bignumber.js";
import {
  IPositionStatsResponse,
  ITvlStatsResponse,
  IVotesStatsDataResponse,
} from "../../api/portfolio/types";
export interface IStatsProps {
  tokenPricePly: number;
  plyBalance: BigNumber;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  statsPositions: ITvlStatsResponse;
  stats1: IVotesStatsDataResponse;
}
export interface IStatsCardProps {
  toolTipMessage: string;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: BigNumber | string;
  subValue?: string | number;
  isLast?: boolean;
  plyBalance?: BigNumber;
  tokenPricePly?: number;
}
