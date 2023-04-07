import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";

import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import clsx from "clsx";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
}
function PositionsData(props: IPositionsProps) {
  const data = [
    {
      liquidity: "$2.334",
      min_price: "34/67",

      price_range: "No",
    },
    {
      liquidity: "$2.33",
      min_price: "34",

      price_range: "No",
    },
    {
      liquidity: "$2.33333333",
      min_price: "34",

      price_range: "Yes",
    },
    {
      liquidity: "$2.345",
      min_price: "34",

      price_range: "No",
    },
    {
      liquidity: "$2.312",
      min_price: "34",

      price_range: "No",
    },
    {
      liquidity: "$2.3",
      min_price: "34",

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
            <div className="w-[135px] text-white font-subtitle3 flex">{d.liquidity}</div>
            <div className="w-[146px] text-text-50 font-subtitle4 ">
              {d.min_price}
              <div className="font-body3 text-text-500">
                {tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
              </div>
            </div>
            <div className="w-[102px] text-white font-subtitle3 flex">{d.liquidity}</div>
            <div className="w-[140px]">
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
            <div className="w-[119px] flex items-center font-subtitle4 text-primary-500 ">
              Collect fees
              <span className=" h-[28px] border-r border-card-700 ml-auto"></span>
            </div>
            <div className=" font-subtitle4 text-primary-500 text-right w-[119px]">Manage</div>
          </div>
        );
      })}{" "}
    </div>
  );
}

export default PositionsData;
