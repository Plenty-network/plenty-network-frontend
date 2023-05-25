import clsx from "clsx";
import Button from "../Button/Button";
import { PopUpModal } from "../Modal/popupModal";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import ratesrefresh from "../../../src/assets/icon/swap/ratesrefresh.svg";
import { useMemo, useState } from "react";
import arrow from "../../../src/assets/icon/swap/downArrow.svg";
import info from "../../../src/assets/icon/swap/info.svg";
import { BigNumber } from "bignumber.js";
import stableSwap from "../../../src/assets/icon/swap/stableswapViolet.svg";
import { tokenIcons } from "../../constants/tokensList";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { Chain } from "../../config/types";
import { useAppSelector } from "../../redux";

interface IConfirmSwapProps {
  show: boolean;
  setShow: any;
  tokenIn: { name: string; image: any };
  tokenOut: { name: string; image: any };
  firstTokenAmount: string | number;
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
  secondTokenAmount: string | number;
  onClick: () => void;
  tokens: {
    name: string;
    image: string;
    chainType: Chain;
    address: string | undefined;
  }[];
}
function ConfirmSwap(props: IConfirmSwapProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const [isConvert, setConvert] = useState(false);
  const convertRates = (e: any) => {
    e.stopPropagation();
    setConvert(!isConvert);
  };
  const closeModal = () => {
    props.setShow(false);
  };
  const swapRoute = useMemo(() => {
    if (props.routeDetails.path?.length >= 2) {
      return props.routeDetails.path.map((tokenName) =>
        props.tokens.find((token) => token.name === tokenName)
      );
    }

    return null;
  }, [props.routeDetails.path]);

  return props.show ? (
    <PopUpModal title="Confirm Swap" onhide={closeModal}>
      {
        <>
          <div className="mt-6">
            <div className="border bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <img
                    alt={"alt"}
                    src={
                      tokenIcons[props.tokenIn.name]
                        ? tokenIcons[props.tokenIn.name].src
                        : tokens[props.tokenIn.name.toString()]?.iconUrl
                        ? tokens[props.tokenIn.name.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                    }
                    height={"26px"}
                    width={"26px"}
                    onError={changeSource}
                  />
                </span>
                <span className="font-title3 ml-2">
                  <span>{tEZorCTEZtoUppercase(props.tokenIn.name)}</span>
                </span>
              </div>
              <div className="ml-auto items-center flex font-medium2">{props.firstTokenAmount}</div>
            </div>
            <div className="flex justify-center -mt-[15px]">
              <Image alt={"alt"} src={arrow} />
            </div>
            <div className="border -mt-[18px] bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <img
                    alt={"alt"}
                    src={
                      tokenIcons[props.tokenOut.name]
                        ? tokenIcons[props.tokenOut.name].src
                        : tokens[props.tokenOut.name.toString()]?.iconUrl
                        ? tokens[props.tokenOut.name.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                    }
                    height={"26px"}
                    width={"26px"}
                    onError={changeSource}
                  />
                </span>
                <span className="font-title3 ml-2">
                  <span>{tEZorCTEZtoUppercase(props.tokenOut.name)}</span>
                </span>
              </div>
              <div className="ml-auto items-center flex font-medium2">
                {Number(props.secondTokenAmount).toFixed(6)}
              </div>
            </div>
            <div className="h-12 mt-3 px-4 pt-[13px] pb-[15px] rounded-2xl bg-muted-600 border border-primary-500/[0.2]  items-center flex  ">
              <>
                <div>
                  <span className="ml-[9.25px] font-bold3 lg:font-text-bold mr-[7px]">
                    1{" "}
                    {!isConvert
                      ? tEZorCTEZtoUppercase(props.tokenIn.name)
                      : tEZorCTEZtoUppercase(props.tokenOut.name)}{" "}
                    =
                    {!isConvert
                      ? ` ${props.routeDetails.exchangeRate.toFixed(3)} 
                            ${tEZorCTEZtoUppercase(props.tokenOut.name)}`
                      : `${Number(1 / Number(props.routeDetails.exchangeRate)).toFixed(
                          3
                        )} ${tEZorCTEZtoUppercase(props.tokenIn.name)}`}
                  </span>
                  <span className="relative top-px cursor-pointer ">
                    <Image alt={"alt"} src={ratesrefresh} onClick={(e) => convertRates(e)} />
                  </span>
                </div>
              </>
            </div>

            <div
              className={`bg-card-500 border border-text-700/[0.5] py-[14px] lg:py-5 px-[15px] lg:px-[22px] h-[218px] rounded-3xl mt-2 `}
            >
              <div className="flex">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Minimum received</span>
                  <span className="relative top-0.5">
                    <ToolTip
                      id="tooltipM"
                      position={Position.top}
                      toolTipChild={
                        <div className="w-[200px]">
                          The minimum amount you are guaranteed to receive. If the price slips any
                          further, your transaction will revert.
                        </div>
                      }
                    >
                      <Image
                        alt={"alt"}
                        src={info}
                        width={"15px"}
                        height={"15px"}
                        className="cursor-pointer"
                      />
                    </ToolTip>
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {` ${Number(props.routeDetails.minimumOut).toFixed(4)} ${tEZorCTEZtoUppercase(
                    props.tokenOut.name
                  )}`}
                </div>
              </div>

              <div className="flex mt-2">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Price impact</span>
                  <span className="relative top-0.5">
                    <ToolTip
                      id="tooltipN"
                      position={isMobile ? Position.right : Position.top}
                      toolTipChild={
                        <div className="w-[200px]">
                          The difference between the market price and estimated price due to trade
                          size.
                        </div>
                      }
                    >
                      <Image
                        alt={"alt"}
                        src={info}
                        width={"15px"}
                        height={"15px"}
                        className="cursor-pointer"
                      />
                    </ToolTip>
                  </span>
                </div>
                <div
                  className={clsx(
                    "ml-auto font-mobile-700 md:font-subtitle4",
                    Number(props.routeDetails.priceImpact) > 3 && "text-error-500"
                  )}
                >
                  {`${props.routeDetails.priceImpact.toFixed(4)} %`}
                </div>
              </div>
              <div className="flex mt-2">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Fee</span>
                  <span className="relative top-0.5">
                    <ToolTip
                      id="tooltipO"
                      position={isMobile ? Position.right : Position.top}
                      toolTipChild={
                        <div className="w-[200px]">
                          Fees is 0.05% for both volatile and stable swap
                        </div>
                      }
                    >
                      <Image alt={"alt"} src={info} className="cursor-pointer" />
                    </ToolTip>
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {`${props.routeDetails.finalFeePerc.toFixed(2)} %`}
                </div>
              </div>
              <div className="border-t border-text-800 mt-[18px]"></div>
              <div className="mt-4 ">
                <div className="font-subtitle2 md:font-subtitle4">
                  {" "}
                  <span className="mr-[5px]">Route</span>
                  <span className="relative top-0.5">
                    <ToolTip
                      id="tooltipP"
                      position={isMobile ? Position.right : Position.top}
                      toolTipChild={
                        <div className="w-[200px]">
                          Routing through these tokens results in the best price for your trade.
                        </div>
                      }
                    >
                      <Image
                        alt={"alt"}
                        src={info}
                        width={"15px"}
                        height={"15px"}
                        className="cursor-pointer"
                      />
                    </ToolTip>
                  </span>
                </div>
                <div className="swap overflow-x-auto pb-2 min-w-[318px]">
                  <div className="border-dashed relative top-[22px]   border-t-2 border-muted-50 mx-2"></div>
                  <div className="mt-2 flex justify-between ">
                    {swapRoute?.map((token, idx) => {
                      const index = idx + 1;
                      return (
                        <>
                          {(idx === 0 || idx === swapRoute.length - 1) && (
                            <div className="flex items-center " key={token?.name}>
                              {idx === swapRoute?.length - 1 && (
                                <div className="w-0.5 h-2 bg-card-500 z-50"></div>
                              )}
                              <div
                                className={clsx(
                                  "relative  z-100   p-0.5 bg-card-600 rounded-full",
                                  swapRoute?.length > 3
                                    ? "w-[24px] h-[24px]"
                                    : "w-[28px] h-[28px] lg:w-[32px] lg:h-[32px]"
                                )}
                              >
                                <span
                                  className={clsx(
                                    swapRoute?.length > 3
                                      ? "w-[20px] h-[20px]"
                                      : "w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
                                  )}
                                >
                                  <img
                                    alt={"alt"}
                                    src={
                                      tokenIcons[token?.name as string]
                                        ? tokenIcons[token?.name as string].src
                                        : tokens[token?.name as string]?.iconUrl
                                        ? tokens[token?.name as string].iconUrl
                                        : `/assets/Tokens/fallback.png`
                                    }
                                    width={"28px"}
                                    height={"28px"}
                                    onError={changeSource}
                                  />
                                </span>
                              </div>
                              {idx === 0 && <div className="w-0.5 h-2 bg-card-500 z-50"></div>}
                            </div>
                          )}

                          {idx !== swapRoute.length - 1 && (
                            <div className="flex items-center">
                              <div className="w-0.5 h-2 bg-card-500 z-50"></div>
                              <div
                                className={clsx(
                                  "relative  rounded-2xl  bg-card-600 p-px flex",

                                  props.routeDetails.isStable[idx]
                                    ? swapRoute.length > 3
                                      ? "w-[96px]"
                                      : "w-[113px] lg:w-[130px]"
                                    : swapRoute.length > 3
                                    ? "w-[88px]"
                                    : "w-[103px] lg:w-[114px]",
                                  swapRoute.length > 3 ? "h-[24px]" : "h-[28px] lg:h-[32px]"
                                )}
                              >
                                <span className=" flex items-center">
                                  {props.routeDetails.isStable[idx] && (
                                    <div
                                      className={clsx(
                                        "   z-50   flex justify-center items-center bg-card-600 rounded-full",
                                        swapRoute.length > 3
                                          ? "w-[20px] h-[20px]"
                                          : "w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
                                      )}
                                    >
                                      <span className="w-[18px] h-[18px]">
                                        <Image
                                          alt={"alt"}
                                          src={stableSwap}
                                          width={"18px"}
                                          height={"18px"}
                                        />
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={clsx(
                                      "relative   z-40   p-0.5 bg-card-600 rounded-full",
                                      props.routeDetails.isStable[idx] && "right-[10px]",
                                      swapRoute.length > 3
                                        ? "w-[24px] h-[24px]"
                                        : "w-[28px] h-[28px] lg:w-[32px] lg:h-[32px]"
                                    )}
                                  >
                                    <span
                                      className={clsx(
                                        swapRoute?.length > 3
                                          ? "w-[20px] h-[20px]"
                                          : "w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
                                      )}
                                    >
                                      <img
                                        alt={"alt"}
                                        src={
                                          tokenIcons[token?.name as string]
                                            ? tokenIcons[token?.name as string].src
                                            : tokens[token?.name as string]?.iconUrl
                                            ? tokens[token?.name as string].iconUrl
                                            : `/assets/Tokens/fallback.png`
                                        }
                                        width={"28px"}
                                        height={"28px"}
                                        onError={changeSource}
                                      />
                                    </span>
                                  </div>
                                  <div
                                    className={clsx(
                                      "relative  z-30 p-0.5 bg-card-600 rounded-full",
                                      props.routeDetails.isStable[idx] ? "right-5" : "right-[10px]",
                                      swapRoute.length > 3
                                        ? "w-[24px] h-[24px]"
                                        : "w-[28px] h-[28px] lg:w-[32px] lg:h-[32px]"
                                    )}
                                  >
                                    <span
                                      className={clsx(
                                        swapRoute?.length > 3
                                          ? "w-[20px] h-[20px]"
                                          : "w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
                                      )}
                                    >
                                      <img
                                        src={
                                          tokenIcons[swapRoute[index]?.name as string]
                                            ? tokenIcons[swapRoute[index]?.name as string].src
                                            : tokens[swapRoute[index]?.name as string]?.iconUrl
                                            ? tokens[swapRoute[index]?.name as string].iconUrl
                                            : `/assets/Tokens/fallback.png`
                                        }
                                        width={"28px"}
                                        height={"28px"}
                                        onError={changeSource}
                                      />
                                    </span>
                                  </div>
                                  <div
                                    className={clsx(
                                      "relative right-[22px] ml-[5px] h-6 px-[4.5px] pt-[3px] bg-muted-100 rounded-xl font-subtitle4",
                                      props.routeDetails.isStable[idx]
                                        ? "right-[22px]"
                                        : "right-[12px]"
                                    )}
                                  >
                                    {Number(props.routeDetails.feePerc[idx]).toFixed(2)}%
                                  </div>
                                </span>
                              </div>
                              <div className="w-0.5 h-2 bg-card-500 z-50"></div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
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

export default ConfirmSwap;
