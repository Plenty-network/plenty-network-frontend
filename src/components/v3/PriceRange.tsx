import { Currency, Token, Price } from "@uniswap/sdk-core";

import fromExponential from "from-exponential";
import Image from "next/image";
import * as React from "react";
import { useDispatch } from "react-redux";
import { tEZorCTEZtoUppercase, tokenChange, tokenChangeB } from "../../api/util/helpers";
import { dispatch } from "../../common/walletconnect";
import { AppDispatch, useAppSelector } from "../../redux";
import {
  setcurrentPrice,
  setleftbrush,
  setleftRangeInput,
  setrightbrush,
  setRightRangeInput,
} from "../../redux/poolsv3";

import { tokenParameterLiquidity } from "../Liquidity/types";
import LiquidityChartRangeInput from "./LiquidityChartRangeInput";

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
}

export interface SerializedPair {
  token0: SerializedToken;
  token1: SerializedToken;
}

interface IPriceRangeProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
}
export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}
function PriceRangeV3(props: IPriceRangeProps) {
  const currenyAA = props.tokenIn;

  const currencyBB = props.tokenOut;

  const [isFullRange, setFullRange] = React.useState(false);

  const leftRangeInput = useAppSelector((state) => state.poolsv3.leftRangeInput);
  const rightRangeInput = useAppSelector((state) => state.poolsv3.RightRangeInput);
  const leftbrush = useAppSelector((state) => state.poolsv3.leftbrush);
  const rightbrush = useAppSelector((state) => state.poolsv3.rightbrush);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const dispatch = useDispatch<AppDispatch>();

  const onLeftRangeInputFn = (value: string) => {
    if (Number(value) !== leftbrush) {
      dispatch(setleftbrush(value));
    }
    dispatch(setleftRangeInput(value));
  };
  const onRightRangeInputFn = (value: string) => {
    if (Number(value) !== rightbrush) {
      dispatch(setrightbrush(value));
    }
    dispatch(setRightRangeInput(value));
  };
  return (
    <div>
      <div className=" w-[362px]   px-[10px]  pt-2 pb-6  mb-5 h-[254px]">
        <div className="flex justify-between">
          <div className="font-body4 ">Set Price Range</div>
          {/* <div className="flex gap-1">
            <Image src={zoomin} />
            <Image src={zoomout} />
          </div> */}
        </div>
        <div className="mt-[19.5px] text-center font-mobile-f1020">
          Current Price: 87{" "}
          <span className="font-mobile-f9 ml-[6px]">
            ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
            {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
          </span>
        </div>
        {currenyAA && currencyBB && (
          <LiquidityChartRangeInput
            currencyA={currenyAA ?? undefined}
            currencyB={currencyBB ?? undefined}
            feeAmount={500}
            ticksAtLimit={{ LOWER: false, UPPER: false }}
            price={87}
            priceLower={85}
            priceUpper={90}
            onLeftRangeInput={onLeftRangeInputFn}
            onRightRangeInput={onRightRangeInputFn}
            interactive={true}
          />
        )}
      </div>
      {isFullRange ? (
        <div className="h-[78px] mt-[10px] flex items-center justify-center w-[362px] px-[20px] bg-error-300/[0.1]  rounded-lg	">
          <span className=" text-error-300 text-[13px] leading-[20px] ">
            Full range liquidity is highly capital inefficient. Please proceed with caution.
          </span>
        </div>
      ) : (
        <div className="flex gap-[14px] justify-between	mt-[16px]">
          <div>
            <div className="font-body4 text-text-250">
              Min Price{" "}
              <span className="font-caption1-small">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => onLeftRangeInputFn((Number(leftRangeInput) - 1).toString())}
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={leftRangeInput}
                    placeholder="0.0"
                    onChange={(e) => onLeftRangeInputFn(e.target.value)}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className=" w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => onLeftRangeInputFn((Number(leftRangeInput) + 1).toString())}
              >
                +
              </div>
            </div>
          </div>
          <div>
            <div className="font-body4 text-text-250">
              Max Price{" "}
              <span className="font-caption1-small">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center cursor-pointer justify-center"
                onClick={() => onRightRangeInputFn((Number(rightRangeInput) - 1).toString())}
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={rightRangeInput}
                    placeholder="0.0"
                    onChange={(e) => onRightRangeInputFn(e.target.value)}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => onRightRangeInputFn((Number(rightRangeInput) + 1).toString())}
              >
                +
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="mt-3 cursor-pointer border border-info-700 rounded-lg	text-center py-2.5 font-body1"
        onClick={() => setFullRange(!isFullRange)}
      >
        Full Range
      </div>
      {/* <div className="mt-3 border border-text-800/[0.5] bg-cardBackGround rounded-lg	text-center py-4 font-body1 text-primary-500 h-[52px]">
        View all positions
      </div> */}
    </div>
  );
}

export default PriceRangeV3;
