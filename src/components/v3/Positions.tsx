import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";
import TransactionSettingsLiquidity from "../TransactionSettings/TransactionSettingsLiq";

import { BigNumber } from "bignumber.js";
import Button from "../Button/Button";
import { SwitchWithIcon } from "../SwitchCheckbox/switchWithIcon";

import { AppDispatch, useAppSelector } from "../../redux";

import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { getDexType } from "../../api/util/fetchConfig";
import { PoolType } from "../../config/types";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import AddLiquidity from "../Liquidity/AddLiquidity";
import AddLiquidityV3 from "./AddliquidityV3";
import FeeTierMain from "./FeeTierMain";
import { CircularImageInfo } from "../Pools/Component/CircularImageInfo";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import PositionsTable from "./PositionsTable";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}
function PositionsPopup(props: IPositionsProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);

  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const ButtonComp = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button height="52px" onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (false) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          New position
        </Button>
      );
    } else if (true) {
      return (
        <Button height="52px" onClick={() => props.setScreen("1")} color={"primary"}>
          New position
        </Button>
      );
    }
  }, [props]);

  return (
    <>
      <div className=" mt-4 rounded-2xl flex flex-col justify-between items-center h-[64px] px-[25px] py-1.5 border-text-800  border-2 bg-secondary-400 ">
        {
          <>
            <div className="flex w-full justify-between">
              <div className="flex gap-1 md:gap-2 items-center pl-2 md:pl-4">
                <CircularImageInfo imageArray={[props.tokenIn.image, props.tokenOut.image]} />
                <span className="font-body2 md:text-f14 text-white ">
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)} /
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                </span>
              </div>
              <div className="font-title3 text-white rounded-lg text-center	 bg-info-800 flex items-center justify-center w-[83px] h-[44px] ml-1">
                0.05%
              </div>
            </div>
          </>
        }
      </div>
      <PositionsTable />
      <div className="mt-2">{ButtonComp}</div>
    </>
  );
}

export default PositionsPopup;
