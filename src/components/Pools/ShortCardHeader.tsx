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
}

export function Tabs(props: ITabsProps) {
  return (
    <th
      className={`flex cursor-pointer font-subtitle1 text-text-50 text-left -mr-[13px] ${
        props.isFirstRow ? "justify-start" : "justify-end"
      } ${
        props.isVotesTable
          ? "w-[120px] md:w-[250px]"
          : props.isFirstRow
          ? "w-[150px]"
          : "flex-1  w-[120px]"
      }`}
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
      {props.arrowUp ? (
        <div>
          <Image src={arrowDown} className={props.arrowUp === "up" ? "rotate-0" : "rotate-180"} />
        </div>
      ) : (
        <Image src={arrowDown} className={"opacity-0"} />
      )}
    </th>
  );
}
