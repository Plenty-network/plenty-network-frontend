import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IRewardsDataProps } from "./types";
import nFormatter from "../../api/util/helpers";

export function RewardsData(props: IRewardsDataProps) {
  return (
    <>
      <div className="flex flex-col  items-end">
        <ToolTip
          position={Position.top}
          toolTipChild={
            <>
              <div className="text-center">
                <div className="text-text-200 font-body3 text-right">Breakdown of bribes</div>
                {props.bribesData.length ? (
                  props.bribesData.map((data, index) => {
                    return (
                      <div
                        className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end "
                        key={index}
                      >
                        <div className={`text-white font-medium pr-1 `}>
                          {data?.value.toString()}
                        </div>
                        <div className="">{data?.name}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-white text-f14 font-normal flex gap-1 mt-1 justify-end ">
                    --
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-text-200 font-body3 text-right">Breakdown of fees</div>
                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                  <div className={`text-white font-medium pr-1 `}>{props.fees1.toFixed(2)}</div>
                  <div className="">{props.token1Name}</div>
                </div>
                <div className="text-text-500 text-f14 font-normal flex gap-1 justify-end">
                  <div className={`text-white font-medium pr-1`}>{props.fees2.toFixed(2)}</div>
                  <div className="">{props.token2Name}</div>
                </div>
              </div>
            </>
          }
        >
          <div className="cursor-pointer text-right">
            <span className="font-f13">
              $
              {Number(props.bribes) > 0
                ? props.bribes.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.bribes)
                : "0.00"}
            </span>
            <span className="relative top-1 ml-px">
              <Image alt={"alt"} src={dollar} width={"16px"} height={"16px"} />
            </span>
          </div>

          <div className="text-right ">
            <span className="font-f13">${props.fees.toFixed(2)}</span>
            <span className="relative top-1 ml-px">
              <Image alt={"alt"} src={tradingFee} width={"16px"} height={"16px"} />
            </span>
          </div>
        </ToolTip>
      </div>
    </>
  );
}
