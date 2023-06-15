import { Tick } from "@plenty-labs/v3-sdk";
import clsx from "clsx";
import { BigNumber } from "bignumber.js";
import * as React from "react";
import { useDispatch } from "react-redux";
import { tEZorCTEZtoUppercase, tokenChange, tokenChangeB } from "../../api/util/helpers";
import {
  ContractStorage,
  getRealPriceFromTick,
  getTickAndRealPriceFromPool,
  getTickFromRealPrice,
} from "../../api/v3/helper";
import {
  calculateCurrentPrice,
  calculateFullRange,
  getInitialBoundaries,
} from "../../api/v3/liquidity";
import { dispatch } from "../../common/walletconnect";
import { AppDispatch, useAppSelector } from "../../redux";
import {
  setBcurrentPrice,
  setBleftbrush,
  setBleftRangeInput,
  setBrightbrush,
  setBRightRangeInput,
  setcurrentPrice,
  setInitBound,
  setIsLoading,
  setleftbrush,
  setleftRangeInput,
  setmaxTickA,
  setmaxTickB,
  setminTickA,
  setminTickB,
  setrightbrush,
  setRightRangeInput,
} from "../../redux/poolsv3";

import { tokenParameterLiquidity } from "../Liquidity/types";
import LiquidityChartRangeInput from "./LiquidityChartRangeInput";
import { calcrealPrice, calcTick } from "../../utils/outSideClickHook";
// 1 -> 0.0001

// 10 -> 0.001

// 60 -> 0.006

// 200 -> 0.02
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
  isClearAll: boolean;
  selectedFeeTier: string;
}
export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

