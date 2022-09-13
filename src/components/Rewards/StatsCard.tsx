import clsx from "clsx";
import Image from "next/image";
import { IStatsCardProps } from "./types";
import info from "../../assets/icon/common/infoIcon.svg";

import claim from "../../assets/icon/myPortfolio/claim.svg";
import Button from "../Button/Button";

function StatsCard(props: IStatsCardProps) {
  return (
    <>
      <div
        className={clsx(
          "h-[96px] py-4 px-6 border border-text-800/[0.5] flex bg-primary-150 rounded-xl"
        )}
      >
        <p>
          <div className="flex gap-2.5">
            <p className="text-white font-body3 ">{props.title}</p>
            <Image src={info} />
          </div>
          <div className="font-input-text1 text-white mt-2">
            {props.value}{" "}
            {props.subValue && (
              <span className="font-subtitle5 text-border-400">{props.subValue}</span>
            )}
          </div>
        </p>
        <p className="ml-5">
          <Image src={claim} />
        </p>
      </div>
    </>
  );
}

export default StatsCard;
