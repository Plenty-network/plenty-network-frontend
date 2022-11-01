import * as React from "react";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import clsx from "clsx";

import info from "../../assets/icon/common/infoIcon.svg";
import ply from "../../assets/icon/myPortfolio/plyIcon.svg";

import lock from "../../assets/icon/migrate/lock-violet.svg";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IVestedPlyTopbarProps } from "./types";
import PieChartButton from "../LocksPosition/PieChart";

export function VestedPlyTopbar(props: IVestedPlyTopbarProps) {
  const remainingTime = new BigNumber(props.vestedData.nextClaim).minus(Date.now());
  const totalWaitingTime = new BigNumber(props.vestedData.nextClaim).minus(
    props.vestedData.lastClaim
  );
  const remainingPercentage = remainingTime.multipliedBy(100).dividedBy(totalWaitingTime);
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
      <div
        className={clsx(
          "ml-auto h-[94px] py-4 px-5  flex items-center bg-background-300 ",
          "w-[400px] border-b border-background-200 "
        )}
      >
        <p>
          <div className="flex gap-1 items-center">
            <Image alt={"alt"} src={ply} />

            <p className="text-white font-body3 ">Vested PLY</p>
            <p className="relative top-px">
              <ToolTip
                toolTipChild={
                  <div className="w-[200px] md:w-[280px]">{props.value.toNumber()}</div>
                }
                id="tooltip8"
              >
                <Image alt={"alt"} src={info} />
              </ToolTip>
            </p>
          </div>
          <div className="font-title1-bold text-white mt-2 flex items-end">
            {props.vestedData.claimableAmount === undefined ? (
              <p className=" my-[4px] w-[60px] h-[24px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
            ) : (
              props.vestedData?.claimableAmount?.toFixed(2)
            )}

            <p className="font-title2-normal text-border-400 ml-1 mb-px">PLY</p>
            <p className="relative top-1 ml-1">
              <Image alt={"alt"} src={lock} />
            </p>
            <p className="font-body3  text-text-250 ml-1 mb-px">
              {props.vestedData?.vestedAmount?.toFixed(2)} PLY
            </p>
          </div>
        </p>
        <p className="ml-auto">
          <div
            className={clsx(
              "h-[50px] flex items-center justify-center w-[148px] rounded-xl  font-title3-bold ",
              props.vestedData.isClaimable
                ? "bg-primary-500 text-black"
                : "bg-blue-200 text-blue-300"
            )}
            onClick={() => props.onClick(true)}
          >
            Claim
            {!props.vestedData.isClaimable && (
              <span className="ml-[6px]">
                <PieChartButton
                  violet={100 - Number(remainingPercentage)}
                  transparent={Number(remainingPercentage)}
                />
              </span>
            )}
          </div>
        </p>
      </div>
    </>
  );
}
