import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useState, useMemo, useEffect } from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import ReactTimeAgo from "react-time-ago";
import { IEpochCol } from "./types";
import { IEpochData } from "../../api/util/types";
import { fetchEpochData } from "../../api/util/epoch";

export function EpochCol(props: IEpochCol) {
  // const [data, setData] = useState<IEpochData>({} as IEpochData);
  // useEffect(() => {
  //   fetchEpochData(props.epochNumber).then((res) => {
  //     setData(res.epochData);
  //   });
  // }, [props.epochNumber]);

  const dateFormat = (dates: number) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Decr",
    ];
    var date = new Date(dates);
    var month = date.getMonth();

    return `${("0" + date.getDate()).slice(-2)}-${monthNames[month]}-${date.getFullYear()}`;
  };
  return (
    <div className="text-right">
      <div className=" text-text-50 font-f13">
        {props.epochStart === props.epochEnd
          ? `Epoch ${props.epochStart} `
          : `Epoch ${props.epochStart} - ${props.epochEnd}`}
      </div>
      <div className=" mt-2 text-white font-subtitle4">
        {dateFormat(props.startEpoch * 1000)} to {dateFormat(props.endEpoch * 1000)}
      </div>
    </div>
  );
}
