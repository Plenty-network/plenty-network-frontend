import clsx from "clsx";
import Image from "next/image";
import { IStatsCardProps } from "./types";
import info from "../../assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";

import { isMobile } from "react-device-detect";
import ply from "../../assets/icon/myPortfolio/plyIcon.svg";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

function StatsCard(props: IStatsCardProps) {
  return (
    <>
      <div
        className={clsx(
          "h-[96px] py-4 px-5 border border-text-800/[0.5] flex items-center bg-primary-150 rounded-xl",
          props.isLast ? "w-[410px] " : "w-[222px] "
        )}
      >
        <p>
          <div className="flex gap-1">
            {props.isLast && <Image alt={"alt"} src={ply} />}
            {!props.isLast && (
              <p className="relative -top-px">
                <ToolTip
                  toolTipChild={
                    <div className="w-[200px] md:w-[280px]">{props.toolTipMessage}</div>
                  }
                  id="tooltip8"
                  position={isMobile ? Position.right : Position.top}
                >
                  <Image alt={"alt"} src={info} className="cursor-pointer" />
                </ToolTip>
              </p>
            )}
            <p className="text-white font-body3 ">{props.title}</p>
          </div>
          <div className="font-input-text1 text-white mt-2 flex items-end">
            {props.value === undefined || props.isLoading ? (
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
          {props.isLast && (
            <Button
              color={"primary"}
              height={"h-[50px]"}
              width={" w-[148px] "}
              borderRadius={"rounded-xl"}
              onClick={() => props.setShowCreateLockModal(true)}
            >
              Create lock
            </Button>
          )}
        </p>
      </div>
    </>
  );
}

export default StatsCard;
