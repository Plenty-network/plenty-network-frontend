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
  columnWidth?: string | undefined;
  tableType?: boolean;
}

export function Tabs(props: ITabsProps) {
  return (
    <th
      className={`flex cursor-pointer font-subtitle1 text-text-50 text-left ${props.columnWidth} ${
        props.index === 0
          ? "justify-start"
          : props.TableName === "mybribes" && props.index !== 3
          ? "justify-start"
          : props.TableName === "positionsv3"
          ? "justify-start"
          : "justify-end "
      } ${props.tableType ? "thSticky" : ""} ${
        props.TableName === "poolsPosition" && props.index === 0 ? "pl-20 sm:pl-[40px]" : ""
      } ${props.TableName === "newPools" ? "lg:pl-[60px] pl-2 " : ""}
      `}
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
                <span className="relative top-[3px] mr-1 w-[14px] h-[14px]">
                  <ToolTip
                    position={Position.top}
                    toolTipChild={
                      <div className="text-center w-[200px] md:w-[350px]">{props.toolTipChild}</div>
                    }
                  >
                    <Image
                      alt={"alt"}
                      src={info}
                      width={"14px"}
                      height={"14px"}
                      className="cursor-pointer"
                    />
                  </ToolTip>
                </span>
              ) : (
                <InfoIconToolTip message={props.toolTipChild} />
              ))}

            <span onClick={() => (props.onClick ? props.onClick() : {})}>{props.text}</span>
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
