import clsx from "clsx";
import Image from "next/image";
import * as React from "react";

import { BigNumber } from "bignumber.js";
import { isMobile } from "react-device-detect";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { Tab } from "../Pools/ManageLiquidityHeader";
import IncreaseLiq from "./Increaseliq";
import { ActiveIncDecState, ActivePopUp } from "./ManageTabV3";
import DecreaseLiq from "./DecreaseLiq";

interface IIncreaseDecreaseLiqMainProps {
  setActiveStateIncDec: React.Dispatch<React.SetStateAction<ActiveIncDecState | string>>;
  activeStateIncDec: ActiveIncDecState | string;

  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;
  slippage: string;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  swapData: ISwapData;
  userBalances: {
    [key: string]: string;
  };
}

function IncreaseDecreaseLiqMain(props: IIncreaseDecreaseLiqMainProps) {
  const ListOfTabs = ["Increase liquidity", "Remove liquidity"];
  return (
    <>
      <div
        className={`flex row justify-between mt-3 gap-2 text-text-400 text-f16 bg-muted-500 rounded-xl `}
      >
        {ListOfTabs.map((tab, i) => (
          <Tab
            key={tab + i}
            isActive={props.activeStateIncDec === tab}
            text={tab}
            onClick={() => props.setActiveStateIncDec(tab)}
          />
        ))}
      </div>

      {props.activeStateIncDec === ActiveIncDecState.Increase ? (
        <IncreaseLiq
          setScreen={props.setScreen}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          tokenPrice={props.tokenPrice}
          pnlpEstimates={props.pnlpEstimates}
          sharePool={props.sharePool}
          slippage={props.slippage}
          userBalances={props.userBalances}
          swapData={props.swapData}
          setSecondTokenAmount={props.setSecondTokenAmount}
          setFirstTokenAmount={props.setFirstTokenAmount}
        />
      ) : (
        <DecreaseLiq
          setScreen={props.setScreen}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          tokenPrice={props.tokenPrice}
          pnlpEstimates={props.pnlpEstimates}
          sharePool={props.sharePool}
          slippage={props.slippage}
          userBalances={props.userBalances}
          swapData={props.swapData}
          setSecondTokenAmount={props.setSecondTokenAmount}
          setFirstTokenAmount={props.setFirstTokenAmount}
        />
      )}
    </>
  );
}

export default IncreaseDecreaseLiqMain;
