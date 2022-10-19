import * as React from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPLYEmissionProps } from "./types";

export function PLYEmission(props: IPLYEmissionProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={props.dollar ? false : true}
          message={`$${props.dollar?.toFixed(2)}`}
        >
          <div className="font-body4  text-white">
            {Number(props.value) > 0 ? `${props.value.toFixed(2)} ` : "0"} PLY
          </div>
        </ToolTip>
      </div>
    </>
  );
}
