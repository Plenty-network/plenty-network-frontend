import { IPositionsData } from "../../api/portfolio/types";

import { BigNumber } from "bignumber.js";
import { IV3PositionObject } from "../../api/v3/types";
import { tokenParameterLiquidity } from "../Liquidity/types";
export interface IPoolsTablePosition {
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  setFeeTier: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;

  setTokenIn: React.Dispatch<React.SetStateAction<tokenParameterLiquidity>>;
  setTokenOut: React.Dispatch<React.SetStateAction<tokenParameterLiquidity>>;
  isfetched: boolean;
  poolsPosition: IV3PositionObject[] | undefined;
  handleCollectFeeOperation: () => void;
  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IManageBtnProps {
  setTokenIn: React.Dispatch<React.SetStateAction<tokenParameterLiquidity>>;
  setTokenOut: React.Dispatch<React.SetStateAction<tokenParameterLiquidity>>;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;

  setShowLiquidityModal: (val: boolean) => void;
  setFeeTier: React.Dispatch<React.SetStateAction<string>>;
  feeTier: any;
  tokenA: string;
  tokenB: string;
  data: IV3PositionObject;
}
export interface IYourLiquidityProps {
  value: BigNumber;
  liquidity: any;
  tokenA: string;
  tokenB: string;
}
export interface IYourStakeProps {
  value: BigNumber;
}
