import * as React from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IYourLiquidityProps } from "./types";

export function StakePercentage(props: IYourLiquidityProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className="font-body4 cursor-pointer text-white">
            {Number(props.value) > 0 ? `${props.value.toFixed(2)}%` : "0%"}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
