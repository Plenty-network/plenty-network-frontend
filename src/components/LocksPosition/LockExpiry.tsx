import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { ILockExpiryProps, IPlyLockedProps } from "./types";

export function LockExpiry(props: ILockExpiryProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="text-right text-text-50 font-subtitle4">2024-08-30</div>
        <div className="text-right mt-0.5 text-text-500 font-body3">Expires in 2 years</div>
      </ToolTip>
    </>
  );
}
