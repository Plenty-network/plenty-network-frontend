import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IRewardsDataProps } from "./types";

export function RewardsData(props: IRewardsDataProps) {
  return (
    <>
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
        <div className="flex flex-col justify-center items-center">
          <div className=" ">
            <span className="font-f13">${props.bribes.toFixed(2)}</span>
            <span className="relative top-1 ml-px">
              <Image src={dollar} width={"16px"} height={"16px"} />
            </span>
          </div>
          <div className=" ">
            <span className="font-f13">${props.fees.toFixed(2)}</span>
            <span className="relative top-1 ml-px">
              <Image src={tradingFee} width={"16px"} height={"16px"} />
            </span>
          </div>
        </div>
      </ToolTip>
    </>
  );
}
