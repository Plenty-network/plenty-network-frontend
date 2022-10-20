import * as React from "react";
import { IEpochCol } from "./types";

export function EpochCol(props: IEpochCol) {
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
      "Dec",
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
