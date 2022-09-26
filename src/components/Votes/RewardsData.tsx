import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IRewardsDataProps } from "./types";

export function RewardsData(props: IRewardsDataProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(0) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(0) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(0) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <ToolTip
          position={Position.top}
          disable={props.bribesData.length === 0 ? true : false}
          toolTipChild={
            <div className="text-center">
              <div className="text-text-200 font-body3">Breakdown of bribes</div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                <div className={`text-white font-medium pr-1 `}>
                  {props.bribesData[0]?.value.toFixed(2)}
                </div>
                <div className="">{props.bribesData[0]?.name}</div>
              </div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 justify-end">
                <div className={`text-white font-medium pr-1`}>
                  {props.bribesData[1]?.value.toFixed(2)}
                </div>
                <div className="">{props.bribesData[1]?.name}</div>
              </div>
            </div>
          }
        >
          <div className=" ">
            <span className="font-f13">
              $
              {Number(props.bribes) > 0
                ? props.bribes.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.bribes)
                : "0.00"}
            </span>
            <span className="relative top-1 ml-px">
              <Image src={dollar} width={"16px"} height={"16px"} />
            </span>
          </div>
        </ToolTip>
        <ToolTip
          position={Position.top}
          toolTipChild={
            <div className="text-center">
              <div className="text-text-200 font-body3">Breakdown of fees</div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                <div className={`text-white font-medium pr-1 `}>{props.fees1.toFixed(2)}</div>
                <div className="">{props.token1Name}</div>
              </div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 justify-end">
                <div className={`text-white font-medium pr-1`}>{props.fees2.toFixed(2)}</div>
                <div className="">{props.token2Name}</div>
              </div>
            </div>
          }
        >
          <div className=" ">
            <span className="font-f13">${props.fees.toFixed(2)}</span>
            <span className="relative top-1 ml-px">
              <Image src={tradingFee} width={"16px"} height={"16px"} />
            </span>
          </div>
        </ToolTip>
      </div>
    </>
  );
}
