import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useState, useMemo } from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { ILockExpiryProps, IPlyLockedProps } from "./types";
import ReactTimeAgo from "react-time-ago";

export function LockExpiry(props: ILockExpiryProps) {
  const dateFormat = useMemo(() => {
    var date = new Date(props.endTime);
    return `${date.getUTCFullYear()}-${("0" + date.getUTCMonth()).slice(-2)}-${date.getUTCDate()}`;
  }, [props.endTime]);

  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="text-right text-text-50 font-subtitle4">{dateFormat}</div>
        <div className="text-right mt-0.5 text-text-500 font-body3">
          {" "}
          {props.endTime - new Date().getTime() > 0 ? "Expires " : "Expired "}
          <ReactTimeAgo date={props.endTime} locale="en-US" />
        </div>
      </ToolTip>
    </>
  );
}
