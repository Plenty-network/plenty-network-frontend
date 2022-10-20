import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IVoteShare } from "./types";

export function VoteShare(props: IVoteShare) {
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
        disable={Number(props.value) === 0 ? true : false}
        toolTipChild={
          <div className="flex gap-1">
            <div className="text-text-50 font-body1">Votes:</div>
            <div className="text-white font-caption2 ">{props.value.toString()}</div>
          </div>
        }
      >
        <div className="flex-1 text-end flex-col justify-center items-center">
          <div className=" ">
            <span className="font-f13">
              {props.percentage.toNumber() > 0
                ? props.percentage.decimalPlaces(2, 5).toString()
                : null}
              {props.percentage.toNumber() > 0 ? "%" : null}
            </span>
          </div>
          <div className=" ">
            <span className="font-f13">
              {Number(props.value) > 0
                ? props.value.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.value)
                : "-"}
            </span>
          </div>
        </div>
      </ToolTip>
    </>
  );
}
