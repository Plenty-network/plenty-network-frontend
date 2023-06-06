import { IPositionsData } from "../../api/portfolio/types";

import { BigNumber } from "bignumber.js";
export interface IPoolsTablePosition {
  isfetched: boolean;
  poolsPosition: IPositionsData[];

  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  tokenA: string;
  tokenB: string;
}
export interface IBoostProps {}
export interface IYourLiquidityProps {
  value: BigNumber;
}
