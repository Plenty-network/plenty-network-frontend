import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { ILocksColumnProps } from "./types";
import Image from "next/image";
import veNFT from "../../assets/icon/myPortfolio/veNFT.svg";

import link from "../../assets/icon/myPortfolio/link.svg";

export function LocksCloumn(props: ILocksColumnProps) {
  return (
    <>
      <ToolTip
        position={Position.top}
        disable={true}
        toolTipChild={<div className="flex gap-1"></div>}
      >
        <div className="flex cursor-pointer justify-center items-center">
          <p>
            <Image
              height={"44px"}
              width={"30px"}
              alt={"alt"}
              src={props.thumbnailUri.length > 0 ? props.thumbnailUri : veNFT}
            />
          </p>
          <p className="ml-2">
            <div className="text-white font-subtitle3 text-left">#{Number(props.id)}</div>
            <a href={`https://objkt.com/asset/plenty-venfts/${props.id.toString()}`} target="_blank" rel="noreferrer" className="">
              <div className="flex mt-0.5">
                <p className="font-subtitle1 text-text-500 mr-1">veNFT</p>
                <Image alt={"alt"} src={link} />
              </div>
            </a>
          </p>
        </div>
      </ToolTip>
    </>
  );
}
