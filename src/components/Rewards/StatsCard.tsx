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
          "h-[96px] py-4 px-4 w-[277px] border border-text-800/[0.5] flex bg-primary-150 rounded-xl"
        )}
      >
        <p>
          <div className="flex gap-1 ">
            <Image src={info} />
            <p className="text-white font-body1 ">{props.title}</p>
          </div>
          <div className="font-input-text1 text-white mt-2 flex items-end">
            {props.value === undefined ? (
              <p className=" my-[4px] w-[60px] h-[24px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
            ) : (
              props.value?.toString()
            )}
            {props.subValue && (
              <p className="font-subtitle5 text-border-400 ml-1 mb-px">{props.subValue}</p>
            )}
          </div>
        </p>
        <p className="ml-auto">
          <div
            className="cursor-pointer flex items-center md:font-title3-bold font-subtitle4 text-primary-500  h-[50px] px-5 bg-primary-500/[0.1] rounded-xl   justify-center"
            onClick={
              !props.disable
                ? () => {
                    props.setShowClaimAllPly(true);
                  }
                : () => {}
            }
          >
            Claim
          </div>
        </p>
      </div>
    </>
  );
}

export default StatsCard;