function PriceRangeV3(props: IPriceRangeProps) {
  const currenyAA = props.tokenIn;

  const currencyBB = props.tokenOut;
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
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
  const full = useAppSelector((state) => state.poolsv3.isFullRange);
  React.useEffect(() => {
    props.isClearAll && setFullRange(false);
  }, [props.isClearAll]);
  React.useEffect(() => {
    if (!isFullRange) {
      dispatch(setIsLoading(true));
      calculateCurrentPrice(tokeninorg.symbol, tokenoutorg.symbol, tokeninorg.symbol).then(
        (response) => {
          dispatch(setcurrentPrice(response.toFixed(6)));
        }
      );
      calculateCurrentPrice(tokeninorg.symbol, tokenoutorg.symbol, tokenoutorg.symbol).then(
        (response) => {
          dispatch(setBcurrentPrice(response.toFixed(6)));
        }
      );
      dispatch(setIsLoading(true));
      getInitialBoundaries(tokeninorg.symbol, tokenoutorg.symbol).then((response) => {
        dispatch(setInitBound(response));
        if (
          new BigNumber(1)
            .dividedBy(response.minValue)
            .isGreaterThan(new BigNumber(1).dividedBy(response.maxValue))
        ) {
          dispatch(setleftRangeInput(response.minValue.toFixed(6)));

          dispatch(setBleftRangeInput(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setRightRangeInput(response.maxValue.toFixed(6)));

          dispatch(setBRightRangeInput(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setleftbrush(response.minValue.toFixed(6)));

          dispatch(setBleftbrush(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setrightbrush(response.maxValue.toFixed(6)));

          dispatch(setBrightbrush(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setIsLoading(false));
        } else {
          dispatch(setleftRangeInput(response.minValue.toFixed(6)));

          dispatch(setBleftRangeInput(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setRightRangeInput(response.maxValue.toFixed(6)));

          dispatch(setBRightRangeInput(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setleftbrush(response.minValue.toFixed(6)));

          dispatch(setBleftbrush(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setrightbrush(response.maxValue.toFixed(6)));

          dispatch(setBrightbrush(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setIsLoading(false));
        }

        dispatch(setminTickA(response.minTick.toString()));

        dispatch(setminTickB(response.minTick.toString()));

        dispatch(setmaxTickA(response.maxTick.toString()));

        dispatch(setmaxTickB(response.maxTick.toString()));
      });
    }
  }, [isFullRange, full]);

  const dispatch = useDispatch<AppDispatch>();

  const onLeftRangeInputFn = (value: string) => {
    if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
      getTickFromRealPrice(new BigNumber(value), props.tokenIn.symbol, props.tokenOut.symbol).then(
        (response1) => {
          dispatch(setminTickA(Tick.nearestUsableTick(response1, 10)));
          getTickFromRealPrice(
            new BigNumber(1).dividedBy(new BigNumber(value)),
            props.tokenOut.symbol,
            props.tokenIn.symbol
          ).then((response) => {
            dispatch(setminTickB(Tick.nearestUsableTick(response, 10)));
          });
        }
      );
    } else {
      getTickFromRealPrice(
        new BigNumber(1).dividedBy(new BigNumber(value)),
        props.tokenOut.symbol,
        props.tokenIn.symbol
      ).then((response1) => {
        dispatch(setminTickB(Tick.nearestUsableTick(response1, 10)));
        getTickFromRealPrice(
          new BigNumber(value),
          props.tokenIn.symbol,
          props.tokenOut.symbol
        ).then((response) => {
          dispatch(setminTickA(Tick.nearestUsableTick(response, 10)));
        });
      });
    }

    if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? leftbrush !== Number(value)
        : Bleftbrush !== Number(value)
    ) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setleftbrush(Number(value).toFixed(6)))
        : dispatch(setBleftbrush(Number(value).toFixed(6)));
    }

    topLevelSelectedToken.symbol === tokeninorg.symbol
      ? dispatch(setleftRangeInput(Number(value).toFixed(6)))
      : dispatch(setBleftRangeInput(Number(value).toFixed(6)));
  };
  const onRightRangeInputFn = (value: string) => {
    if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
      getTickFromRealPrice(new BigNumber(value), props.tokenIn.symbol, props.tokenOut.symbol).then(
        (response) => {
          dispatch(setmaxTickA(Tick.nearestUsableTick(response, 10)));
        }
      );
    } else {
      getTickFromRealPrice(
        new BigNumber(1).dividedBy(new BigNumber(value)),
        props.tokenOut.symbol,
        props.tokenIn.symbol
      ).then((response1) => {
        dispatch(setmaxTickB(Tick.nearestUsableTick(response1, 10)));
      });
    }

    if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? rightbrush !== Number(value)
        : Brightbrush !== Number(value)
    ) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setrightbrush(Number(value).toFixed(6)))
        : dispatch(setBrightbrush(Number(value).toFixed(6)));
    }

    topLevelSelectedToken.symbol === tokeninorg.symbol
      ? dispatch(setRightRangeInput(Number(value).toFixed(6)))
      : dispatch(setBRightRangeInput(Number(value).toFixed(6)));
  };
  const fullrangeCalc = (value: boolean) => {
    setFullRange(!isFullRange);
    //dispatch(setFullRange(!isFullRange));
    console.log("fullrange", value);
    if (value) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setleftRangeInput("0"))
        : dispatch(setBleftRangeInput("0"));
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setRightRangeInput("Infinity"))
        : dispatch(setBRightRangeInput("Infinity"));
      calculateFullRange(tokeninorg.symbol, tokenoutorg.symbol).then((response) => {
        console.log(response, "fullrange");

        topLevelSelectedToken.symbol === tokeninorg.symbol
          ? dispatch(setminTickA(response.minTick))
          : dispatch(setminTickB(response.minTick));
        topLevelSelectedToken.symbol === tokeninorg.symbol
          ? dispatch(setmaxTickA(response.maxTick))
          : dispatch(setmaxTickB(response.maxTick));
      });
    }
  };
  const percentage = () => {
    if (props.selectedFeeTier === "0.01") {
      return 0.0001;
    } else if (props.selectedFeeTier === "0.05") {
      return 0.001;
    } else if (props.selectedFeeTier === "0.03") {
      return 0.006;
    } else {
      return 0.002;
    }
  };

  return (
    <div>
      <div className="mx-auto md:w-[400px] w-[362px]   px-[10px]  pt-2 pb-6  mb-5 h-[254px]">
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
            ( {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
            {tEZorCTEZtoUppercase(props.tokenIn.symbol)} )
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
            isFull={isFullRange}
          />
        )}
      </div>
      {isFullRange && (
        <div className=" absolute h-[78px]  flex items-center justify-center w-[362px] px-[20px] bg-error-300/[0.1]  rounded-lg	ml-4 z-10">
          <span className=" text-error-300 text-[13px] leading-[20px] ">
            Full range liquidity is highly capital inefficient. Please proceed with caution.
          </span>
        </div>
      )}
      <div
        className={clsx(
          "relative flex w-[362px] mx-auto gap-[14px] justify-between	mt-[16px]",
          isFullRange && "opacity-[0.1]"
        )}
      >
        <div>
          <div className="font-body4 text-text-250">
            Min Price{" "}
            <span className="font-caption1-small">
              ( {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
              {tEZorCTEZtoUppercase(props.tokenIn.symbol)} )
            </span>
          </div>
          <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
            <div
              className="w-[35px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
              onClick={() =>
                onLeftRangeInputFn(
                  topLevelSelectedToken.symbol === tokeninorg.symbol
                    ? (Number(leftRangeInput) - percentage()).toString()
                    : (Number(BleftRangeInput) - percentage()).toString()
                )
              }
            >
              -
            </div>
            <div className="text-center">
              <div className="font-body4 text-white">
                <input
                  type="text"
                  className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                  value={
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? leftRangeInput
                      : BleftRangeInput
                  }
                  placeholder="0.0"
                  onChange={(e) => onLeftRangeInputFn(e.target.value)}
                />
              </div>
              <div className="font-body2 text-text-250">
                $
                {(topLevelSelectedToken.symbol === tokeninorg.symbol
                  ? leftRangeInput
                  : BleftRangeInput) && tokenPrice[props.tokenIn.name]
                  ? Number(
                      Number(
                        topLevelSelectedToken.symbol === tokeninorg.symbol
                          ? leftRangeInput
                          : BleftRangeInput
                      ) * Number(tokenPrice[props.tokenIn.name])
                    )
                    ? Number(
                        Number(
                          topLevelSelectedToken.symbol === tokeninorg.symbol
                            ? leftRangeInput
                            : BleftRangeInput
                        ) * Number(tokenPrice[props.tokenIn.name])
                      ).toFixed(2)
                    : "0.00"
                  : "0.00"}
              </div>
            </div>
            <div
              className=" w-[35px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
              onClick={() =>
                onLeftRangeInputFn(
                  topLevelSelectedToken.symbol === tokeninorg.symbol
                    ? (Number(leftRangeInput) + percentage()).toString()
                    : (Number(BleftRangeInput) + percentage()).toString()
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
              ( {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
              {tEZorCTEZtoUppercase(props.tokenIn.symbol)} )
            </span>
          </div>
          <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
            <div
              className="w-[35px] h-[24px] text-white rounded bg-info-600  flex items-center cursor-pointer justify-center"
              onClick={() =>
                onRightRangeInputFn(
                  topLevelSelectedToken.symbol === tokeninorg.symbol
                    ? (Number(rightRangeInput) - percentage()).toString()
                    : (Number(BrightRangeInput) - percentage()).toString()
                )
              }
            >
              -
            </div>
            <div className="text-center">
              <div className="font-body4 text-white">
                <input
                  type="text"
                  className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                  value={
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? rightRangeInput
                      : BrightRangeInput
                  }
                  placeholder="0.0"
                  onChange={(e) => onRightRangeInputFn(e.target.value)}
                />
              </div>
              <div className="font-body2 text-text-250">
                $
                {(topLevelSelectedToken.symbol === tokeninorg.symbol
                  ? rightRangeInput
                  : BrightRangeInput) && tokenPrice[props.tokenOut.name]
                  ? Number(
                      Number(
                        topLevelSelectedToken.symbol === tokeninorg.symbol
                          ? rightRangeInput
                          : BrightRangeInput
                      ) * Number(tokenPrice[props.tokenOut.name])
                    )
                    ? Number(
                        Number(
                          topLevelSelectedToken.symbol === tokeninorg.symbol
                            ? rightRangeInput
                            : BrightRangeInput
                        ) * Number(tokenPrice[props.tokenOut.name])
                      ).toFixed(2)
                    : "0.00"
                  : "0.00"}
              </div>
            </div>
            <div
              className="w-[34px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
              onClick={() =>
                onRightRangeInputFn(
                  topLevelSelectedToken.symbol === tokeninorg.symbol
                    ? (Number(rightRangeInput) + percentage()).toString()
                    : (Number(BrightRangeInput) + percentage()).toString()
                )
              }
            >
              +
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-3 cursor-pointer border border-info-700 rounded-lg	text-center py-2.5 font-body1 mx-4"
        onClick={() => fullrangeCalc(!isFullRange)}
      >
        {isFullRange ? "Remove Full Range" : "Full Range"}
      </div>
      {/* <div className="mt-3 border border-text-800/[0.5] bg-cardBackGround rounded-lg	text-center py-4 font-body1 text-primary-500 h-[52px]">
        View all positions
      </div> */}
    </div>
  );
}

export default PriceRangeV3;
