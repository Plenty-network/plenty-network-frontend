import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IBribeColProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function BribeValue(props: IBribeColProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          message={`$ ${props.valuePerEpoch}
              per Epoch`}
        >
          <div className="font-body4 cursor-pointer text-white">
            $
            {Number(props.value) > 0
              ? props.value.isLessThan(0.01)
                ? "<0.01"
                : nFormatter(props.value)
              : "0"}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
