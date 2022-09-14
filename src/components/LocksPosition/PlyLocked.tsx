import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IPlyLockedProps } from "./types";

export function PlyLocked(props: IPlyLockedProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="text-text-50 font-subtitle4">250</div>
        <div className="mt-0.5 text-text-500 font-body3">PLY</div>
      </ToolTip>
    </>
  );
}
