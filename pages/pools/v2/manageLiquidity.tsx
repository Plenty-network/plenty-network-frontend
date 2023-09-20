import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../../src/redux";

import { SideBarHOC } from "../../../src/components/Sidebar/SideBarHOC";

import { ManageLiquidity } from "../../../src/components/Pools/ManageLiquidity";
import { useLocationStateInManageLiquidityV2 } from "../../../src/hooks/useLocationStateInManageLiquidityV2";
import { setActiveStatev2, setShowLiquidityModalV2 } from "../../../src/redux/pools/manageLiqV2";

export interface IIndexProps {}
export enum POOL_TYPE {
  VOLATILE = "VOLATILE",
  STABLE = "STABLE",
  MYPOOLS = "My pools",
}
export default function ManageLiquidtyPoolsV3(props: IIndexProps) {
  const dispatch = useDispatch<AppDispatch>();

  const activeState = useAppSelector((state) => state.ManageLiquidityV2.activeState);
  const isGaugeAvailable = useAppSelector((state) => state.ManageLiquidityV2.isGaugeAvailable);
  const setShowLiquidityModal = (val: boolean) => {
    dispatch(setShowLiquidityModalV2(val));
  };
  const { tokenX, setTokenX, tokenY, setTokenY, showLiquidityModal } =
    useLocationStateInManageLiquidityV2();

  const setActiveState = (val: string) => {
    dispatch(setActiveStatev2(val));
  };

  return (
    <SideBarHOC>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenX}
          tokenOut={tokenY}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          isGaugeAvailable={isGaugeAvailable}
          showLiquidityModal={showLiquidityModal}
          setShowLiquidityModalPopup={setShowLiquidityModalV2}
        />
      )}
    </SideBarHOC>
  );
}
