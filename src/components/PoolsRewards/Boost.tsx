import * as React from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IBoostProps } from "./types";

export function Boost(props: IBoostProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className="font-body4 cursor-pointer text-white">
            {Number(props.value) > 0 ? `${props.value.toFixed(1)}x` : "0"}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
