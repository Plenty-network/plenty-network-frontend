import * as React from "react";
import Image from "next/image";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IYourLiquidityProps } from "./types";
import clsx from "clsx";
import arrow from "../../assets/icon/myPortfolio/boostBlue.svg";

export function BoostValue(props: IYourLiquidityProps) {
  return (
    <>
      <div className="">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div
            className={clsx(
              "font-body4  ",
              Number(props.value) > 0 && Number(props.value) === 2.5
                ? "text-blue-100"
                : "text-white"
            )}
          >
            {Number(props.value) > 0 ? `${props.value.toFixed(1)}x` : "-"}
            {Number(props.value) > 0 && Number(props.value) === 2.5 && (
              <ToolTip
                position={Position.top}
                toolTipChild={<div className="text-center">Max boost</div>}
              >
                <span className="relative top-1">
                  <Image alt={"alt"} src={arrow} />
                </span>
              </ToolTip>
            )}
          </div>
        </ToolTip>
      </div>
    </>
  );
}
