import Image from "next/image";
import * as React from "react";
import subtractSvg from "../../../assets/icon/pools/subtract.svg";

import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import boostIcon from "../../../assets/icon/myPortfolio/boostBlue.svg";
import { BigNumber } from "bignumber.js";
export interface IAprInfoProps {
  isMobile?: boolean;
  previousApr: BigNumber;
  currentApr: BigNumber;
  boostedApr: BigNumber;
}

export function AprInfo(props: IAprInfoProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <ToolTip
      position={Position.top}
      toolTipChild={
        <div className="flex flex-col gap-[7pxS] text-text-500 font-normal text-f14 p-1">
          <div>
            Current APR :{" "}
            <span className="font-semibold text-white">{props.currentApr.toString()}</span>
          </div>
          <div>
            Boosted APR :{" "}
            <span className="font-semibold text-white">{props.previousApr.toString()}</span>
          </div>
          <div>
            Previous APR :{" "}
            <span className="font-semibold text-white">{props.boostedApr.toString()}</span>
          </div>
        </div>
      }
    >
      <div className={props.isMobile ? "flex  flex-col gap-[7px]" : "flex  items-center "}>
        <div className="bg-muted-200  md:text-f14 text-f12 cursor-pointer text-text-50 border-border-500 rounded-lg py-[3px] px-2 ">
          {nFormatter(props.currentApr)}%
        </div>
        {/* {!props.isMobile && <Image width={20} height={20} alt={"alt"} src={subtractSvg} />} */}
        <div
          className={`md:text-f14 text-f12 rounded-lg px-2 cursor-pointer border border-border-500 text-white py-[3px]  pr-0
            flex 
          `}
        >
          {" "}
          {nFormatter(props.boostedApr)}%{<Image width={20} height={20} src={boostIcon} />}
        </div>
      </div>
    </ToolTip>
  );
}
