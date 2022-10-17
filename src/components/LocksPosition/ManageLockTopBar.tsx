import * as React from "react";
import { BigNumber } from "bignumber.js";

import { useState, useMemo } from "react";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { ILockExpiryProps, IPlyLockedProps, ITopBar } from "./types";
import Image from "next/image";
import veNFT from "../../assets/icon/myPortfolio/veNFT.svg";
import info from "../../assets/icon/common/infoIcon.svg";
import link from "../../assets/icon/myPortfolio/link.svg";

export function TopBar(props: ITopBar) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(0) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(0) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(0) + "K";
    }

    return num.toFixed(2);
  }
  const dateFormat = useMemo(() => {
    var date = new Date(props.manageData.endTimeStamp);
    return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${(
      "0" + date.getUTCDate()
    ).slice(-2)}`;
  }, [props.manageData.endTimeStamp]);
  return (
    <>
      <div className="bg-card-800 px-6 py-3 mt-3 overflow-x-auto md:overflow-x-none manage">
        <div className=" flex items-center">
          <div className="cursor-pointer relative -top-px">
            <ToolTip
              toolTipChild={
                <div className="w-[200px]">
                  Modify your lock by increasing the underlying PLY or extending the locking period.
                </div>
              }
              id="tooltip8"
              position={Position.bottom}
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
          <div className="text-white font-body2 relative -top-0.5 ml-1">My Lock</div>
        </div>

        <div className="flex gap-2 mt-2  min-w-[521px] sm:min-w-full">
          <p className="border border-text-800 bg-card-900 flex  pl-4 items-center h-16 w-[156px] rounded-lg">
            <p>
              <Image alt={"alt"} src={veNFT} />
            </p>
            <p className="ml-2">
              <div className="text-white font-subtitle3">#{Number(props.manageData.tokenId)}</div>
              <div className="flex mt-0.5">
                <p className="font-subtitle1 text-text-500 mr-1">veNFT</p>
                <Image alt={"alt"} src={link} />
              </div>
            </p>
          </p>
          <p className="border h-16 border-text-800 bg-card-900    items-center w-[121px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">Voting power</div>
            <div className="text-primary-500 font-body4 mt-0.5">
              {Number(props.manageData.currentVotingPower) > 0
                ? props.manageData.currentVotingPower.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.manageData.currentVotingPower)
                : "0"}
            </div>
          </p>
          <p className="border border-text-800 bg-card-900    items-center h-16 w-[108px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">PLY locked</div>
            <div className="text-primary-500 font-body4 mt-0.5">
              {Number(props.manageData.baseValue) > 0
                ? props.manageData.baseValue.isLessThan(0.01)
                  ? "<0.01"
                  : nFormatter(props.manageData.baseValue)
                : "0"}{" "}
              PLY
            </div>
          </p>
          <p className="border border-text-800 bg-card-900    items-center h-16 w-[122px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">Expires on</div>
            <div className="text-primary-500 font-body4 mt-0.5">{dateFormat}</div>
          </p>
        </div>
      </div>
    </>
  );
}
