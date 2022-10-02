import Image from "next/image";
import * as React from "react";
import subtractSvg from "../../../assets/icon/pools/subtract.svg";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
export interface IAprInfoProps {
  isMobile?: boolean;
  previousApr: string;
  currentApr: string;
  boostedApr: string;
}

export function AprInfo(props: IAprInfoProps) {
  return (
      <ToolTip
        position={Position.top}
        toolTipChild={
          <div className="flex flex-col gap-[7pxS] text-text-500 font-normal text-f14 p-1">
            <div>Current APR : <span className="font-semibold text-white">{props.currentApr}</span></div>
            <div>Boosted APR : <span className="font-semibold text-white">{props.previousApr}</span></div>
            <div>Previous APR : <span className="font-semibold text-white">{props.boostedApr}</span></div>
          </div>
        }
      >
        <div className={props.isMobile ? "flex gap-2 flex-col" : "flex gap-2 "}>
        <div className="bg-muted-200 border md:text-f14 text-f12 cursor-pointer text-white border-border-500 rounded-lg py-[3px] px-2 ">
          {parseInt(props.currentApr).toFixed(1)}%
        </div>
      {!props.isMobile && <Image alt={"alt"} src={subtractSvg} />}
        <div
          className={`md:text-f14 text-f12 cursor-pointer text-white py-[3px] px-2 pr-0 ${
            props.isMobile ? "flex gap-2" : ""
          }`}
        >
          {" "}
          {parseInt(props.boostedApr).toFixed(1)}%{props.isMobile && <Image src={subtractSvg} />}
        </div>
        </div>
      </ToolTip>
    
  );
}
