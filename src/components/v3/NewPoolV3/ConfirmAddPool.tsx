import clsx from "clsx";
import Button from "../../Button/Button";
import { PopUpModal } from "../../Modal/popupModal";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import ratesrefresh from "../../../../src/assets/icon/swap/ratesrefresh.svg";
import fromExponential from "from-exponential";
import add from "../../../../src/assets/icon/pools/addIcon.svg";
import { useMemo, useState } from "react";

import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../../src/assets/icon/pools/arrowLeft.svg";
import { tokenIcons } from "../../../constants/tokensList";

import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../../api/util/helpers";
import { useAppSelector } from "../../../redux";
import { tokenParameterLiquidity } from "../../Liquidity/types";

interface IConfirmSwapProps {
  setSelectedToken: React.Dispatch<React.SetStateAction<tokenParameterLiquidity>>;
  selectedToken: tokenParameterLiquidity;
  show: boolean;
  setShow: any;
  priceAmount: string;
  tokenIn: { name: string; image: any; symbol: string };
  tokenOut: { name: string; image: any; symbol: string };
  selectedFeeTier: string;
  routeDetails: {
    path: string[];
    minimumOut: BigNumber;
    minimumTokenOut: BigNumber[];
    priceImpact: BigNumber;
    finalFeePerc: BigNumber;
    feePerc: BigNumber[];
    isStable: boolean[];
    exchangeRate: BigNumber;
    success: boolean;
  };
  setPriceAmount: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => void;
  pair: string;
}
function ConfirmAddPoolv3(props: IConfirmSwapProps) {
  const TOKEN = useAppSelector((state) => state.config.tokens);

  const closeModal = () => {
    props.setShow(false);
  };

  const handlechange = (value: string) => {
    if (value === "" || isNaN(Number(value))) {
      props.setPriceAmount("");
    } else {
      if (value == "0") {
        props.setPriceAmount("0");
      } else {
        props.setPriceAmount((1 / Number(value)).toString());
      }
    }
  };

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Confirm Pool</div>
            {/* <div className="relative top-[2px] cursor-pointer">
          <Image alt={"alt"} src={info} />
        </div> */}
          </div>
          <div className="mt-6">
            <div className="relative rounded-2xl gap-1.5 h-[78px]  flex content-center justify-center">
              <div className="w-[50%] rounded-l-2xl border items-center flex border-text-800/[0.5] bg-card-300 cursor-pointer">
                <div className="ml-2 md:ml-5 ">
                  <img
                    src={
                      props.tokenIn.image
                        ? tokenIcons[props.tokenIn.name]
                          ? tokenIcons[props.tokenIn.name].src
                          : TOKEN[props.tokenIn.name.toString()]?.iconUrl
                          ? TOKEN[props.tokenIn.name.toString()].iconUrl
                          : `/assets/Tokens/fallback.png`
                        : `/assets/icon/emptyIcon.svg`
                    }
                    className=""
                    width={"42px"}
                    height={"42px"}
                    onError={changeSource}
                  />
                </div>
                <div className="ml-1 md:ml-2">
                  <p className="text-text-900 font-body2">Input</p>
                  <p className="font-caption1 md:font-title2 text-white">
                    {props.tokenIn.name ? tEZorCTEZtoUppercase(props.tokenIn.name) : "Select"}
                  </p>
                </div>
              </div>
              <div className="absolute top-[38%] left-[47%] md:left-[48%]">
                <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
              </div>
              <div className="w-[50%] rounded-r-2xl border items-center flex border-text-800/[0.5] bg-card-300 cursor-pointer">
                <div className="ml-5 md:ml-5 ">
                  <img
                    src={
                      props.tokenOut.image
                        ? tokenIcons[props.tokenOut.name]
                          ? tokenIcons[props.tokenOut.name].src
                          : TOKEN[props.tokenOut.name.toString()]?.iconUrl
                          ? TOKEN[props.tokenOut.name.toString()].iconUrl
                          : `/assets/Tokens/fallback.png`
                        : `/assets/icon/emptyIcon.svg`
                    }
                    className=""
                    width={"42px"}
                    height={"42px"}
                    onError={changeSource}
                  />
                </div>
                <div className="ml-1 md:ml-2">
                  <p className="text-text-900 font-body2">Input</p>
                  <p className="font-caption1 md:font-title2 text-white">
                    {props.tokenOut.name ? tEZorCTEZtoUppercase(props.tokenOut.name) : "Select"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={clsx(
                "border  pl-4 pr-5 mt-[12px] bg-muted-200/[0.1] items-center flex  rounded-2xl h-[86px] hover:border-text-700",
                "border-text-800 "
              )}
            >
              <div className="w-0 flex-auto ">
                <p>
                  <span className="mt-2 font-body2  md:font-body4 text-text-400">
                    INITIAL PRICE{" "}
                    {props.selectedToken.symbol
                      ? `: 1 ${tEZorCTEZtoUppercase(
                          props.selectedToken.symbol === props.tokenIn.symbol
                            ? props.tokenIn.name
                            : props.tokenOut.symbol
                        )} =`
                      : null}
                  </span>
                </p>
                <p className="flex items-center ">
                  <input
                    type="text"
                    className="text-white bg-muted-200/[0.1] text-left border-0 ml-1 font-medium2  lg:font-medium1 outline-none  placeholder:text-text-500 w-[70px] md:w-[150px]"
                    placeholder="0.0"
                    disabled
                    value={fromExponential(props.priceAmount)}
                  />
                  {props.tokenIn.symbol && props.tokenOut.symbol && (
                    <div className="bg-muted-600 rounded-3xl px-2 py-1.5 flex items-center">
                      <span className="w-4 h-4">
                        <img
                          src={
                            props.tokenOut.symbol && props.tokenIn.symbol
                              ? tokenIcons[
                                  props.selectedToken.symbol === props.tokenIn.symbol
                                    ? props.tokenOut.symbol
                                    : props.tokenIn.symbol
                                ]
                                ? tokenIcons[
                                    props.selectedToken.symbol === props.tokenIn.symbol
                                      ? props.tokenOut.symbol
                                      : props.tokenIn.symbol
                                  ].src
                                : TOKEN[
                                    props.selectedToken.symbol === props.tokenIn.symbol
                                      ? props.tokenOut.symbol.toString()
                                      : props.tokenIn.symbol.toString()
                                  ]?.iconUrl
                                ? TOKEN[
                                    props.selectedToken.symbol === props.tokenIn.symbol
                                      ? props.tokenOut.symbol.toString()
                                      : props.tokenIn.symbol.toString()
                                  ].iconUrl
                                : `/assets/Tokens/fallback.png`
                              : `/assets/icon/emptyIcon.svg`
                          }
                          className=""
                          width={"16px"}
                          height={"16px"}
                          onError={changeSource}
                        />
                      </span>

                      <span className="ml-1 font-caption1">
                        {tEZorCTEZtoUppercase(
                          props.selectedToken.symbol === props.tokenIn.symbol
                            ? props.tokenOut.name
                            : props.tokenIn.symbol
                        )}
                      </span>
                    </div>
                  )}{" "}
                </p>
              </div>
              {props.tokenIn.symbol && props.tokenOut.symbol && (
                <div>
                  <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit ml-auto ">
                    <div
                      className={clsx(
                        props.selectedToken.symbol === props.tokenIn.symbol
                          ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                          : "text-text-250 px-2",
                        "font-subtitle1223"
                      )}
                      onClick={() => {
                        handlechange(props.priceAmount);
                        props.setSelectedToken(props.tokenIn);
                      }}
                    >
                      {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                    </div>
                    <div
                      className={clsx(
                        props.selectedToken.symbol === props.tokenOut.symbol
                          ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                          : "text-text-250 px-2",
                        "font-subtitle1223"
                      )}
                      onClick={() => {
                        handlechange(props.priceAmount);
                        props.setSelectedToken(props.tokenOut);
                      }}
                    >
                      {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                    </div>
                  </div>
                  <div className="font-body1 md:font-body3 text-text-600 mt-[5.5px]  text-end">
                    {`${props.selectedFeeTier}% fee tier`}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              <Button color="primary" width="w-full" onClick={props.onClick}>
                Confirm
              </Button>
            </div>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ConfirmAddPoolv3;
