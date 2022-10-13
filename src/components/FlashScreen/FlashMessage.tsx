import type { NextPage } from "next";
import info from "../../assets/icon/common/info.svg";
import epclose from "../../assets/icon/common/epclose.svg";
import openInNewTab from "../../assets/icon/common/openInNewTab.svg";
import Image from "next/image";
import { Flashtype, IFlashMessageProps } from "./index";
import { useEffect, useState } from "react";

export interface IInfoProps extends IFlashMessageProps {
  imageSrc: any;
}

export function Flash(props: IInfoProps) {
  const [stateWidth, setStateWidth] = useState(0);
  const handleClick = () => {
    if (props.onClick) props.onClick();
  };
  const TIME_TO_DIE = props.duration;
  const SMOOTHNESS = 80;
  const step = 359 / SMOOTHNESS;
  useEffect(() => {
    let currentTime = TIME_TO_DIE / 10;
    const interval = setInterval(() => {
      currentTime += currentTime;
      setStateWidth((o) => {
        if (o > 359) {
          clearInterval(interval);
        }
        return o + step;
      });
    }, TIME_TO_DIE / SMOOTHNESS);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const bgColor = () => {
    if (props.flashType === Flashtype.Info) {
      return "bg-info-500/20";
    }
    if (props.flashType === Flashtype.QuestionMark) {
      return "bg-info-500/10";
    }
    if (props.flashType === Flashtype.Rejected) {
      return "bg-error-500/20";
    }
    if (props.flashType === Flashtype.Success) {
      return "bg-success-500/20";
    }
    if (props.flashType === Flashtype.Warning) {
      return "bg-warning-500/20";
    }
    return "bg-info-500/20";
  };
  const height = props.onClick ? "h-[112px]" : "h-[88px]";
  return (
    <div
      className={`w-[359px] slide-top relative flex bg-primary-255 border overflow-hidden border-primary-256 rounded-xl font-normal z-index-max-pro ${height} ${props.className} `}
    >
      <div className={`${bgColor()} w-12 flex justify-center ${height}`}>
        <Image height={30} width={30} src={props.imageSrc} />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-[4px] pr-[56px] font-normal text-f12 leading-4">
        <div className="flex gap-[4px]">
          <span>{props.headerText}</span>
          <span className="text-text-238 text-f10 leading-[14px]">now</span>
        </div>
        <div className="text-f14 font-semibold text-[#F3F2F3]">{props.trailingText}</div>
        {props.onClick && (
          <div className="flex gap-2.5 items-center mt-1 cursor-pointer" onClick={handleClick}>
            <span className="text-f12 leading-4 text-primary-500 font-semibold ">
              {props.linkText}
            </span>
            <Image height={12} width={12} src={openInNewTab} />
          </div>
        )}
      </div>
      <div
        className="absolute right-4 top-4 cursor-pointer hover:opacity-95"
        onClick={() => props.onCloseClick()}
      >
        <Image height={24} width={24} src={epclose} />
      </div>
      <div className="w-[359px] absolute bottom-0 h-[3px] bg-primary-500/10">
        <div className="bg-primary-401  h-[3px] " style={{ width: stateWidth + "px" }}></div>
      </div>
    </div>
  );
}
