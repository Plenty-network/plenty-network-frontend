import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../../src/redux";

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

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const feeTier = useAppSelector((state) => state.ManageLiquidityV3.feeTier);
  const activeState = useAppSelector((state) => state.ManageLiquidityV3.activeState);
  const setShowLiquidityModal = (val: boolean) => {
    dispatch(setShowLiquidityModalV3(val));
  };
  const { tokenX, setTokenX, tokenY, setTokenY, showLiquidityModal, feeBps, setFeeBps } =
    useLocationStateInManageLiquidity();

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
          feeTier={feeBps}
        />
      )}
    </SideBarHOC>
  );
}
