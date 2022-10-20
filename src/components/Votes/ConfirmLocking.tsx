import React, { useState, useMemo } from "react";
import lockPurple from "../../../src/assets/icon/vote/lockPurple.svg";

import Image from "next/image";
import nft from "../../../src/assets/icon/vote/nft.svg";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { IConfirmLockingProps } from "./types";
import { store, useAppSelector } from "../../redux";
import clsx from "clsx";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

function ConfirmLocking(props: IConfirmLockingProps) {
  // const epochData = store.getState().epoch.currentEpoch;
  const epochData = useAppSelector((state) => state.epoch.currentEpoch);
  const closeModal = () => {
    props.setShow(false);
  };
  // const dateFormat = useMemo(() => {
  //   var date = new Date(epochData.endTimestamp);
  //   return `${("0" + date.getUTCDate()).slice(-2)}/${("0" + (date.getUTCMonth() + 1)).slice(
  //     -2
  //   )}/${date.getUTCFullYear()}, ${("0" + date.getUTCHours()).slice(-2)}:${(
  //     "0" + date.getUTCMinutes()
  //   ).slice(-2)}`;
  // }, [epochData.endTimestamp]);
  const dateFormat = useMemo(() => {
    var date = epochData ? new Date(epochData.endTimestamp) : new Date();
    return `${("0" + date.getUTCDate()).slice(-2)}/${("0" + (date.getUTCMonth() + 1)).slice(
      -2
    )}/${date.getUTCFullYear()}, ${("0" + date.getUTCHours()).slice(-2)}:${(
      "0" + date.getUTCMinutes()
    ).slice(-2)}`;
  }, [epochData]);

  return (
    <>
      <div className="px-4 md:px-5 flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm locking </div>
      </div>
      <div className="mx-5  rounded-lg mt-3 border border-text-800 bg-card-200 py-5">
        <div className="flex items-center">
          <div className="text-text-250 font-subtitle1 md:font-subtitle3 px-3 md:px-5">
            Your will receive a veNFT with a voting power of{" "}
          </div>
          <div className="ml-auto font-title2 text-primary-500 px-3 md:px-5">
            {props.votingPower.toFixed(2)}
          </div>
        </div>
        <div className="border-t mt-2 mb-5 border-text-800/[0.5]"></div>
        <div className="flex justify-center">
          <Image alt={"alt"} src={nft} />
        </div>
        <div className="border-t mt-5 mb-2  border-text-800/[0.5]"></div>
        <div className={clsx("mt-3 px-3 md:px-5 flex items-center")}>
          <span className={clsx(" flex", props.ctaText ? "hidden" : "hidden md:block")}>
            <span className="text-text-250 font-body2 mr-1">You can start voting after </span>
            <span className="relative top-0.5">
              <ToolTip
                id="tooltip2"
                position={Position.top}
                toolTipChild={
                  <div className="w-[150px]">
                    New locks are required to wait until the end of the present epoch to vote.
                  </div>
                }
              >
                <Image alt={"alt"} src={info} className="cursor-pointer" />
              </ToolTip>
            </span>
            <span className="text-white ml-1 font-subtitle2 ">{dateFormat} UTC</span>
          </span>
          <span className={clsx("", props.ctaText ? "hidden" : "block md:hidden")}>
            <div className="text-text-250 font-body2 mr-1">You can start voting after </div>
            <div className="flex mt-1">
              <span className="relative -top-0.5">
                <ToolTip
                  id="tooltip2"
                  position={Position.top}
                  toolTipChild={
                    <div className="w-[150px]">
                      New locks are required to wait until the end of the present epoch to vote.
                    </div>
                  }
                >
                  <Image alt={"alt"} src={info} className="cursor-pointer" />
                </ToolTip>
              </span>
              <span className="text-white ml-1 font-subtitle2 block">{dateFormat} UTC</span>
            </div>
          </span>
          <span className="ml-auto flex rounded-lg bg-primary-500/[0.2] h-[32px] items-center px-3">
            <Image alt={"alt"} src={lockPurple} />
            <span className="font-subtitle2 text-primary-500 ml-1">{props.endDate}</span>
          </span>
        </div>
      </div>

      <div className="px-4 md:px-5 mt-[18px]">
        <Button color="primary" onClick={props.handleLockOperation}>
          {props.ctaText ? props.ctaText : "Create lock"}
        </Button>
      </div>
    </>
  );
}

export default ConfirmLocking;
