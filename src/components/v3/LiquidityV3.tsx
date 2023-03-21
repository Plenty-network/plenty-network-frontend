import Image from "next/image";
import * as React from "react";
import settings from "../../../src/assets/icon/swap/settings.svg";
import { useMemo, useRef, useState } from "react";
import TransactionSettingsLiquidity from "../TransactionSettings/TransactionSettingsLiq";

import infoblue from "../../../src/assets/icon/pools/InfoBlue.svg";
import info from "../../../src/assets/icon/swap/info.svg";
import { BigNumber } from "bignumber.js";
import Button from "../Button/Button";
import { SwitchWithIcon } from "../SwitchCheckbox/switchWithIcon";

import wallet from "../../../src/assets/icon/pools/wallet.svg";
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

interface ILiquidityProps {
  userBalances: {
    [key: string]: string;
  };
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  inputRef?: any;
  value?: string | "";
  onChange?: any;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;

  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setIsAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  isAddLiquidity: boolean;
  swapData: ISwapData;
  pnlpBalance: string;

  setSlippage: React.Dispatch<React.SetStateAction<string>>;
  slippage: string;
  lpTokenPrice: BigNumber;

  isLoading: boolean;
}
function LiquidityV3(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);

  const handleAddLiquidity = () => {
    props.setScreen("2");
  };
  const handleRemoveLiquidity = () => {
    props.setScreen("3");
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const AddButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(props.firstTokenAmount) <= 0 || Number(props.secondTokenAmount) <= 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Add
        </Button>
      );
    } else if (
      walletAddress &&
      ((props.firstTokenAmount &&
        props.firstTokenAmount > Number(props.userBalances[props.tokenIn.name])) ||
        (props.secondTokenAmount && props.secondTokenAmount) >
          Number(props.userBalances[props.tokenOut.name]))
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button color={"primary"} onClick={handleAddLiquidity}>
          Add
        </Button>
      );
    }
  }, [props]);

  return (
    <>
      <div className="border w-[546px] rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-3 pb-3  ">
        <div className="flex items-center justify-between flex-row  relative">
          <div>
            {/* <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                id="Addliquidity"
                isChecked={!props.isAddLiquidity}
                onChange={() => props.setIsAddLiquidity(!props.isAddLiquidity)}
              />
            </span> */}
            <span className="ml-2 text-white font-title3 ">Add Liquidity</span>
          </div>
          <div
            ref={refSettingTab}
            className="py-1 ml-auto px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] ml-2"
            onClick={() => setSettingsShow(!settingsShow)}
          >
            <Image alt={"alt"} src={settings} height={"20px"} width={"20px"} />
            <span className="text-white font-body4 ml-2 relative -top-[3px]">
              {props.slippage ? Number(props.slippage) : 0.5}%
            </span>
          </div>
          <TransactionSettingsLiquidity
            show={settingsShow}
            setSlippage={props.setSlippage}
            slippage={props.slippage}
            setSettingsShow={setSettingsShow}
          />
        </div>
        {
          <AddLiquidityV3
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            firstTokenAmount={props.firstTokenAmount}
            secondTokenAmount={props.secondTokenAmount}
            userBalances={props.userBalances}
            setSecondTokenAmount={props.setSecondTokenAmount}
            setFirstTokenAmount={props.setFirstTokenAmount}
            swapData={props.swapData}
            tokenPrice={tokenPrice}
          />
        }
      </div>
      <FeeTierMain />
      <div className="">{AddButton}</div>
    </>
  );
}

export default LiquidityV3;
