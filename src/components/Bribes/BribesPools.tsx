import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IBribesPoolProps } from "./types";

export function BribesPool(props: IBribesPoolProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={props.bribesData.length === 0}
          toolTipChild={
            <div className="text-center">
              <div className="text-text-200 font-body3">Breakdown of bribes</div>
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
