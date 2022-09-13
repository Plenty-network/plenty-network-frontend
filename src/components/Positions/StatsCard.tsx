import clsx from "clsx";
import Image from "next/image";
import { IStatsCardProps } from "./types";
import info from "../../assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";

function StatsCard(props: IStatsCardProps) {
  return (
    <>
      <div
        className={clsx(
          "h-[96px] py-4 px-6 border border-text-800/[0.5] flex bg-primary-150 rounded-xl",
          props.isLast ? "w-[410px]" : "w-[222px]"
        )}
      >
        <p>
          <div className="flex gap-2.5">
            <p className="text-white font-body3 ">TVL</p>
            <Image src={info} />
          </div>
          <div className="font-input-text1 text-white mt-2">$12.3 K </div>
        </p>
        <p className="ml-auto">
          {props.isLast && (
            <Button
              color={"primary"}
              height={"h-[50px]"}
              width={" w-[148px] "}
              onClick={() => props.setShowCreateLockModal(true)}
            >
              Lock Ply
            </Button>
          )}
        </p>
      </div>
    </>
  );
}

export default StatsCard;
