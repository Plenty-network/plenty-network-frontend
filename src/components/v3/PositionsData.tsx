import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import clsx from "clsx";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { ActivePopUp } from "./ManageTabV3";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
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
      liquidity: "$2.33",
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
    <div className="overflow-x-auto ">
      <div className="flex  my-[24px] ml-10 min-w-[792px] ">
        <div className="w-[135px] text-text-250 font-body2 flex">
          Liquidity
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={<div className="w-[100px] md:w-[150px]">Instructions for airdrop</div>}
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
        <div className="w-[146px] text-text-250 font-body2 flex">
          Min/Max price
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={<div className="w-[100px] md:w-[150px]">Instructions for airdrop</div>}
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
        <div className="w-[120px] text-text-250 font-body2 flex">
          Fees Collected
          <div className="relative top-[2px] ml-1 cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={<div className="w-[100px] md:w-[150px]">Instructions for airdrop</div>}
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto swap min-w-[792px] ">
        {data.map((d, index) => {
          return (
            <div
              className={clsx(
                index % 2 === 0 ? "bg-secondary-600" : "bg-card-500",
                "flex   h-[64px] items-center pl-10 min-w-[792px]"
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
              <div
                className=" font-subtitle4 text-primary-500 text-right pr-5 w-[119px]"
                onClick={() => props.setScreen(ActivePopUp.ManageExisting)}
              >
                Manage
              </div>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
}

export default PositionsData;
