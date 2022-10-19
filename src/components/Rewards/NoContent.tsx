import * as React from "react";

import Link from "next/link";
import { BribesCardHeader } from "../Bribes/BribesHeader";
export interface IWalletNotConnectedProps {
  h1: string;
  subText?: string;
  cta: string;
  setActiveStateTab?: React.Dispatch<React.SetStateAction<string>>;
}
export interface IBribesProps {
  h1: string;
  subText?: string;
  cta: string;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
}

export function NoPoolsPosition(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      {props.h1}
      {props.subText && <div className="text-text-500 font-body3 mt-2">{props.subText}</div>}
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div className="cursor-pointer">
        <Link href={props.cta.includes("pools") ? "/pools" : "/vote"}>
          <div className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg">
            {props.cta}
          </div>
        </Link>
      </div>
    </div>
  );
}

export function NoBribesPosition(props: IBribesProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      {props.h1}
      {props.subText && <div className="text-text-500 font-body3 mt-2">{props.subText}</div>}
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div
        className="cursor-pointer"
        onClick={() => props.setActiveStateTab(BribesCardHeader.Pools)}
      >
        <div className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg">
          {props.cta}
        </div>
      </div>
    </div>
  );
}
