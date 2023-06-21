import { IPositionsData } from "../../api/portfolio/types";

import { BigNumber } from "bignumber.js";
import { IV3PositionObject } from "../../api/v3/types";
export interface IPoolsTablePosition {
  isfetched: boolean;
  poolsPosition: IV3PositionObject[] | undefined;
  handleCollectFeeOperation: () => void;
  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  tokenA: string;
  tokenB: string;
  data: IV3PositionObject;
}
export interface IBoostProps {}
export interface IYourLiquidityProps {
  value: BigNumber;
  liquidity: any;
  tokenA: string;
  tokenB: string;
}
export interface IYourStakeProps {
  value: BigNumber;
}
