import * as React from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { BigNumber } from "bignumber.js";
import { ITotalVotesProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function TotalVotes(props: ITotalVotesProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        toolTipChild={
          <div className="flex gap-1">
            <div className="text-text-50 font-body1">Total votes:</div>
            <div className="text-white font-caption2 ">{props.totalvotes.toFixed(6)}</div>
          </div>
        }
      >
        <div className="flex-1 cursor-pointer text-right  justify-center items-center">
          <div className="font-f13 text-text-50">
            {Number(props.totalvotes) > 0
              ? props.totalvotes.isLessThan(0.01)
                ? "<0.01"
                : nFormatter(props.totalvotes)
              : "0"}
          </div>
          <div className="font-subtitle4 relative top-[10px]">
            {props.totalVotesPercentage.decimalPlaces(2, 5).toString()}%
          </div>
        </div>
      </ToolTip>
    </>
  );
}
