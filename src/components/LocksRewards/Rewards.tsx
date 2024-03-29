import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IRewardsDataProps } from "./types";
import { EFeesStatus } from "../../api/portfolio/types";
import nFormatter from "../../api/util/helpers";

export function RewardsData(props: IRewardsDataProps) {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <ToolTip
          position={Position.top}
          disable={props.bribesData.length === 0 ? true : false}
          toolTipChild={
            <div className="text-center">
              <div className="text-text-200 font-body3">Breakdown of bribes</div>
              {/* <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                <div className={`text-white font-medium pr-1 `}>
                  {props.bribesData[0] ? props.bribesData[0].bribeValue.toFixed(2) : "--"}
                </div>
                <div className="">{props.bribesData[0]?.tokenSymbol}</div>
              </div>
              <div className="text-text-500 text-f14 font-normal flex gap-1 justify-end">
                <div className={`text-white font-medium pr-1`}>
                  {props.bribesData[1]?.bribeValue.toFixed(2)}
                </div>
                <div className="">{props.bribesData[1]?.tokenSymbol}</div>
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
                    <div className={`text-white font-medium pr-1 `}>
                      {data?.bribeValue.toFixed(6)}
                    </div>
                    <div className="">{data?.tokenSymbol}</div>
                  </div>
                );
              })}
            </div>
          }
        >
          <div className=" cursor-pointer ">
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
        </ToolTip>
        <ToolTip
          position={Position.top}
          toolTipChild={
            props.feesStatus === EFeesStatus.GENERATED ? (
              <div className="text-center">
                <div className="text-text-200 font-body3">Breakdown of fees</div>

                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                  <div className={`text-white font-medium pr-1 `}>
                    {props.feesData.tokenAFees.toString()}
                  </div>
                  <div className="">{props.token1Name}</div>
                </div>
                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end">
                  <div className={`text-white font-medium pr-1 `}>
                    {props.feesData.tokenBFees.toString()}
                  </div>
                  <div className="">{props.token2Name}</div>
                </div>
              </div>
            ) : (
              <div>not pulled or claimed</div>
            )
          }
        >
          <div className=" cursor-pointer">
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
