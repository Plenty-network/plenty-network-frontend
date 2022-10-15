import Image from "next/image";
import * as React from "react";
import wallet from "../../../assets/icon/pools/wallet.svg";
import stakeIcon from "../../../assets/icon/pools/stakeIcon.svg";
import boost from "../../../assets/icon/pools/boostGrey.svg";
import close from "../../../assets/icon/pools/close.svg";

export interface IWalletBtnWithIconProps {
  text?: string | number;
  className?: string;
  onClick?: () => void;
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
    <div
      className={`ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround  items-center flex px-3 h-[36px]`}
    >
      <div>
        <Image alt={"alt"} src={wallet} width={"22px"} height={"22px"} />
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

export function BtnwithBoost(props: IWalletBtnWithIconProps) {
  return (
    <div
      className={`ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround  items-center flex px-3 h-[36px] cursor-pointer`}
      onClick={props.onClick}
    >
      <div className="relative top-1">
        <Image alt={"alt"} src={boost} width={"22px"} height={"22px"} />
      </div>
      <div className="mx-1 flex text-primary-500 font-body2 cursor-pointer">
        {!props.text ? (
          <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
        ) : (
          <span className="mr-1">{props.text}</span>
        )}
      </div>
      <div>
        <Image alt={"alt"} src={close} width={"14px"} height={"14px"} />
      </div>
    </div>
  );
}

export function BtnWithStakeIcon(props: IWalletBtnWithIconProps) {
  return (
    <div
      className={` border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] items-center flex px-3 ${props.className}`}
    >
      <div className="relative top-1">
        <Image alt={"alt"} src={stakeIcon} width={"22px"} height={"22px"} />
      </div>
      <div className="ml-1 flex text-primary-500 font-body2">
        {!props.text ? (
          <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
        ) : (
          <span className="mr-1">{props.text}</span>
        )}
      </div>
    </div>
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
