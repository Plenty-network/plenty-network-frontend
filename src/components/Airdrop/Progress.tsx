import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";

import info from "../../../src/assets/icon/common/infoIcon.svg";
export interface IProgress {}

function Progress(props: IProgress) {
  return (
    <>
      <div className="flex gap-2 px-5">
        <p className="h-[6px] bg-info-300 w-[105px]"></p>
        <p className="h-[6px] bg-info-300 w-[105px]"></p>
        <p className="h-[6px] bg-info-300 w-[105px]"></p>
        <p className="h-[6px] bg-info-300 w-[105px]"></p>
        <p className="h-[6px] bg-info-300 w-[105px]"></p>
      </div>
      <div className="flex mt-3 px-5">
        <p className="font-subtitle3">
          <span className="relative top-[2px] mr-1.5">
            <Image alt={"alt"} src={info} />
          </span>
          Your progress
        </p>
        <p className="ml-auto text-primary-500 font-subtitle4">(0%)</p>
      </div>
    </>
  );
}

export default Progress;
