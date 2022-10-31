import * as React from "react";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import light from "../../assets/icon/vote/lighting.svg";
import Button from "../Button/Button";
import clsx from "clsx";

import info from "../../assets/icon/common/infoIcon.svg";
import ply from "../../assets/icon/myPortfolio/plyIcon.svg";

import lock from "../../assets/icon/migrate/lock-violet.svg";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IVestedPlyTopbarProps } from "./types";

export function VestedPlyTopbar(props: IVestedPlyTopbarProps) {
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
        className={clsx("h-[96px] py-4 px-5  flex items-center bg-background-300 ", "w-[400px] ")}
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
            {props.value === undefined || props.isLoading ? (
              <p className=" my-[4px] w-[60px] h-[24px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
            ) : (
              props.value?.toString()
            )}

            <p className="font-title2-normal text-border-400 ml-1 mb-px">PLY</p>
            <p className="relative top-1 ml-1">
              <Image alt={"alt"} src={lock} />
            </p>
            <p className="font-body3  text-text-250 ml-1 mb-px">15.4 PLY</p>
          </div>
        </p>
        <p className="ml-auto">
          <Button
            color={"primary"}
            height={"h-[50px]"}
            width={" w-[148px] "}
            borderRadius={"rounded-xl"}
            onClick={() => props.onClick()}
          >
            Claim
          </Button>
        </p>
      </div>
    </>
  );
}
