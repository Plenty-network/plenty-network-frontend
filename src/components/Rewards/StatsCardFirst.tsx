import clsx from "clsx";
import Image from "next/image";
import { IStatsCardProps } from "./types";
import info from "../../assets/icon/common/infoIcon.svg";

import claim from "../../assets/icon/myPortfolio/claim.svg";
import Button from "../Button/Button";

function StatsCardFirst(props: IStatsCardProps) {
  return (
    <>
      <div
        className={clsx(
          "h-[96px] py-4 px-6 border border-text-800/[0.5] flex bg-primary-150 rounded-xl"
        )}
      >
        <p>
          <div className="flex gap-2.5">
            <p className="text-white font-body3 ">Gauge emissions</p>
            <Image src={info} />
          </div>
          <div className="font-input-text1 text-white mt-2">
            488 <span className="font-subtitle5 text-border-400">PLY</span>
          </div>
        </p>
        <p className="border-r border-border-300 h-[40px] mt-3 mx-5"></p>
        <p>
          <div className="flex gap-2.5">
            <p className="text-white font-body3 ">Trading fees</p>
            <Image src={info} />
          </div>
          <div className="font-input-text1 text-white mt-2">$488 </div>
        </p>
        <p className="ml-5">
          <Image src={claim} />
        </p>
      </div>
    </>
  );
}

export default StatsCardFirst;
