import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IRewardsDataProps, IVotingPowerProps } from "./types";
import light from "../../assets/icon/vote/lighting.svg";

export function VotingPower(props: IVotingPowerProps) {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className=" cursor-pointer">
            <span className="font-f13">{props.votes.toFixed(2)}</span>
            <span className="relative top-1 ml-px">
              <Image alt={"alt"} src={light} width={"16px"} height={"16px"} />
            </span>
          </div>
        </ToolTip>
        <ToolTip
          position={Position.top}
          disable={true}
          toolTipChild={<div className="text-center"></div>}
        >
          <div className=" cursor-pointer">
            <span className="font-f13">{props.percentage.toFixed(0)}%</span>
          </div>
        </ToolTip>
      </div>
    </>
  );
}
