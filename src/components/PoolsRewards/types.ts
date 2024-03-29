import { IPoolsRewardsData } from "../../api/portfolio/types";
import { BigNumber } from "bignumber.js";
export interface IPoolsTableRewards {
  isfetched: boolean;
  poolsData: IPoolsRewardsData[];
  className?: string;
  isConnectWalletRequired?: boolean;
}

export interface IPLYEmissionProps {
  dollar: BigNumber;
  value: BigNumber;
}
export interface IBoostProps {
  value: BigNumber;
}
