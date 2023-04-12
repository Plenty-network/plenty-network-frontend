import * as React from "react";
import { useDispatch } from "react-redux";
import { tEZorCTEZtoUppercase, tokenChange, tokenChangeB } from "../../api/util/helpers";
import { dispatch } from "../../common/walletconnect";
import { AppDispatch, useAppSelector } from "../../redux";
import {
  setBleftbrush,
  setBleftRangeInput,
  setBrightbrush,
  setBRightRangeInput,
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
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const tokenoutorg = useAppSelector((state) => state.poolsv3.tokenOutOrg);
  const leftRangeInput = useAppSelector((state) => state.poolsv3.leftRangeInput);
  const rightRangeInput = useAppSelector((state) => state.poolsv3.RightRangeInput);
  const currentprice = useAppSelector((state) => state.poolsv3.currentPrice);
  const bcurrentprice = useAppSelector((state) => state.poolsv3.BcurrentPrice);
  const leftbrush = useAppSelector((state) => state.poolsv3.leftbrush);
  const rightbrush = useAppSelector((state) => state.poolsv3.rightbrush);
  const BleftRangeInput = useAppSelector((state) => state.poolsv3.BleftRangeInput);
  const BrightRangeInput = useAppSelector((state) => state.poolsv3.BRightRangeInput);
  const Bleftbrush = useAppSelector((state) => state.poolsv3.Bleftbrush);
  const Brightbrush = useAppSelector((state) => state.poolsv3.Brightbrush);

  const dispatch = useDispatch<AppDispatch>();

  const onLeftRangeInputFn = (value: string) => {
    if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? leftbrush !== Number(value)
        : Bleftbrush !== Number(value)
    ) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setleftbrush(value))
        : dispatch(setBleftbrush(value));
    }
    topLevelSelectedToken.symbol === tokeninorg.symbol
      ? dispatch(setleftRangeInput(value))
      : dispatch(setBleftRangeInput(value));
  };
  const onRightRangeInputFn = (value: string) => {
    if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? rightbrush !== Number(value)
        : Brightbrush !== Number(value)
    ) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setrightbrush(value))
        : dispatch(setBrightbrush(value));
    }
    topLevelSelectedToken.symbol === tokeninorg.symbol
      ? dispatch(setRightRangeInput(value))
      : dispatch(setBRightRangeInput(value));
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
          Current Price:{" "}
          {topLevelSelectedToken.symbol === tokeninorg.symbol ? currentprice : bcurrentprice}{" "}
          <span className="font-mobile-f9 ml-[4px]">
            ( {tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
            {tEZorCTEZtoUppercase(props.tokenOut.symbol)} )
          </span>
        </div>
        {currenyAA && currencyBB && (
          <LiquidityChartRangeInput
            currencyA={currenyAA ?? undefined}
            currencyB={currencyBB ?? undefined}
            feeAmount={500}
            ticksAtLimit={{ LOWER: false, UPPER: false }}
            price={
              topLevelSelectedToken.symbol === tokeninorg.symbol ? currentprice : bcurrentprice
            }
            priceLower={topLevelSelectedToken.symbol === tokeninorg.symbol ? leftbrush : Bleftbrush}
            priceUpper={
              topLevelSelectedToken.symbol === tokeninorg.symbol ? rightbrush : Brightbrush
            }
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
                onClick={() =>
                  onLeftRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(leftRangeInput) - 10).toString()
                      : (Number(BleftRangeInput) - 10).toString()
                  )
                }
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? leftRangeInput
                        : BleftRangeInput
                    }
                    placeholder="0.0"
                    onChange={(e) => onLeftRangeInputFn(e.target.value)}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className=" w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() =>
                  onLeftRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(leftRangeInput) + 10).toString()
                      : (Number(BleftRangeInput) + 10).toString()
                  )
                }
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
                onClick={() =>
                  onRightRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(rightRangeInput) - 10).toString()
                      : (Number(BrightRangeInput) - 10).toString()
                  )
                }
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? rightRangeInput
                        : BrightRangeInput
                    }
                    placeholder="0.0"
                    onChange={(e) => onRightRangeInputFn(e.target.value)}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() =>
                  onRightRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(rightRangeInput) + 10).toString()
                      : (Number(BrightRangeInput) + 10).toString()
                  )
                }
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
