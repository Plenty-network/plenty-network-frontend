import React, { useState, useMemo } from "react";
import lockPurple from "../../../src/assets/icon/vote/lockPurple.svg";

import Image from "next/image";
import nft from "../../../src/assets/icon/vote/nft.svg";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { IConfirmLockingProps } from "./types";
import { store } from "../../redux";
import { increaseLockEnd } from "../../operations/locks";

function ConfirmLocking(props: IConfirmLockingProps) {
  const epochData = store.getState().epoch.currentEpoch;
  const closeModal = () => {
    props.setShow(false);
  };
  const dateFormat = useMemo(() => {
    var date = new Date(epochData.endTimestamp);
    return `${date.getUTCDate()}/${("0" + date.getUTCMonth()).slice(
      -2
    )}/${date.getUTCFullYear()}, ${("0" + date.getUTCHours()).slice(-2)}:${(
      "0" + date.getUTCMinutes()
    ).slice(-2)}`;
  }, [epochData.endTimestamp]);

  return (
    <>
      <div className="px-4 md:px-6 flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm locking </div>
      </div>
      <div className="mx-4 md:mx-6 rounded-lg mt-5 border border-text-800 bg-card-200 py-5">
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
          <Image src={nft} />
        </div>
        <div className="border-t mt-5 mb-2  border-text-800/[0.5]"></div>
        <div className="mt-3 px-3 md:px-5 flex items-center">
          <span className="hidden md:block flex">
            <span className="text-text-250 font-body2 mr-1">You can start voting after </span>
            <span className="relative top-0.5">
              <Image src={info} className="cursor-pointer" />
            </span>
            <span className="text-white ml-1 font-subtitle2 ">{dateFormat} UTC</span>
          </span>
          <span className="block md:hidden">
            <div className="text-text-250 font-body2 mr-1">You can start voting after </div>
            <div className="flex mt-1">
              <span className="relative -top-0.5">
                <Image src={info} className="cursor-pointer" />
              </span>
              <span className="text-white ml-1 font-subtitle2 block">{dateFormat} UTC</span>
            </div>
          </span>
          <span className="ml-auto flex rounded-lg bg-primary-500/[0.2] h-[32px] items-center px-3">
            <Image src={lockPurple} />
            <span className="font-subtitle2 text-primary-500 ml-1">{props.endDate}</span>
          </span>
        </div>
      </div>

      <div className="px-4 md:px-6 mt-[18px]">
        <Button color="primary" onClick={props.handleLockOperation}>
          Create lock
        </Button>
      </div>
    </>
  );
}

export default ConfirmLocking;
