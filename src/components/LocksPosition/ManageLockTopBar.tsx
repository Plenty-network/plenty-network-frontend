import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { ILockExpiryProps, IPlyLockedProps } from "./types";
import Image from "next/image";
import veNFT from "../../assets/icon/myPortfolio/veNFT.svg";
import info from "../../assets/icon/common/infoIcon.svg";
import link from "../../assets/icon/myPortfolio/link.svg";

export function TopBar(props: ILockExpiryProps) {
  return (
    <>
      <div className="bg-card-800 px-6 py-3 mt-3 overflow-x-auto manage">
        <div className=" flex items-center">
          <div className="cursor-pointer">
            <Image src={info} />
          </div>
          <div className="text-white font-body2 relative -top-0.5 ml-1">My Lock</div>
        </div>

        <div className="flex gap-2 mt-2 min-w-[521px]">
          <p className="border border-text-800 bg-card-900 flex  pl-4 items-center h-16 w-[156px] rounded-lg">
            <p>
              <Image src={veNFT} />
            </p>
            <p className="ml-2">
              <div className="text-white font-subtitle3">#6748783</div>
              <div className="flex mt-0.5">
                <p className="font-subtitle1 text-text-500 mr-1">vePLY</p>
                <Image src={link} />
              </div>
            </p>
          </p>
          <p className="border h-16 border-text-800 bg-card-900    items-center w-[121px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">Voting power</div>
            <div className="text-primary-500 font-body4 mt-0.5">3.48</div>
          </p>
          <p className="border border-text-800 bg-card-900    items-center h-16 w-[108px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">PLY locked</div>
            <div className="text-primary-500 font-body4 mt-0.5">120 PLY</div>
          </p>
          <p className="border border-text-800 bg-card-900    items-center h-16 w-[122px] pl-4 rounded-lg">
            <div className="text-text-500 font-body2 mt-3">Expires on</div>
            <div className="text-primary-500 font-body4 mt-0.5">2024-08-30</div>
          </p>
        </div>
      </div>
    </>
  );
}
