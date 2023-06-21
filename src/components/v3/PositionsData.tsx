import Image from "next/image";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useEffect, useMemo, useRef, useState } from "react";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import clsx from "clsx";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { ActivePopUp } from "./ManageTabV3";
import { getPositions, getPositionsAll } from "../../api/v3/positions";
import { useAppSelector } from "../../redux";
import { IV3PositionObject } from "../../api/v3/types";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
}
function PositionsData(props: IPositionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [data, setData] = useState<IV3PositionObject[] | undefined>([]);
  useEffect(() => {
    if (
      Object.keys(tokenPrice).length !== 0 &&
      Object.prototype.hasOwnProperty.call(props.tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(props.tokenOut, "symbol")
    ) {
      setIsLoading(true);
      getPositions(
        props.tokenIn.symbol,
        props.tokenOut.symbol,
        "0.05",
        walletAddress,
        tokenPrice
      ).then((res) => {
        console.log("positions", res);
        setData(res);
        setIsLoading(false);
      });

      /*       getPositionsAll(walletAddress, tokenPrice).then((res) => {
        console.log("positions all", res);
      }); */
    }
  }, [props.tokenIn.symbol, props.tokenOut.symbol, Object.keys(tokenPrice).length]);
  return (
    <div className="overflow-x-auto ">
      <div className="flex  my-[24px] ml-8 min-w-[792px] ">
        <div className="w-[125px] text-text-250 font-body2 flex">
          Liquidity
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={
                <div className="w-[100px] md:w-[150px]">Total value locked in the position</div>
              }
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
        <div className="w-[166px] text-text-250 font-body2 flex">
          Min/Max price
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={
                <div className="w-[100px] md:w-[150px]">
                  Lower and upper price boundaries of the position
                </div>
              }
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
        <div className="w-[130px] text-text-250 font-body2 flex">
          Fees Collected
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={
                <div className="w-[100px] md:w-[150px]">Fees accrued by the position</div>
              }
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto swap min-w-[792px] ">
        {!isLoading && data
          ? data.map((d, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    index % 2 === 0 ? "bg-secondary-600" : "bg-card-500",
                    "flex   h-[64px] items-center pl-10 min-w-[792px]"
                  )}
                >
                  <div className="w-[125px] text-white font-subtitle3 flex">
                    {" "}
                    <ToolTip
                      id="tooltipj"
                      position={Position.top}
                      toolTipChild={
                        <>
                          {" "}
                          <div
                            className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end "
                            key={index}
                          >
                            <div className={`text-white font-medium pr-1 `}>
                              {nFormatterWithLesserNumber(d.liquidity.x)}
                            </div>
                            <div className="">{props.tokenIn.name}</div>
                          </div>
                          <div
                            className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end "
                            key={index}
                          >
                            <div className={`text-white font-medium pr-1 `}>
                              {nFormatterWithLesserNumber(d.liquidity.y)}
                            </div>
                            <div className="">{props.tokenOut.name}</div>
                          </div>
                        </>
                      }
                    >
                      ${nFormatterWithLesserNumber(d.liquidityDollar)}{" "}
                    </ToolTip>
                  </div>

                  <div className="w-[166px] text-text-50 font-subtitle4 ">
                    {nFormatterWithLesserNumber(d.minPrice)} /{" "}
                    {d.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber(d.maxPrice)}
                    <div className="font-body3 text-text-500">
                      {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                      {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                    </div>
                  </div>
                  <div className="w-[112px] text-white font-subtitle3 flex">
                    ${nFormatterWithLesserNumber(d.feesDollar)}
                  </div>
                  <div className="w-[160px]">
                    {!d.isInRange ? (
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
                  <div className="w-[110px] flex items-center font-subtitle4 text-primary-500 ">
                    Collect fees
                    <span className=" h-[28px] border-r border-card-700 ml-auto"></span>
                  </div>
                  <div
                    className=" font-subtitle4 text-primary-500 text-right pr-2 w-[100px] cursor-pointer"
                    onClick={() => props.setScreen(ActivePopUp.ManageExisting)}
                  >
                    Manage
                  </div>
                </div>
              );
            })
          : Array(4)
              .fill(1)
              .map((_, i) => (
                <div
                  key={`simmerEffect_${i}`}
                  className={` border border-borderCommon h-16 bg-secondary-600 flex px-5 mx-3 py-3 items-center justify-between rounded-lg animate-pulse-table mt-2`}
                ></div>
              ))}{" "}
      </div>
    </div>
  );
}

export default PositionsData;
