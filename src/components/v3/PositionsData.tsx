import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";

import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import clsx from "clsx";

interface IPositionsProps {}
function PositionsData(props: IPositionsProps) {
  const data = [
    {
      liquidity: "$2.334",
      min_price: "34",
      max_price: "67",
      price_range: "No",
    },
    {
      liquidity: "$2.33",
      min_price: "34",
      max_price: "67",
      price_range: "No",
    },
    {
      liquidity: "$2.33333333",
      min_price: "34",
      max_price: "67",
      price_range: "Yes",
    },
    {
      liquidity: "$2.345",
      min_price: "34",
      max_price: "67",
      price_range: "No",
    },
    {
      liquidity: "$2.312",
      min_price: "34",
      max_price: "67",
      price_range: "No",
    },
    {
      liquidity: "$2.3",
      min_price: "34",
      max_price: "67",
      price_range: "Yes",
    },
  ];
  return (
    <div className="h-[300px] overflow-y-auto">
      {data.map((d, index) => {
        return (
          <div
            className={clsx(
              index % 2 === 0 ? "bg-secondary-600" : "bg-card-500",
              "flex   h-[64px] items-center pl-10"
            )}
          >
            <div className="w-[152px] text-white font-subtitle3 flex">{d.liquidity}</div>
            <div className="w-[152px] text-text-50 font-subtitle4 ">
              {d.liquidity}
              <div className="font-body3 text-text-500">CTEZ per XTZ</div>
            </div>
            <div className="w-[152px] text-text-50 font-subtitle4">
              {d.liquidity}
              <div className="font-body3 text-text-500">CTEZ per XTZ</div>
            </div>
            <div className="w-[172px]">
              {d.price_range === "Yes" ? (
                <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
                  <Image src={infoOrange} />
                  Out of range
                </span>
              ) : (
                <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
                  <Image src={infoGreen} />
                  In Range
                </div>
              )}
            </div>

            <div className=" font-subtitle4 text-primary-500 ">Manage</div>
          </div>
        );
      })}{" "}
    </div>
  );
}

export default PositionsData;
