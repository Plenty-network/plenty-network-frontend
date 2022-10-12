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
          <div>
            Current APR : <span className="font-semibold text-white">{props.currentApr}</span>
          </div>
          <div>
            Boosted APR : <span className="font-semibold text-white">{props.previousApr}</span>
          </div>
          <div>
            Previous APR : <span className="font-semibold text-white">{props.boostedApr}</span>
          </div>
        </div>
      }
    >
      <div className={props.isMobile ? "flex  flex-col gap-[7px]" : "flex  items-center "}>
        <div className="bg-muted-200  md:text-f14 text-f12 cursor-pointer text-text-50 border-border-500 rounded-lg py-[3px] px-2 ">
          {parseInt(props.currentApr).toFixed(1)}%
        </div>
        {/* {!props.isMobile && <Image width={20} height={20} alt={"alt"} src={subtractSvg} />} */}
        <div
          className={`md:text-f14 text-f12 rounded-lg px-2 cursor-pointer border border-border-500 text-white py-[3px]  pr-0
            flex 
          `}
        >
          {" "}
          {parseInt(props.boostedApr).toFixed(1)}%
          {<Image width={20} height={20} src={subtractSvg} />}
        </div>
      </div>
    </ToolTip>
  );
}
