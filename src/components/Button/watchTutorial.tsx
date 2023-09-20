import * as React from "react";
import info from "../../assets/icon/poolsv3/buttonWatchVideo.svg";
import Image from "next/image";

export interface IOutlineBtnProps {
  onClick: Function;
}

export function WatchTutorial(props: IOutlineBtnProps) {
  return (
    <div
      onClick={() => props.onClick()}
      className={`flex items-center w-[180px] justify-center bg-primary-500/[0.1] h-[38px] text-center  text-primary-500  rounded-lg	font-title3 px-2 cursor-pointer `}
    >
      Watch Tutorial
      <span className="pl-2 relative top-0.5">
        <Image src={info} />
      </span>
    </div>
  );
}
