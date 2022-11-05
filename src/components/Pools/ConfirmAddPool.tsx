import clsx from "clsx";
import Button from "../Button/Button";
import { PopUpModal } from "../Modal/popupModal";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import ratesrefresh from "../../../src/assets/icon/swap/ratesrefresh.svg";

import add from "../../../src/assets/icon/pools/addIcon.svg";
import { useMemo, useState } from "react";
import arrow from "../../../src/assets/icon/swap/downArrow.svg";
import info from "../../../src/assets/icon/swap/info.svg";
import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import stableSwap from "../../../src/assets/icon/swap/stableswapViolet.svg";
import { tokensList } from "../../constants/tokensList";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

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
  pair: string;
}
function ConfirmAddPool(props: IConfirmSwapProps) {
  const [isConvert, setConvert] = useState(false);
  const convertRates = (e: any) => {
    e.stopPropagation();
    setConvert(!isConvert);
  };
  const closeModal = () => {
    props.setShow(false);
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
            <div className="border bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <Image alt={"alt"} src={props.tokenIn.image} height={"26px"} width={"26px"} />
                </span>
                <span className="font-title3 ml-2">
                  <span>
                    {props.tokenIn.name === "tez"
                      ? "TEZ"
                      : props.tokenIn.name === "ctez"
                      ? "CTEZ"
                      : props.tokenIn.name}
                  </span>
                </span>
              </div>
              <div className="ml-auto items-center flex font-medium2">{props.firstTokenAmount}</div>
            </div>
            <div className="flex justify-center -mt-[8px]">
              <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
            </div>
            <div className="border -mt-[7px] bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <Image alt={"alt"} src={props.tokenOut.image} height={"26px"} width={"26px"} />
                </span>
                <span className="font-title3 ml-2">
                  <span>
                    {props.tokenOut.name === "tez"
                      ? "TEZ"
                      : props.tokenOut.name === "ctez"
                      ? "CTEZ"
                      : props.tokenOut.name}
                  </span>
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
                      ? props.tokenIn.name === "tez"
                        ? "TEZ"
                        : props.tokenIn.name === "ctez"
                        ? "CTEZ"
                        : props.tokenIn.name
                      : props.tokenOut.name === "tez"
                      ? "TEZ"
                      : props.tokenOut.name === "ctez"
                      ? "CTEZ"
                      : props.tokenOut.name}{" "}
                    =
                    {!isConvert
                      ? ` ${props.routeDetails.exchangeRate?.toFixed(3)} 
                            ${
                              props.tokenOut.name === "tez"
                                ? "TEZ"
                                : props.tokenOut.name === "ctez"
                                ? "CTEZ"
                                : props.tokenOut.name
                            }`
                      : `${Number(1 / Number(props.routeDetails.exchangeRate)).toFixed(3)} ${
                          props.tokenIn.name === "tez"
                            ? "TEZ"
                            : props.tokenIn.name === "ctez"
                            ? "CTEZ"
                            : props.tokenIn.name
                        }`}
                  </span>
                  <span className="relative top-px cursor-pointer ">
                    <Image alt={"alt"} src={ratesrefresh} onClick={(e) => convertRates(e)} />
                  </span>
                </div>
                <div className="ml-auto bg-primary-500/10 px-3  cursor-pointer  text-primary-500 hover:opacity-90  font-body2 rounded-lg flex items-center h-[28px] justify-center">
                  {props.pair}
                </div>
              </>
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

export default ConfirmAddPool;
