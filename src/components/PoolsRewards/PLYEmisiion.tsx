import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPLYEmissionProps } from "./types";

export function PLYEmission(props: IPLYEmissionProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className="font-body4  text-white">
            {Number(props.value) > 0 ? `${props.value.toFixed(2)} ` : "0"} PLY
          </div>
        </ToolTip>
      </div>
    </>
  );
}
