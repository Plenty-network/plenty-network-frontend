import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";
import arrowDown from "../../assets/icon/common/arrowDown.svg";
import info from "../../assets/icon/common/infoIcon.svg";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

export interface IShortCardHeaderProps {}
export interface ITabsProps {
  isShorting?: boolean;
  toolTipChild?: any;
  isToolTipEnabled?: boolean;
  text: string | undefined | null;
  subText?: string;
  arrowUp?: "up" | "down" | undefined;
  className?: string;
  isFirstRow?: boolean;
  onClick?: Function;
  isMyVotes?: boolean;
  isVotesTable?: boolean;
  TableName: string | undefined;
  index: number;
}

export function Tabs(props: ITabsProps) {
  return (
    <th
      className={`flex cursor-pointer font-subtitle1 text-text-50 text-left  ${
        props.index === 0 ? "justify-start" : "justify-end "
      } ${
        props.TableName === "locksRewards"
          ? props.index === 0 && !isMobile
            ? "w-[220px]"
            : props.index === 1 && !isMobile
            ? "md:ml-[26px]"
            : isMobile && props.index === 0
            ? "w-[180px]"
            : isMobile && props.index === 1
            ? "w-[90px]"
            : isMobile && props.index === 2 && "ml-auto w-[100px]"
          : props.TableName === "poolsRewards"
          ? props.index === 0
            ? "w-[200px]"
            : isMobile && props.index !== 0
            ? "w-[110px]"
            : "w-[150px]"
          : props.TableName === "lockPosition"
          ? !isMobile && props.index === 0
            ? " w-[150px]"
            : !isMobile && props.index === 2
            ? "w-[164px]"
            : isMobile && props.index === 0
            ? "w-[200px]"
            : isMobile && props.index === 1
            ? "w-[90px] pr-2"
            : isMobile && props.index === 2
            ? "w-[85px]"
            : isMobile && props.index === 3
            ? "w-[100px]"
            : props.index === 1 || props.index === 5 || props.index === 6 || props.index === 4
            ? "w-[200px]"
            : " w-[130px]"
          : props.TableName === "poolsPosition"
          ? props.index === 0
            ? "w-[180px]"
            : props.index === 5
            ? "w-[200px]"
            : isMobile && props.index === 2
            ? "w-[120px] flex-1"
            : "w-[80px] md:w-[120px]"
          : props.TableName === "votesTable"
          ? props.index === 4
            ? "w-[120px] md:w-[260px]"
            : props.index === 0
            ? "w-[150px]"
            : "w-[112px]"
          : props.index === 0
          ? "w-[150px]"
          : " flex-1"
      } ${props.index === 0 && "pl-3 md:pl-0"} ${
        props.TableName === "votesTable" && props.index === 4 && !isMobile && "ml-auto"
      }`}
      onClick={() => (props.onClick ? props.onClick() : {})}
    >
      <div className="flex gap-0 flex-col">
        <div className={`flex  ${props.isFirstRow ? "justify-start" : "justify-end"} `}>
          <p
            className={clsx(
              "text-right ",
              (props.TableName === "poolsPosition" && props.index == 2) ||
                (props.TableName === "poolsRewards" && props.index === 1) ||
                (props.TableName === "poolsPosition" && isMobile && props.index === 1) ||
                (props.TableName === "lockPosition" && isMobile && props.index === 1) ||
                (props.TableName === "locksRewards" && isMobile && props.index === 2)
                ? ""
                : "flex gap-1"
            )}
          >
            {props.isToolTipEnabled &&
              ((props.TableName === "poolsPosition" && props.index == 2) ||
              (props.TableName === "poolsRewards" && props.index === 1) ||
              (props.TableName === "poolsPosition" && isMobile && props.index === 1) ||
              (props.TableName === "lockPosition" && isMobile && props.index === 1) ||
              (props.TableName === "locksRewards" && isMobile && props.index === 2) ? (
                <span className="relative top-[3px] mr-1">
                  <ToolTip
                    position={Position.top}
                    toolTipChild={<div className="text-center">{props.toolTipChild}</div>}
                  >
                    <Image alt={"alt"} src={info} />
                  </ToolTip>
                </span>
              ) : (
                <InfoIconToolTip message={props.toolTipChild} />
              ))}

            <span>{props.text}</span>
          </p>
        </div>
        {props.subText && (
          <div className="text-text-500 font-light text-right">{props.subText}</div>
        )}
      </div>
      <div className="relative top-px">
        {props.arrowUp ? (
          <div className="absolute -right-3">
            <Image
              alt={"alt"}
              src={arrowDown}
              className={props.arrowUp === "up" ? "rotate-0" : "rotate-180"}
              width={"13px"}
              height={"13px"}
            />
          </div>
        ) : (
          <div className="absolute -right-3">
            <Image src={arrowDown} className={"opacity-0"} />
          </div>
        )}
      </div>
    </th>
  );
}
