import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IYourLiquidityProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function YourLiquidity(props: IYourLiquidityProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
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
