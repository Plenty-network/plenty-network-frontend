import clsx from "clsx";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { tokenParameterLiquidity } from "./types";

interface IConfirmAddLiquidityProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;
  handleAddLiquidityOperation: () => void;
}
function ConfirmAddLiquidity(props: IConfirmAddLiquidityProps) {
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm add liquidity </div>
        <div className="relative cursor-pointer top-[2px]">
          <Image src={info} />
        </div>
      </div>
      <div className="mt-5 text-text-500 font-body4">
        Output is estimated. If the price changes by more than 0.5% your transaction will revert
      </div>
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5">
        <p className="text-text-250 font-body4 px-5">Your depositing</p>
        <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <Image src={props.tokenIn.image} width={"24px"} height={"24px"} />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {props.firstTokenAmount}{" "}
              {props.tokenIn.name === "tez"
                ? "TEZ"
                : props.tokenIn.name === "ctez"
                ? "CTEZ"
                : props.tokenIn.name}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name])
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <Image src={props.tokenOut.image} width={"24px"} height={"24px"} />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {props.secondTokenAmount}{" "}
              {props.tokenOut.name === "tez"
                ? "TEZ"
                : props.tokenOut.name === "ctez"
                ? "CTEZ"
                : props.tokenOut.name}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.secondTokenAmount) * Number(props.tokenPrice[props.tokenOut.name])
            ).toFixed(2)}
          </div>
        </div>
        <div className="mt-4 px-5 text-text-250 font-body4 ">You will receive (atleast)</div>
        <div className="mt-1 px-5 text-white font-title2 ">{props.pnlpEstimates} PNLP</div>
        <div className="mt-5 border-t border-text-800/[0.5]"></div>
        <div className="px-5 mt-[18px] flex justify-between">
          <p className="text-text-250 font-body2">Share of pool</p>
          <p className="font-body4 text-white">{Number(props.sharePool).toFixed(6)} % </p>
        </div>
      </div>
      <div className="mt-5">
        <Button color={"primary"} onClick={props.handleAddLiquidityOperation}>
          Confirm deposit
        </Button>
      </div>
    </>
  );
}

export default ConfirmAddLiquidity;
