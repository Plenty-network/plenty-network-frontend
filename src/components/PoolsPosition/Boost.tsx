import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import Image from "next/image";
import arrow from "../../assets/icon/myPortfolio/boostArrow.svg";
import { IBoostProps } from "./types";

export function Boost(props: IBoostProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="flex">
          <div className="text-blue-100 font-body4 mr-0.5">1.00x</div>
          <Image src={arrow} />
        </div>
      </ToolTip>
    </>
  );
}
