import * as React from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { BigNumber } from "bignumber.js";
import { ITotalVotesProps } from "./types";

export function TotalVotes(props: ITotalVotesProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(0) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(0) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(0) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <>
      <ToolTip
        position={Position.top}
        toolTipChild={
          <div className="flex gap-1">
            <div className="text-text-50 font-body1">Total votes:</div>
            <div className="text-white font-caption2 ">{Number(props.totalvotes)}</div>
          </div>
        }
      >
        <div className="flex-1 text-right  justify-center items-center">
          <div className="font-f13 text-text-50">
            {Number(props.totalvotes) > 0
              ? props.totalvotes.isLessThan(0.01)
                ? "<" + props.totalvotes.toFixed(2)
                : Number(nFormatter(props.totalvotes))
              : "0"}
          </div>
          <div className="font-subtitle4 relative top-[10px]">
            {props.totalVotesPercentage.toFixed(2)}%
          </div>
        </div>
      </ToolTip>
    </>
  );
}
