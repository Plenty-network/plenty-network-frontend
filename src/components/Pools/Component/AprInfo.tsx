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
    <div className={props.isMobile ? "flex gap-2 flex-col" : "flex gap-2 "}>
      <ToolTip
        position={Position.top}
        toolTipChild={
          <p>
            Previous week: <span className="font-semibold">{props.previousApr}</span>
          </p>
        }
      >
        <div className="bg-muted-200 border md:text-f14 text-f12 cursor-pointer text-white border-border-500 rounded-lg py-[3px] px-2 ">
          {parseInt(props.currentApr).toFixed(1)}%
        </div>
      </ToolTip>
      {!props.isMobile && <Image src={subtractSvg} />}
      <ToolTip
        toolTipChild={
          <p>
            Previous week: <span className="font-semibold">{props.previousApr}</span>
          </p>
        }
        position={Position.top}
      >
        <div
          className={`md:text-f14 text-f12 cursor-pointer text-white py-[3px] px-2 pr-0 ${
            props.isMobile ? "flex gap-2" : ""
          }`}
        > {parseInt(props.boostedApr).toFixed(1)}%{props.isMobile && <Image src={subtractSvg} />}
        </div>
      </ToolTip>
    </div>
  );
}
