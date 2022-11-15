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
import { useCountdown } from "../../hooks/useCountDown";

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
  const [days, hours, minutes, seconds] = useCountdown(
    props.vestedData?.nextClaim?.isGreaterThan(0)
      ? props.vestedData?.nextClaim?.toNumber()
      : Date.now()
  );

  return (
    <>
      <div className={clsx("ml-auto h-[72px] py-4 px-5  flex items-center bg-background-200 ", "")}>
        <span className="border-r border-text-700 h-[30px] w-px mr-6"></span>
        <p>
          <div className="flex gap-1 items-center">
            <p className="relative top-px">
              <ToolTip disable={true} id="tooltip8">
                <Image alt={"alt"} src={info} />
              </ToolTip>
            </p>
            <Image alt={"alt"} src={ply} />

            <p className="text-white font-body3 ">Vested PLY</p>

            <div className="font-title1-bold text-white ml-2 flex items-end">
              {props.vestedData.claimableAmount === undefined ? (
                <p className=" my-[4px] w-[60px] h-[24px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <ToolTip
                  position={Position.top}
                  message={props.vestedData?.claimableAmount?.toFixed(6)}
                  id="tooltip9"
                >
                  {Number(props.vestedData?.claimableAmount) > 0
                    ? props.vestedData?.claimableAmount.isLessThan(0.01)
                      ? "<0.01"
                      : nFormatter(props.vestedData?.claimableAmount)
                    : "0"}
                </ToolTip>
              )}

              <p className="font-title2-normal text-border-400 ml-1 mb-px">PLY</p>
              <p className="relative top-1 ml-1">
                <Image alt={"alt"} src={lock} />
              </p>
              <p className="font-body3  text-text-250 ml-1 mb-0.5">
                <ToolTip
                  position={Position.top}
                  message={props.vestedData?.vestedAmount?.toFixed(6)}
                  id="tooltip9"
                >
                  {Number(props.vestedData?.vestedAmount) > 0
                    ? props.vestedData?.vestedAmount.isLessThan(0.01)
                      ? "<0.01"
                      : nFormatter(props.vestedData?.vestedAmount)
                    : "0"}
                  PLY{" "}
                </ToolTip>
              </p>
            </div>
          </div>
        </p>
        <p className="ml-6">
          <ToolTip
            position={Position.bottom}
            disable={props.vestedData.isClaimable}
            toolTipChild={
              <div>
                <span>{hours} h </span>:<span> {minutes} m </span>:<span> {seconds} s </span>
              </div>
            }
            id="tooltip9"
          >
            <div
              className={clsx(
                "cursor-pointer h-[50px] flex items-center justify-center w-[148px] rounded-xl  font-title3-bold ",
                props.vestedData.isClaimable
                  ? "bg-primary-500 text-black"
                  : "bg-blue-200 text-blue-300"
              )}
              onClick={
                props.plentyBal?.toNumber() >= 0 &&
                props.wrapBal?.toNumber() >= 0 &&
                props.vestedData?.isClaimable
                  ? () => props.onClick()
                  : () => {}
              }
            >
              Claim
              {!props.vestedData.isClaimable && (
                <span className="ml-[6px]">
                  <PieChartButton
                    violet={100 - Math.floor(Number(remainingPercentage))}
                    transparent={Math.floor(Number(remainingPercentage))}
                  />
                </span>
              )}
            </div>
          </ToolTip>
        </p>
      </div>
    </>
  );
}
