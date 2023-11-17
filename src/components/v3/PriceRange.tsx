import { Tick } from "@plenty-labs/v3-sdk";
import clsx from "clsx";
import minus from "../../../src/assets/icon/poolsv3/minus.png";
import plus from "../../../src/assets/icon/poolsv3/plus.png";
import infoOrangeBig from "../../../src/assets/icon/poolsv3/InfoOrangeBig.svg";
import { BigNumber } from "bignumber.js";
import * as React from "react";
import { useDispatch } from "react-redux";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { getRealPriceFromTick, getTickFromRealPrice } from "../../api/v3/helper";
import { calculateFullRange } from "../../api/v3/liquidity";
import { AppDispatch, useAppSelector } from "../../redux";
import {
  setBleftbrush,
  setBleftRangeInput,
  setBrightbrush,
  setBRightRangeInput,
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
import { Chain, IConfigToken } from "../../config/types";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import Image from "next/image";

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
  isFullRange: boolean;
  setFullRange: React.Dispatch<React.SetStateAction<boolean>>;
}
export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

function PriceRangeV3(props: IPriceRangeProps) {
  const currenyAA = props.tokenIn;
  const timeout = React.useRef<any>();
  const currencyBB = props.tokenOut;
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const tokens = useAppSelector((state) => state.config.tokens);
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
  const tokensArray = Object.entries(tokens);
  const percentage = () => {
    if (props.selectedFeeTier == "0.01") {
      return 0.0001;
    } else if (props.selectedFeeTier == "0.05") {
      return 0.001;
    } else if (props.selectedFeeTier == "0.3") {
      return 0.006;
    } else {
      return 0.002;
    }
  };
  const tokensListConfig = React.useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,

      chainType: token[1].originChain as Chain,
      address: token[1].address,
      interface: token[1],
    }));
  }, [tokens]);
  const [tokenInConfig, setTokenInConfig] = React.useState<IConfigToken>({} as IConfigToken);
  const [tokenOutConfig, setTokenOutConfig] = React.useState<IConfigToken>({} as IConfigToken);
  React.useEffect(() => {
    tokensListConfig.map((tokenConfig) => {
      if (tokenConfig.name === props.tokenIn.symbol) {
        setTokenInConfig(tokenConfig.interface);
      }
      if (tokenConfig.name === props.tokenOut.symbol) {
        setTokenOutConfig(tokenConfig.interface);
      }
    });
  }, [tokensListConfig, props.tokenIn.symbol, props.tokenOut.symbol]);
  const tickSpacing = (selectedFeeTier: string) => {
    if (selectedFeeTier == "0.01") {
      return 1;
    } else if (selectedFeeTier == "0.05") {
      return 10;
    } else if (selectedFeeTier == "0.3") {
      return 60;
    } else {
      return 200;
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  React.useEffect(() => {
    props.isClearAll && props.setFullRange(false);
  }, [props.isClearAll]);

  function debounce(fn: any, delay: number | undefined) {
    let timer: NodeJS.Timeout | undefined;
    return function (...args: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const onLeftRangeInputFn = (value: string) => {
    if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
      getTickFromRealPrice(
        new BigNumber(value),
        tokenInConfig,
        tokenOutConfig,
        tickSpacing(props.selectedFeeTier)
      ).then((response1) => {
        getRealPriceFromTick(response1, tokenInConfig, tokenOutConfig).then((realprice) => {
          dispatch(setleftRangeInput(Number(realprice).toFixed(6)));
        });
        dispatch(
          setminTickA(Tick.nearestUsableTick(response1, tickSpacing(props.selectedFeeTier)))
        );
      });
    } else {
      getTickFromRealPrice(
        new BigNumber(1).dividedBy(new BigNumber(value)),
        tokenOutConfig,
        tokenInConfig,
        tickSpacing(props.selectedFeeTier)
      ).then((response1) => {
        getRealPriceFromTick(response1, tokenOutConfig, tokenInConfig).then((realprice) => {
          dispatch(setBleftRangeInput((1 / Number(realprice)).toFixed(6)));
        });
        dispatch(
          setmaxTickB(Tick.nearestUsableTick(response1, tickSpacing(props.selectedFeeTier)))
        );
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
    if (Number(value) <= 0 || value == "-" || value === "" || isNaN(Number(value))) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setleftRangeInput(0 + percentage()))
        : dispatch(setBleftRangeInput(0 + percentage()));
    }
    // else {
    //   console.log("value else", value);
    //   topLevelSelectedToken.symbol === tokeninorg.symbol
    //     ? dispatch(setleftRangeInput(value))
    //     : dispatch(setBleftRangeInput(value));
    // }
  };
  const onRightRangeInputFn = (value: string) => {
    dispatch(setRightRangeInput(value));

    if (Number(value) <= 0 || value == "-" || value === "" || isNaN(Number(value))) {
      if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
        getTickFromRealPrice(
          new BigNumber(0 + percentage()),
          tokenInConfig,
          tokenOutConfig,
          tickSpacing(props.selectedFeeTier)
        ).then((response) => {
          getRealPriceFromTick(response, tokenInConfig, tokenOutConfig).then((realprice) => {
            dispatch(setRightRangeInput(realprice.toFixed(6)));
          });
          dispatch(
            setmaxTickA(Tick.nearestUsableTick(response, tickSpacing(props.selectedFeeTier)))
          );
        });
      } else {
        getTickFromRealPrice(
          new BigNumber(1).dividedBy(new BigNumber(0 + percentage())),
          tokenOutConfig,
          tokenInConfig,

          tickSpacing(props.selectedFeeTier)
        ).then((response1) => {
          getRealPriceFromTick(response1, tokenOutConfig, tokenInConfig).then((realprice) => {
            dispatch(setBRightRangeInput((1 / Number(realprice)).toFixed(6)));
          });
          dispatch(
            setminTickB(Tick.nearestUsableTick(response1, tickSpacing(props.selectedFeeTier)))
          );
        });
      }
    } else {
      if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
        getTickFromRealPrice(
          new BigNumber(value),
          tokenInConfig,
          tokenOutConfig,
          tickSpacing(props.selectedFeeTier)
        ).then((response) => {
          getRealPriceFromTick(response, tokenInConfig, tokenOutConfig).then((realprice) => {
            dispatch(setRightRangeInput(Number(realprice).toFixed(6)));
          });

          dispatch(
            setmaxTickA(Tick.nearestUsableTick(response, tickSpacing(props.selectedFeeTier)))
          );
        });
      } else {
        getTickFromRealPrice(
          new BigNumber(1).dividedBy(new BigNumber(value)),
          tokenOutConfig,
          tokenInConfig,

          tickSpacing(props.selectedFeeTier)
        ).then((response1) => {
          getRealPriceFromTick(response1, tokenOutConfig, tokenInConfig).then((realprice) => {
            dispatch(setBRightRangeInput((1 / Number(realprice)).toFixed(6)));
          });
          dispatch(
            setminTickB(Tick.nearestUsableTick(response1, tickSpacing(props.selectedFeeTier)))
          );
        });
      }

      if (
        topLevelSelectedToken.symbol === tokeninorg.symbol
          ? rightbrush !== Number(value)
          : Brightbrush !== Number(value)
      ) {
        if (Number(value) <= 0 || value == "-" || value === "" || isNaN(Number(value))) {
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setrightbrush(Number(0 + percentage()).toFixed(6)))
            : dispatch(setBrightbrush(Number(0 + percentage()).toFixed(6)));
        } else {
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setrightbrush(Number(value).toFixed(6)))
            : dispatch(setBrightbrush(Number(value).toFixed(6)));
        }
      }
    }
    if (Number(value) <= 0 || value == "-" || value === "" || isNaN(Number(value))) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setRightRangeInput(0 + percentage()))
        : dispatch(setBRightRangeInput(0 + percentage()));
    }
    // else {
    //   topLevelSelectedToken.symbol === tokeninorg.symbol
    //     ? dispatch(setRightRangeInput(value))
    //     : dispatch(setBRightRangeInput(value));
    // }
  };
  const leftdebo = debounce(onLeftRangeInputFn, 2000);
  const rightdebo = debounce(onRightRangeInputFn, 2000);

  const fullrangeCalc = (value: boolean) => {
    props.setFullRange(!props.isFullRange);
    //dispatch(props.setFullRange(!props.isFullRange));

    if (value) {
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setleftRangeInput("0"))
        : dispatch(setBleftRangeInput("0"));
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? dispatch(setRightRangeInput("∞"))
        : dispatch(setBRightRangeInput("∞"));
      calculateFullRange(tokeninorg.symbol, tokenoutorg.symbol, Number(props.selectedFeeTier)).then(
        (response) => {
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setleftbrush(response.minTickPrice.toFixed(6)))
            : dispatch(setBleftbrush(Number(value).toFixed(6)));
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setrightbrush(response.maxTickPrice.toFixed(6)))
            : dispatch(setBrightbrush(Number(value).toFixed(6)));
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setminTickA(response.minTick))
            : dispatch(setminTickB(response.minTick));
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? dispatch(setmaxTickA(response.maxTick))
            : dispatch(setmaxTickB(response.maxTick));
        }
      );
    }
  };

  return (
    <div>
      <div className="mx-auto md:w-[400px] w-[362px]   px-[10px]  pt-2 pb-6  mb-5 h-[254px]">
        <div className="flex justify-between">
          <div className="font-body4 ">Set price range</div>
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
            feeTier={Number(props.selectedFeeTier)}
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
            isFull={props.isFullRange}
            setFullRange={props.setFullRange}
          />
        )}
      </div>
      {props.isFullRange ? (
        <div className="relative">
          {" "}
          <div
            className={clsx(
              "relative flex w-auto md:w-[378px] mx-auto gap-[5px] md:gap-[10px] justify-between md:mt-5",
              props.isFullRange && "opacity-[0.1]"
            )}
          >
            <div>
              <div className="border border-text-800 bg-card-200 rounded-2xl  py-3 px-2.5 flex items-center justify-between w-[170px] md:w-[185px] mt-[4px] h-[100px]">
                <div
                  className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                  onClick={() => {
                    onLeftRangeInputFn(
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? (
                            Number(leftRangeInput) -
                            Number(leftRangeInput) * Number(percentage())
                          ).toString()
                        : (
                            Number(BleftRangeInput) -
                            Number(BleftRangeInput) * Number(percentage())
                          ).toString()
                    );
                  }}
                >
                  <Image src={minus} />
                </div>
                <div className="text-center">
                  <span className="font-caption1 text-text-250 ">Min price</span>
                  <ToolTip
                    message={`$  ${
                      (topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? leftRangeInput
                        : BleftRangeInput) && tokenPrice[props.tokenIn.name]
                        ? Number(
                            Number(
                              topLevelSelectedToken.symbol === tokeninorg.symbol
                                ? leftRangeInput
                                : BleftRangeInput
                            ) *
                              Number(
                                tokenPrice[
                                  topLevelSelectedToken.symbol === tokeninorg.symbol
                                    ? tokenoutorg.name
                                    : tokeninorg.name
                                ]
                              )
                          )
                          ? Number(
                              Number(
                                topLevelSelectedToken.symbol === tokeninorg.symbol
                                  ? leftRangeInput
                                  : BleftRangeInput
                              ) *
                                Number(
                                  tokenPrice[
                                    topLevelSelectedToken.symbol === tokeninorg.symbol
                                      ? tokenoutorg.name
                                      : tokeninorg.name
                                  ]
                                )
                            ).toFixed(2)
                          : "0.00"
                        : "0.00"
                    }`}
                    id="tooltip8"
                    position={Position.top}
                  >
                    <div className="font-title3">
                      <input
                        type="text"
                        className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                        value={
                          topLevelSelectedToken.symbol === tokeninorg.symbol
                            ? leftRangeInput
                            : BleftRangeInput
                        }
                        placeholder="0.0"
                        onChange={(e) => {
                          dispatch(setleftRangeInput(e.target.value));
                          leftdebo(e.target.value);
                        }}
                      />
                    </div>
                  </ToolTip>
                  <span className="font-mobile-400 text-text-250 ">
                    {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                    {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                  </span>
                </div>
                <div
                  className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                  onClick={() => {
                    onLeftRangeInputFn(
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? (
                            Number(leftRangeInput) +
                            Number(leftRangeInput) * percentage()
                          ).toString()
                        : (
                            Number(BleftRangeInput) +
                            Number(BleftRangeInput) * percentage()
                          ).toString()
                    );
                  }}
                >
                  <Image src={plus} />
                </div>
              </div>
            </div>
            <div>
              <div className="border border-text-800 bg-card-200 rounded-2xl  py-3 px-2.5 flex items-center justify-between  w-[170px] md:w-[185px] mt-[4px] h-[100px]">
                <div
                  className="w-[40px] h-[28px] text-white rounded bg-info-600  flex items-center cursor-pointer justify-center hover:bg-background-700"
                  onClick={() =>
                    onRightRangeInputFn(
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? (
                            Number(rightRangeInput) -
                            Number(rightRangeInput) * percentage()
                          ).toString()
                        : (
                            Number(BrightRangeInput) -
                            Number(BrightRangeInput) * percentage()
                          ).toString()
                    )
                  }
                >
                  <Image src={minus} />
                </div>
                <div className="text-center">
                  <span className="font-caption1 text-text-250 ">Max price</span>
                  <ToolTip
                    message={`$${
                      (topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? rightRangeInput
                        : BrightRangeInput) &&
                      tokenPrice[
                        topLevelSelectedToken.symbol === tokeninorg.symbol
                          ? tokenoutorg.name
                          : tokeninorg.name
                      ]
                        ? Number(
                            Number(
                              topLevelSelectedToken.symbol === tokeninorg.symbol
                                ? rightRangeInput
                                : BrightRangeInput
                            ) *
                              Number(
                                tokenPrice[
                                  topLevelSelectedToken.symbol === tokeninorg.symbol
                                    ? tokenoutorg.name
                                    : tokeninorg.name
                                ]
                              )
                          )
                          ? Number(
                              Number(
                                topLevelSelectedToken.symbol === tokeninorg.symbol
                                  ? rightRangeInput
                                  : BrightRangeInput
                              ) *
                                Number(
                                  tokenPrice[
                                    topLevelSelectedToken.symbol === tokeninorg.symbol
                                      ? tokenoutorg.name
                                      : tokeninorg.name
                                  ]
                                )
                            ).toFixed(2)
                          : "0.00"
                        : "0.00"
                    }`}
                    id="tooltip8"
                    position={Position.top}
                  >
                    <div className="font-title3">
                      <input
                        type="text"
                        className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                        value={
                          topLevelSelectedToken.symbol === tokeninorg.symbol
                            ? rightRangeInput
                            : BrightRangeInput
                        }
                        placeholder="0.0"
                        onChange={(e) => {
                          dispatch(setRightRangeInput(e.target.value));
                          rightdebo(e.target.value);
                        }}
                      />
                    </div>
                  </ToolTip>
                  <span className="font-mobile-400 text-text-250 ">
                    {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                    {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                  </span>
                </div>
                <div
                  className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                  onClick={() =>
                    onRightRangeInputFn(
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? (
                            Number(rightRangeInput) +
                            Number(rightRangeInput) * percentage()
                          ).toString()
                        : (
                            Number(BrightRangeInput) +
                            Number(BrightRangeInput) * percentage()
                          ).toString()
                    )
                  }
                >
                  <Image src={plus} />
                </div>
              </div>
            </div>
          </div>
          <div className="fade-in-light absolute  top-4 h-[78px]  flex items-center justify-center w-[369px] px-[20px] bg-error-300/[0.1]  rounded-lg  ml-3 z-10">
            <span className=" text-error-300 text-[13px] leading-[20px] ">
              Full range liquidity is highly capital inefficient. Please proceed with caution.
            </span>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            " flex w-auto md:w-[378px] mx-auto gap-[5px] md:gap-[10px] justify-between md:mt-5",
            props.isFullRange && "opacity-[0.1]"
          )}
        >
          <div>
            <div className="border border-text-800 bg-card-200 rounded-2xl  py-3 px-2.5 flex items-center justify-between w-[170px] md:w-[185px] mt-[4px] h-[100px]">
              <div
                className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                onClick={() =>
                  onLeftRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(leftRangeInput) - Number(leftRangeInput) * percentage()).toString()
                      : (
                          Number(BleftRangeInput) -
                          Number(BleftRangeInput) * percentage()
                        ).toString()
                  )
                }
              >
                <Image src={minus} />
              </div>
              <div className="text-center">
                <span className="font-caption1 text-text-250 ">Min price</span>
                <ToolTip
                  message={`$  ${
                    (topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? leftRangeInput
                      : BleftRangeInput) && tokenPrice[props.tokenIn.name]
                      ? Number(
                          Number(
                            topLevelSelectedToken.symbol === tokeninorg.symbol
                              ? leftRangeInput
                              : BleftRangeInput
                          ) *
                            Number(
                              tokenPrice[
                                topLevelSelectedToken.symbol === tokeninorg.symbol
                                  ? tokenoutorg.name
                                  : tokeninorg.name
                              ]
                            )
                        )
                        ? Number(
                            Number(
                              topLevelSelectedToken.symbol === tokeninorg.symbol
                                ? leftRangeInput
                                : BleftRangeInput
                            ) *
                              Number(
                                tokenPrice[
                                  topLevelSelectedToken.symbol === tokeninorg.symbol
                                    ? tokenoutorg.name
                                    : tokeninorg.name
                                ]
                              )
                          ).toFixed(2)
                        : "0.00"
                      : "0.00"
                  }`}
                  id="tooltip8"
                  position={Position.top}
                >
                  <div className="font-title3">
                    <input
                      type="text"
                      className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                      value={
                        topLevelSelectedToken.symbol === tokeninorg.symbol
                          ? leftRangeInput
                          : BleftRangeInput
                      }
                      placeholder="0.0"
                      onChange={(e) => {
                        dispatch(setleftRangeInput(e.target.value));
                        leftdebo(e.target.value);
                      }}
                    />
                  </div>
                </ToolTip>
                <span className="font-mobile-400 text-text-250 ">
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                </span>
              </div>
              <div
                className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                onClick={() =>
                  onLeftRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (Number(leftRangeInput) + Number(leftRangeInput) * percentage()).toString()
                      : (
                          Number(BleftRangeInput) +
                          Number(BleftRangeInput) * percentage()
                        ).toString()
                  )
                }
              >
                <Image src={plus} />
              </div>
            </div>
          </div>
          <div>
            <div className="border border-text-800 bg-card-200 rounded-2xl  py-3 px-2.5 flex items-center justify-between  w-[170px] md:w-[185px] mt-[4px] h-[100px]">
              <div
                className="w-[40px] h-[28px] text-white rounded bg-info-600  flex items-center cursor-pointer justify-center hover:bg-background-700"
                onClick={() =>
                  onRightRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (
                          Number(rightRangeInput) -
                          Number(rightRangeInput) * percentage()
                        ).toString()
                      : (
                          Number(BrightRangeInput) -
                          Number(BrightRangeInput) * percentage()
                        ).toString()
                  )
                }
              >
                <Image src={minus} />
              </div>
              <div className="text-center">
                <span className="font-caption1 text-text-250 ">Max price</span>
                <ToolTip
                  message={`$${
                    (topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? rightRangeInput
                      : BrightRangeInput) &&
                    tokenPrice[
                      topLevelSelectedToken.symbol === tokeninorg.symbol
                        ? tokenoutorg.name
                        : tokeninorg.name
                    ]
                      ? Number(
                          Number(
                            topLevelSelectedToken.symbol === tokeninorg.symbol
                              ? rightRangeInput
                              : BrightRangeInput
                          ) *
                            Number(
                              tokenPrice[
                                topLevelSelectedToken.symbol === tokeninorg.symbol
                                  ? tokenoutorg.name
                                  : tokeninorg.name
                              ]
                            )
                        )
                        ? Number(
                            Number(
                              topLevelSelectedToken.symbol === tokeninorg.symbol
                                ? rightRangeInput
                                : BrightRangeInput
                            ) *
                              Number(
                                tokenPrice[
                                  topLevelSelectedToken.symbol === tokeninorg.symbol
                                    ? tokenoutorg.name
                                    : tokeninorg.name
                                ]
                              )
                          ).toFixed(2)
                        : "0.00"
                      : "0.00"
                  }`}
                  id="tooltip8"
                  position={Position.top}
                >
                  <div className="font-title3">
                    <input
                      type="text"
                      className="text-white font-body4 bg-card-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                      value={
                        topLevelSelectedToken.symbol === tokeninorg.symbol
                          ? rightRangeInput
                          : BrightRangeInput
                      }
                      placeholder="0.0"
                      onChange={(e) => {
                        dispatch(setRightRangeInput(e.target.value));
                        rightdebo(e.target.value);
                      }}
                    />
                  </div>
                </ToolTip>
                <span className="font-mobile-400 text-text-250 ">
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                </span>
              </div>
              <div
                className="w-[40px] h-[28px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center hover:bg-background-700"
                onClick={() =>
                  onRightRangeInputFn(
                    topLevelSelectedToken.symbol === tokeninorg.symbol
                      ? (
                          Number(rightRangeInput) +
                          Number(rightRangeInput) * percentage()
                        ).toString()
                      : (
                          Number(BrightRangeInput) +
                          Number(BrightRangeInput) * percentage()
                        ).toString()
                  )
                }
              >
                <Image src={plus} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="mt-5 cursor-pointer border border-info-700 hover:border-text-600 rounded-lg  text-center py-2.5 font-body1 sm:mx-3 sm:mb-2 mb-6"
        onClick={() => fullrangeCalc(!props.isFullRange)}
      >
        {props.isFullRange ? "Remove full range" : "Full range"}
      </div>
      {Number(
        topLevelSelectedToken.symbol === tokeninorg.symbol ? rightRangeInput : BrightRangeInput
      ) <=
        Number(
          topLevelSelectedToken.symbol === tokeninorg.symbol ? leftRangeInput : BleftRangeInput
        ) && (
        <div className="fade-in-warning h-[56px] mt-[7px] flex items-center mx-3 px-2 bg-error-300/[0.1]  rounded-lg	">
          <Image src={infoOrangeBig} />
          <span className="ml-3 text-error-300 text-[13px] leading-[20px] ">
            {` Invalid range selected. The min price must be lower than the max price.`}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceRangeV3;
