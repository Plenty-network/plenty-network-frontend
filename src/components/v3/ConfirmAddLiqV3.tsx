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
import { AppDispatch, useAppSelector } from "../../redux";
import Button from "../Button/Button";
import fallback from "../../../src/assets/icon/pools/fallback.png";
import { tokenIcons } from "../../constants/tokensList";
import { tokenParameterLiquidity } from "../Liquidity/types";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { ActivePopUp } from "./ManageTabV3";
import { getTickFromRealPrice } from "../../api/v3/helper";
import { useDispatch } from "react-redux";
import { setmaxTickA, setmaxTickB, setminTickA, setminTickB } from "../../redux/poolsv3";
import { Tick } from "@plenty-labs/v3-sdk";

interface IConfirmAddLiquidityProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;

  firstTokenAmount: string | number | BigNumber;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  tokenPrice: {
    [id: string]: number;
  };

  slippage: number;
  handleAddLiquidityOperation: () => void;
  topLevelSelectedToken: tokenParameterLiquidity;
}
function ConfirmAddLiquidityv3(props: IConfirmAddLiquidityProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const leftRangeInput = useAppSelector((state) => state.poolsv3.leftRangeInput);
  const rightRangeInput = useAppSelector((state) => state.poolsv3.RightRangeInput);
  const currentprice = useAppSelector((state) => state.poolsv3.currentPrice);
  const bcurrentprice = useAppSelector((state) => state.poolsv3.BcurrentPrice);

  const BleftRangeInput = useAppSelector((state) => state.poolsv3.BleftRangeInput);
  const BrightRangeInput = useAppSelector((state) => state.poolsv3.BRightRangeInput);

  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const tokenoutorg = useAppSelector((state) => state.poolsv3.tokenOutOrg);

  const [selectedToken, setSelectedToken] = useState(tokeninorg);
  const [minA, setMinA] = useState("0");
  const [maxA, setMaxA] = useState("0");
  const [minB, setMinB] = useState("0");
  const [maxB, setMaxB] = useState("0");

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (props.topLevelSelectedToken.symbol === props.tokenIn.symbol) {
      setMinA(leftRangeInput.toString());
      setMinB((1 / Number(leftRangeInput)).toFixed(6));
      setMaxA(rightRangeInput.toString());
      setMaxB((1 / Number(rightRangeInput)).toFixed(6));

      // getTickFromRealPrice(
      //   new BigNumber(1).dividedBy(new BigNumber(leftRangeInput)),
      //   props.tokenIn.symbol,
      //   props.tokenOut.symbol
      // ).then((response1) => {
      //   dispatch(setminTickB(Tick.nearestUsableTick(response1, 10)));
      // });
      // getTickFromRealPrice(
      //   new BigNumber(1).dividedBy(new BigNumber(rightRangeInput)),
      //   props.tokenIn.symbol,
      //   props.tokenOut.symbol
      // ).then((response1) => {
      //   dispatch(setmaxTickB(Tick.nearestUsableTick(response1, 10)));
      // });
    } else {
      setMinA((1 / Number(BleftRangeInput)).toFixed(6));
      setMinB(BleftRangeInput.toString());
      setMaxA((1 / Number(BrightRangeInput)).toFixed(6));
      setMaxB(BrightRangeInput.toString());

      // getTickFromRealPrice(
      //   new BigNumber(1).dividedBy(new BigNumber(BleftRangeInput)),
      //   props.tokenIn.symbol,
      //   props.tokenOut.symbol
      // ).then((response1) => {
      //   dispatch(setminTickA(Tick.nearestUsableTick(response1, 10)));
      // });
      // getTickFromRealPrice(
      //   new BigNumber(1).dividedBy(new BigNumber(BrightRangeInput)),
      //   props.tokenIn.symbol,
      //   props.tokenOut.symbol
      // ).then((response1) => {
      //   dispatch(setmaxTickA(Tick.nearestUsableTick(response1, 10)));
      // });
    }
  }, []);

  return (
    <>
      <div className="flex">
        <div
          className="cursor-pointer  relative "
          onClick={() => props.setScreen(ActivePopUp.NewPosition)}
        >
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm add liquidity </div>
        {/* <div className="relative cursor-pointer top-[2px]">
          <Image alt={"alt"} src={info} />
        </div> */}
      </div>
      {/* <div className="mt-3 text-text-500 font-body4">
        Output is estimated. If the price changes by more than{" "}
        {props.slippage ? props.slippage : 0.5}% your transaction will revert
      </div> */}
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5">
        <div className="flex px-5">
          <div className="text-text-250 font-body4 ">You are depositing</div>{" "}
          <div className=" ml-auto">
            {false ? (
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
            <span className="">
              <img
                alt={"alt"}
                src={
                  tokenIcons[tokeninorg.symbol]
                    ? tokenIcons[tokeninorg.symbol].src
                    : tokens[tokeninorg.symbol.toString()]?.iconUrl
                    ? tokens[tokeninorg.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {nFormatterWithLesserNumber(new BigNumber(props.firstTokenAmount))}{" "}
              {tEZorCTEZtoUppercase(tokeninorg.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.firstTokenAmount) * Number(props.tokenPrice[tokeninorg.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="">
              <img
                alt={"alt"}
                src={
                  tokenIcons[tokenoutorg.symbol]
                    ? tokenIcons[tokenoutorg.symbol].src
                    : tokens[tokenoutorg.symbol.toString()]?.iconUrl
                    ? tokens[tokenoutorg.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {nFormatterWithLesserNumber(new BigNumber(props.secondTokenAmount))}{" "}
              {tEZorCTEZtoUppercase(tokenoutorg.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.secondTokenAmount) * Number(props.tokenPrice[tokenoutorg.name] ?? 0)
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
                selectedToken.symbol === tokeninorg.symbol
                  ? "rounded-l-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400 bg-background-600 rounded-l-xl",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(tokeninorg)}
            >
              {tokeninorg.symbol}
            </div>
            <div
              className={clsx(
                selectedToken.symbol === tokenoutorg.symbol
                  ? "rounded-r-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400 bg-background-600 rounded-r-xl",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(tokenoutorg)}
            >
              {tokenoutorg.symbol}
            </div>
          </div>
        </div>

        <div className="sm:flex gap-4 mt-2 px-5">
          <div>
            <div className="flex text-text-250">
              <span className="font-caption1 pl-1">Min Price</span>
              <span className="font-mobile-f1020 ">
                (
                {selectedToken.symbol === tokeninorg.symbol
                  ? tEZorCTEZtoUppercase(tokenoutorg.symbol)
                  : tEZorCTEZtoUppercase(tokeninorg.symbol)}{" "}
                per{" "}
                {selectedToken.symbol === tokeninorg.symbol
                  ? tEZorCTEZtoUppercase(tokeninorg.symbol)
                  : tEZorCTEZtoUppercase(tokenoutorg.symbol)}
                )
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">
                {selectedToken.symbol === tokeninorg.symbol
                  ? minA > maxA
                    ? maxA
                    : minA
                  : minB > maxB
                  ? maxB
                  : minB}
              </div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">
                $
                {selectedToken.symbol === tokeninorg.symbol
                  ? minA > maxA
                    ? (Number(tokenPrice[props.tokenIn.name]) * Number(maxA)).toFixed(2)
                    : (Number(tokenPrice[props.tokenIn.name]) * Number(minA)).toFixed(2)
                  : minB > maxB
                  ? (Number(tokenPrice[props.tokenIn.name]) * Number(maxB)).toFixed(2)
                  : (Number(tokenPrice[props.tokenIn.name]) * Number(minB)).toFixed(2)}
              </div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Max Price</span>
              <span className="font-mobile-f1020">
                (
                {selectedToken.symbol === tokeninorg.symbol
                  ? tEZorCTEZtoUppercase(tokenoutorg.symbol)
                  : tEZorCTEZtoUppercase(tokeninorg.symbol)}{" "}
                per{" "}
                {selectedToken.symbol === tokeninorg.symbol
                  ? tEZorCTEZtoUppercase(tokeninorg.symbol)
                  : tEZorCTEZtoUppercase(tokenoutorg.symbol)}
                )
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">
                {selectedToken.symbol === tokeninorg.symbol
                  ? maxA < minA
                    ? minA
                    : maxA
                  : maxB < minB
                  ? minB
                  : maxB}
              </div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">
                $
                {selectedToken.symbol === tokeninorg.symbol
                  ? maxA < minA
                    ? (Number(tokenPrice[props.tokenIn.name]) * Number(minA)).toFixed(2)
                    : (Number(tokenPrice[props.tokenIn.name]) * Number(maxA)).toFixed(2)
                  : maxB < minB
                  ? (Number(tokenPrice[props.tokenIn.name]) * Number(minB)).toFixed(2)
                  : (Number(tokenPrice[props.tokenIn.name]) * Number(maxB)).toFixed(2)}
              </div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Current price</span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">
                {selectedToken.symbol === tokeninorg.symbol
                  ? Number(currentprice)?.toFixed(6)
                  : Number(bcurrentprice)?.toFixed(6)}
              </div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">
                $
                {selectedToken.symbol === tokeninorg.symbol
                  ? (Number(tokenPrice[props.tokenIn.name]) * Number(currentprice)).toFixed(2)
                  : (Number(tokenPrice[props.tokenIn.name]) * Number(bcurrentprice)).toFixed(2)}
              </div>
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
