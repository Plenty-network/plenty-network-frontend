import { IPoolsRewardsData } from "../../api/portfolio/types";
import { IVotePageData } from "../../api/votes/types";
import { BigNumber } from "bignumber.js";
export interface IPoolsTableRewards {
  isfetched: boolean;
  poolsData: IPoolsRewardsData[];
  className?: string;
  isConnectWalletRequired?: boolean;
}

export interface IPLYEmissionProps {
  value: BigNumber;
}
