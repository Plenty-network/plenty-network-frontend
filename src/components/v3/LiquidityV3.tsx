import Image from "next/image";
import * as React from "react";
import infoOrangeBig from "../../../src/assets/icon/poolsv3/InfoOrangeBig.svg";
import { useAppSelector } from "../../redux";
import { tokenParameterLiquidity } from "../Liquidity/types";
import AddLiquidityV3 from "./AddliquidityV3";
import FeeTierMain from "./FeeTierMain";
import { isMobile, isTablet } from "react-device-detect";
import { ActivePopUp } from "./ManageTabV3";

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

  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  setIsAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  isAddLiquidity: boolean;

  setSelectedFeeTier: React.Dispatch<React.SetStateAction<string>>;
  selectedFeeTier: string;
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
  slippage: number;

  feeTier: string;
}
function LiquidityV3(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  return (
    <>
      <div className="w-auto lg:w-[546px] mx-auto rounded-2xl border-text-800  md:px-3.5  pb-4  ">
        <div className="hidden lg:block">
          <FeeTierMain
            setSelectedFeeTier={props.setSelectedFeeTier}
            selectedFeeTier={props.selectedFeeTier}
            feeTier={props.feeTier}
          />
        </div>

        <AddLiquidityV3
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount}
          userBalances={props.userBalances}
          setSecondTokenAmount={props.setSecondTokenAmount}
          setFirstTokenAmount={props.setFirstTokenAmount}
          tokenPrice={tokenPrice}
          selectedFeeTier={Number(props.selectedFeeTier)}
        />
        {props.feeTier != props.selectedFeeTier && (
          <div className="fade-in-warning h-[56px] mt-[16px] flex items-center  px-2 bg-error-300/[0.1]  rounded-lg 	">
            <Image src={infoOrangeBig} />
            <span className="ml-3 text-error-300 text-[13px] leading-[20px] ">
              {`Your have changed the fee tier. You new positions will be created for ${props.selectedFeeTier}%.`}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default LiquidityV3;
