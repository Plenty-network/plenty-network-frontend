import * as React from "react";
import { BigNumber } from "bignumber.js";
import { IMyVotesValueProps } from "./types";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import nFormatter from "../../api/util/helpers";

export function MyVotesValue(props: IMyVotesValueProps) {
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
