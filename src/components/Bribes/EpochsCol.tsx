import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useState, useMemo } from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import ReactTimeAgo from "react-time-ago";

export function EpochCol() {
  // const dateFormat = useMemo(() => {
  //   var date = new Date(props.endTime);
  //   return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${(
  //     "0" + date.getUTCDate()
  //   ).slice(-2)}`;
  // }, [props.endTime]);

  return (
    <div className="text-right">
      <div className=" text-text-50 font-f13">Epoch 23 - 25</div>
      <div className=" mt-2 text-white font-subtitle4">25-Aug-2022 to 15-Sep-2022 </div>
    </div>
  );
}
