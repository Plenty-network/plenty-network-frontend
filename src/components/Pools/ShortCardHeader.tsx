import Image from "next/image";
import * as React from "react";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import arrowDown from "../../assets/icon/common/arrowDown.svg";

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
        props.isFirstRow || props.text?.includes("Pool") ? "justify-start" : "justify-end "
      } ${
        props.TableName === "PoolsPosition"
          ? props.index === 0
            ? " w-[150px]"
            : props.index === 1 || props.index === 5 || props.index === 6
            ? "w-[200px]"
            : " w-[130px]"
          : props.isVotesTable
          ? "w-[120px] md:w-[220px]"
          : props.isFirstRow
          ? "w-[150px]"
          : "flex-1  w-[120px]"
      } `}
      onClick={() => (props.onClick ? props.onClick() : {})}
    >
      <div className="flex gap-0 flex-col">
        <div className={`flex gap-1 ${props.isFirstRow ? "justify-start" : "justify-end"} `}>
          {props.isToolTipEnabled && (
            <InfoIconToolTip message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry" />
          )}
          {props.text}
        </div>
        {props.subText && (
          <div className="text-text-500 font-light text-right">{props.subText}</div>
        )}
      </div>
      <div className="relative top-px">
        {
          props.arrowUp && (
            <div>
              <Image
                src={arrowDown}
                className={props.arrowUp === "up" ? "rotate-0" : "rotate-180"}
              />
            </div>
          )
          // : (
          //   <Image src={arrowDown} className={"opacity-0"} />
          // )
        }
      </div>
    </th>
  );
}
