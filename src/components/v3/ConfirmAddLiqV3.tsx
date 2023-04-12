import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import { BigNumber } from "bignumber.js";
import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { useAppSelector } from "../../redux";
import Button from "../Button/Button";
import fallback from "../../../src/assets/icon/pools/fallback.png";
import { tokenIcons } from "../../constants/tokensList";
import { tokenParameterLiquidity } from "../Liquidity/types";
import clsx from "clsx";
import { useState } from "react";

interface IConfirmAddLiquidityProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number | BigNumber;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;
  slippage: string;
  handleAddLiquidityOperation: () => void;
}
function ConfirmAddLiquidityv3(props: IConfirmAddLiquidityProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const [selectedToken, setSelectedToken] = useState(props.tokenIn);
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm add liquidity </div>
        {/* <div className="relative cursor-pointer top-[2px]">
          <Image alt={"alt"} src={info} />
        </div> */}
      </div>
      <div className="mt-3 text-text-500 font-body4">
        Output is estimated. If the price changes by more than{" "}
        {props.slippage ? props.slippage : 0.5}% your transaction will revert
      </div>
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5">
        <div className="flex px-5">
          <div className="text-text-250 font-body4 ">You are depositing</div>{" "}
          <div className=" ml-auto">
            {true ? (
              <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
                <Image src={infoOrange} />
                Out of range
              </span>
            ) : (
              <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
                <Image src={infoGreen} />
                In Range
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <img
                alt={"alt"}
                src={
                  tokenIcons[props.tokenIn.symbol]
                    ? tokenIcons[props.tokenIn.symbol].src
                    : tokens[props.tokenIn.symbol.toString()]?.iconUrl
                    ? tokens[props.tokenIn.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {nFormatterWithLesserNumber(new BigNumber(props.firstTokenAmount))}{" "}
              {tEZorCTEZtoUppercase(props.tokenIn.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <img
                alt={"alt"}
                src={
                  tokenIcons[props.tokenOut.symbol]
                    ? tokenIcons[props.tokenOut.symbol].src
                    : tokens[props.tokenOut.symbol.toString()]?.iconUrl
                    ? tokens[props.tokenOut.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {nFormatterWithLesserNumber(new BigNumber(props.secondTokenAmount))}{" "}
              {tEZorCTEZtoUppercase(props.tokenOut.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.secondTokenAmount) * Number(props.tokenPrice[props.tokenOut.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>

        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className=" font-subtitle3  text-text-400">Fee tier</span>
          </div>
          <div className="ml-auto font-body4 text-white">0.3%</div>
        </div>

        <div className="flex  items-center   px-5 py-5">
          <div className="font-subtitle3  text-text-50">Selected range</div>
          <div className="ml-auto font-body2 flex cursor-pointer">
            <div
              className={clsx(
                selectedToken.symbol === props.tokenIn.symbol
                  ? "rounded-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(props.tokenIn)}
            >
              {props.tokenIn.symbol}
            </div>
            <div
              className={clsx(
                selectedToken.symbol === props.tokenOut.symbol
                  ? "rounded-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(props.tokenOut)}
            >
              {props.tokenOut.symbol}
            </div>
          </div>
        </div>

        <div className="sm:flex gap-4 mt-2 px-5">
          <div>
            <div className="flex text-text-250">
              <span className="font-caption1 pl-1">Min Price</span>
              <span className="font-mobile-f1020 ">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">820.63</div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">$23.38</div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Max Price</span>
              <span className="font-mobile-f1020">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">820.63</div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">$23.38</div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Current price</span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">820.63</div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">$23.38</div>
            </div>
          </div>
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

export default ConfirmAddLiquidityv3;
