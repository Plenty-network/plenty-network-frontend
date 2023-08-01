import Image from "next/image";
import * as React from "react";
import infoIcon from "../../assets/icon/common/infoIcon.svg";
import { generateRandomString } from "../../utils/commonUtils";
import { Position, ToolTip } from "./TooltipAdvanced";

export interface IInfoIconToolTipProps {
  toolTipChild?: any;
  message?: string;
}

export function InfoIconToolTip(props: IInfoIconToolTipProps) {
  const randomId = generateRandomString(5);
  return (
    <span className="flex justify-center items-center">
      <ToolTip
        classNameAncorToolTip="pushtoCenter"
        id={`info${randomId}`}
        message={""}
        toolTipChild={
          props.toolTipChild ? (
            props.toolTipChild
          ) : (
            <div className="max-w-[180px] md:max-w-[280px] ">{props.message}</div>
          )
        }
      >
        <Image
          alt={"alt"}
          width={"14px"}
          height={"14px"}
          src={infoIcon}
          className="cursor-pointer"
        />
      </ToolTip>
    </span>
  );
}
