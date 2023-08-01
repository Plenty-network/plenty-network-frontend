import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import info from "../../../src/assets/icon/pools/InfoBlue.svg";
import close from "../../../src/assets/icon/pools/closeBlue.svg";
import Image from "next/image";
import clsx from "clsx";

import { isMobile } from "react-device-detect";
import { AppDispatch, useAppSelector } from "../../../src/redux";
import { tokenParameterLiquidity } from "../../../src/components/Liquidity/types";
import { ActiveLiquidity } from "../../../src/components/Pools/ManageLiquidityHeader";
import { ManageTabMobile } from "../../../src/components/v3/ManageTabMobile";
import { tokenChange, tokenChangeB } from "../../../src/api/util/helpers";
import { ManageTabV3 } from "../../../src/components/v3/ManageTabV3";
import { setShowLiquidityModalV3 } from "../../../src/redux/poolsv3/manageLiq";
import { SideBarHOC } from "../../../src/components/Sidebar/SideBarHOC";
import { useLocationStateInManageLiquidity } from "../../../src/hooks/useLocationStateInManageLiquidity";

export interface IIndexProps {}
export enum POOL_TYPE {
  MYPOOLS = "My pools",
}
export default function ManageLiquidtyPoolsV3(props: IIndexProps) {
  const dispatch = useDispatch<AppDispatch>();

  // const [feeTier, setFeeTier] = React.useState("");
  // const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>({
  //   name: "DAI.e",
  //   image: `/assets/tokens/DAI.e.png`,
  //   symbol: "DAI.e",
  // });
  // const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>({
  //   name: "USDC.e",
  //   image: `/assets/tokens/USDC.e.png`,
  //   symbol: "USDC.e",
  // });
  // const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
  //   ActiveLiquidity.Liquidity
  // );
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const showLiquidityModal = useAppSelector(
    (state) => state.ManageLiquidityV3.showLiquidityModalV3
  );
  // const tokenOut = useAppSelector((state) => state.ManageLiquidityV3.tokenY);
  // const tokenIn = useAppSelector((state) => state.ManageLiquidityV3.tokenX);
  const feeTier = useAppSelector((state) => state.ManageLiquidityV3.feeTier);
  const activeState = useAppSelector((state) => state.ManageLiquidityV3.activeState);
  const setShowLiquidityModal = (val: boolean) => {
    dispatch(setShowLiquidityModalV3(val));
  };
  const { tokenX, setTokenX, tokenY, setTokenY } = useLocationStateInManageLiquidity();
  return (
    <SideBarHOC>
      {showLiquidityModal && (
        <ManageTabV3
          tokenIn={tokenChange(topLevelSelectedToken, tokenX, tokenY)}
          tokenOut={tokenChangeB(topLevelSelectedToken, tokenX, tokenY)}
          tokenA={tokenX}
          tokenB={tokenY}
          closeFn={setShowLiquidityModal}
          activeState={activeState}
          isGaugeAvailable={false}
          showLiquidityModal={true}
          setShowLiquidityModalPopup={setShowLiquidityModal}
          feeTier={feeTier}
        />
      )}
    </SideBarHOC>
  );
}
