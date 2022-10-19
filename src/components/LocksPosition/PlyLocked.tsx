import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPlyLockedProps } from "./types";

export function PlyLocked(props: IPlyLockedProps) {
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
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="text-text-50 font-subtitle4 text-right">
          {Number(props.value) > 0
            ? props.value.isLessThan(0.01)
              ? "<0.01"
              : nFormatter(props.value)
            : "0"}
        </div>
        <div className="mt-0.5 text-text-500 font-body3">PLY</div>
      </ToolTip>
    </>
  );
}
