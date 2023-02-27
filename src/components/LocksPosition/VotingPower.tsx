import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPlyLockedProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function VotingPower(props: IPlyLockedProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="text-text-50 cursor-pointer font-subtitle4 text-right">
          {Number(props.value) > 0
            ? props.value.isLessThan(0.01)
              ? "<0.01"
              : nFormatter(props.value)
            : "0"}
        </div>
      </ToolTip>
    </>
  );
}
