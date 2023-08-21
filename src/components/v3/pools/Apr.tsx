import Image from "next/image";
import * as React from "react";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import boostIcon from "../../../assets/icon/myPortfolio/boostBlue.svg";
import { BigNumber } from "bignumber.js";
import nFormatter, { nFormatterWithLesserNumber } from "../../../api/util/helpers";
export interface IAprInfoProps {
  isMobile?: boolean;

  currentApr: number;
}

export function Apr(props: IAprInfoProps) {
  return (
    <ToolTip
      position={Position.top}
      toolTipChild={
        <div className="flex flex-col gap-[7pxS] text-text-500 font-normal text-f14 p-1">
          <div>
            Current APR :{" "}
            <span className="font-semibold text-white">{props.currentApr.toFixed(2)}%</span>
          </div>
          {/* <div>
            Boosted APR :{" "}
            <span className="font-semibold text-white">{props.boostedApr.toFixed(2)}%</span>
          </div> */}
        </div>
      }
    >
      <div
        className={
          props.isMobile
            ? "flex  flex-col cursor-pointer gap-[7px]"
            : "flex  items-center cursor-pointer"
        }
      >
        <div className="bg-muted-200  md:text-f14 text-f12 cursor-pointer text-text-50 border-border-500 rounded-lg py-[3px] px-2 ">
          {nFormatterWithLesserNumber(new BigNumber(props.currentApr))}%
        </div>
        {/* {!props.isMobile && <Image width={20} height={20} alt={"alt"} src={subtractSvg} />} */}
        {/* <div
          className={`md:text-f14 text-f12 rounded-lg px-2 cursor-pointer border border-border-500 text-white py-[3px]  pr-0
            flex 
          `}
        >
          {" "}
          {nFormatter(props.boostedApr)}%{<Image width={20} height={20} src={boostIcon} />}
        </div> */}
      </div>
    </ToolTip>
  );
}
