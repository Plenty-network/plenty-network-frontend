import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPLYEmissionProps } from "./types";

export function Boost(props: IPLYEmissionProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className="font-body4  text-white">
            {Number(props.value) > 0 ? `${props.value.toFixed(1)}x` : "0"}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
