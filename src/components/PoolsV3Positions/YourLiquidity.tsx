import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IYourLiquidityProps } from "./types";
import nFormatter, { nFormatterWithLesserNumber } from "../../api/util/helpers";

export function YourLiquidity(props: IYourLiquidityProps) {
  return (
    <>
      <div className="">
        <ToolTip
          id="tooltipj"
          position={Position.top}
          toolTipChild={
            <>
              {" "}
              <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end ">
                <div className={`text-white font-medium pr-1 `}>
                  {nFormatterWithLesserNumber(props.liquidity.x)}
                </div>
                <div className="">{props.tokenA}</div>
              </div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end ">
                <div className={`text-white font-medium pr-1 `}>
                  {nFormatterWithLesserNumber(props.liquidity.y)}
                </div>
                <div className="">{props.tokenB}</div>
              </div>
            </>
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
