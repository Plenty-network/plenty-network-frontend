import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";
import wallet from "../../../assets/icon/pools/wallet.svg";
import stakeIcon from "../../../assets/icon/pools/stakeIcon.svg";
import boost from "../../../assets/icon/pools/boostGrey.svg";
import close from "../../../assets/icon/pools/close.svg";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";

export interface IWalletBtnWithIconProps {
  text?: string | number;
  className?: string;
  onClick?: () => void;
  tokenid?: string;
}

export function BtnWithWalletIcon(props: IWalletBtnWithIconProps) {
  return (
    <div
      className={`ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround  items-center flex px-3 "h-[48px]"`}
    >
      <div>
        <Image alt={"alt"} src={wallet} width={"32px"} height={"32px"} />
      </div>
      <div className="ml-1 flex text-primary-500 font-body2 cursor-pointer" onClick={props.onClick}>
        {!props.text ? (
          <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
        ) : (
          <span className="mr-1">{props.text}</span>
        )}
      </div>
    </div>
  );
}
export function BtnWithWalletIconEnd(props: IWalletBtnWithIconProps) {
  return (
    <ToolTip message={`LP tokens in wallet`} id="tooltip9" position={Position.top}>
      <div
        className={`cursor-pointer  ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround  items-center flex px-1 md:px-3 h-[36px]`}
      >
        {" "}
        <div>
          <Image
            alt={"alt"}
            src={wallet}
            width={isMobile ? "20px" : "22px"}
            height={isMobile ? "20px" : "22px"}
          />
        </div>
        <div
          className="ml-1 flex text-primary-500 font-caption1-small md:font-body2 cursor-pointer"
          onClick={props.onClick}
        >
          {!props.text ? (
            <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
          ) : (
            <span className="mr-1">{props.text}</span>
          )}
        </div>
      </div>
    </ToolTip>
  );
}

export function BtnwithBoost(props: IWalletBtnWithIconProps) {
  return (
    <>
      <div
        className={`ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround  items-center flex px-1 md:px-3 h-[36px] cursor-pointer`}
      >
        <ToolTip message={` #${props.tokenid} `} id="tooltip8" position={Position.top}>
          <div className="flex items-center cursor-pointer">
            <div className="relative top-1">
              <Image
                alt={"alt"}
                src={boost}
                width={isMobile ? "20px" : "22px"}
                height={isMobile ? "20px" : "22px"}
              />
            </div>
            <div className="mx-1 flex text-primary-500 font-caption1-small md:font-body2 cursor-pointer">
              {!props.text ? (
                <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <span className="mr-1">{props.text}</span>
              )}
            </div>
          </div>
        </ToolTip>
        <div onClick={props.onClick}>
          <Image alt={"alt"} src={close} width={"14px"} height={"14px"} />
        </div>
      </div>
    </>
  );
}

export function BtnWithStakeIcon(props: IWalletBtnWithIconProps) {
  return (
    <ToolTip message={`LP tokens staked in gauge`} id="tooltip9" position={Position.top}>
      <div
        className={`cursor-pointer border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] items-center flex px-3 ${props.className}`}
      >
        <div className="relative top-1">
          <Image
            alt={"alt"}
            src={stakeIcon}
            width={isMobile ? "20px" : "22px"}
            height={isMobile ? "20px" : "22px"}
          />
        </div>

        <div className="ml-1 flex text-primary-500 font-caption1-small md:font-body2">
          {!props.text ? (
            <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
          ) : (
            <span className="mr-1">{props.text}</span>
          )}
        </div>
      </div>
    </ToolTip>
  );
}

export function BtnWithUnStakeIcon(props: IWalletBtnWithIconProps) {
  return (
    <div
      className={`ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3 ${props.className}`}
    >
      <div className="relative top-1">
        <Image alt={"alt"} src={stakeIcon} width={"32px"} height={"32px"} />
      </div>
      <div className="ml-1 flex text-primary-500 font-body2 cursor-pointer" onClick={props.onClick}>
        {!props.text ? (
          <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
        ) : (
          <span className="mr-1">{props.text}</span>
        )}
      </div>
    </div>
  );
}
