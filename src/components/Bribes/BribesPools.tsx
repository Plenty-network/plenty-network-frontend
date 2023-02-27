import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IBribesPoolProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function BribesPool(props: IBribesPoolProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={props.bribesData.length === 0}
          toolTipChild={
            <div className="text-center">
              <div className="text-text-200 font-body3 text-right">Breakdown of bribes</div>
              {/* <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                <div className={`text-white font-medium pr-1 `}>
                  {props.bribesData[0] ? props.bribesData[0].value.toFixed(2) : "--"}
                </div>
                <div className="">{props.bribesData[0]?.name}</div>
              </div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 justify-end">
                <div className={`text-white font-medium pr-1`}>
                  {props.bribesData[1]?.value.toFixed(2)}
                </div>
                <div className="">{props.bribesData[1]?.name}</div>
              </div>
              {props.bribesData.length - 2 > 0 && (
                <div className={`text-white font-medium text-right pr-1`}>
                  {`+${props.bribesData.length - 2} more`}
                </div>
              )} */}
              {props.bribesData.map((data, index) => {
                return (
                  <div
                    className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end "
                    key={index}
                  >
                    <div className={`text-white font-medium pr-1 `}>{data?.value.toString()}</div>
                    <div className="">{data?.name}</div>
                  </div>
                );
              })}
            </div>
          }
        >
          <div className="font-body4 cursor-pointer text-white">
            $
            {Number(props.value) > 0
              ? props.value.isLessThan(0.01)
                ? "<0.01"
                : nFormatter(props.value)
              : "0"}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
