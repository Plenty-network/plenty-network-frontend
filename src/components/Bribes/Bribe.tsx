import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IBribeColProps } from "./types";

export function BribeValue(props: IBribeColProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          message={`$ ${props.valuePerEpoch}
              per Epoch`}
        >
          <div className="font-body4  text-white">
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
