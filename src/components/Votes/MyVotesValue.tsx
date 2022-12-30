import * as React from "react";
import { BigNumber } from "bignumber.js";
import { IMyVotesValueProps } from "./types";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

export function MyVotesValue(props: IMyVotesValueProps) {
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
        disable={Number(props.myVotes) === 0 ? true : false}
        toolTipChild={
          <div className="flex gap-1">
            <div className="text-text-50 font-body1">My votes:</div>
            <div className="text-white font-caption2 ">{props.myVotes.toFixed(6)}</div>
          </div>
        }
      >
        <div className="flex-1 text-end cursor-pointer flex-col justify-center items-center">
          <div className=" ">
            <span className="font-f13">
              {Number(props.myVotes) > 0
                ? props.myVotes.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.myVotes)
                : "-"}
            </span>
          </div>
          <div className=" ">
            <span className="font-f13">
              {props.myVotesPercentage.toNumber() > 0
                ? props.myVotesPercentage.decimalPlaces(2, 5).toString()
                : null}
              {props.myVotesPercentage.toNumber() > 0 ? "%" : null}
            </span>
          </div>
        </div>
      </ToolTip>
    </>
  );
}
