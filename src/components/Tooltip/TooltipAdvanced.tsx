import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";
import closeIcon from "../../assets/icon/common/closeCross.svg";
import { generateRandomString } from "../../utils/commonUtils";
import ReactTooltip from "./ReactTooltipExtends";
export enum Position {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left",
}
export enum TooltipType {
  withoutArrowsAndTitle,
  withoutTitle,
  withTitle,
  swapRoute,
  swap,
  withoutBorder,
}
export interface IToolTipProps {
  position?: Position;
  message?: string;
  id?: string;
  type?: TooltipType;
  children?: any;
  title?: string;
  toolTipChild?: any;
  classNameAncorToolTip?: string;
  isShowInnitially?: boolean;
  disable?: boolean;
  dontHideToolTip?: boolean;
  classNameToolTipContainer?: string;
}

export function ToolTip(props: IToolTipProps) {
  const randomId = generateRandomString(8);
  if (props.type === TooltipType.swapRoute) {
    return (
      <>
        <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
          {props.children}
        </a>
        <ReactTooltip
          disable={props.disable}
          showInitial={props.isShowInnitially}
          className={` tooltipCustomSwap ${props.classNameToolTipContainer}-${
            props.position ? props.position : "right"
          }`}
          arrowColor={isMobile ? "rgba(60, 60, 60,0)" : "#341E54"}
          place={props.position ? props.position : "right"}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          {props.message && <span className="font-normal">{props.message}</span>}
          {props.toolTipChild}
        </ReactTooltip>
      </>
    );
  } else if (props.type === TooltipType.withoutBorder) {
    return (
      <>
        <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
          {props.children}
        </a>
        <ReactTooltip
          disable={props.disable}
          showInitial={props.isShowInnitially}
          className={` tooltipCustomWithoutBorder ${props.classNameToolTipContainer}-${
            props.position ? props.position : "right"
          }`}
          arrowColor="rgba(60, 60, 60,0)"
          place={props.position ? props.position : "right"}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          {props.message && <span className="font-normal">{props.message}</span>}
          {props.toolTipChild}
        </ReactTooltip>
      </>
    );
  } else if (props.type === TooltipType.withoutArrowsAndTitle) {
    return (
      <>
        <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
          {props.children}
        </a>
        <ReactTooltip
          disable={props.disable}
          showInitial={props.isShowInnitially}
          className={` tooltipCustomWithoutArrow ${props.classNameToolTipContainer}-${
            props.position ? props.position : "right"
          }`}
          arrowColor="rgba(60, 60, 60,0)"
          place={props.position ? props.position : "right"}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          {props.message && <span className="font-normal">{props.message}</span>}
          {props.toolTipChild}
        </ReactTooltip>
      </>
    );
  } else if (props.type === TooltipType.withTitle) {
    return (
      <>
        <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
          {props.children}
        </a>
        <ReactTooltip
          disable={props.disable}
          showInitial={props.isShowInnitially}
          className={` tooltipCustom ${props.classNameToolTipContainer}`}
          arrowColor={isMobile ? "rgba(60, 60, 60,0)" : "#341E54"}
          place={props.position ? props.position : "right"}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          <div className="absolute right-2 top-1 cursor-pointer">
            <Image alt={"alt"} src={closeIcon} />
          </div>
          <div className="flex flex-col gap-1 mr-2   relative">
            <div className="text-f12 font-normal">{props.title}</div>
            <div className="text-f12">
              {props.message && <span className="font-normal">{props.message}</span>}
              {props.toolTipChild}
            </div>
          </div>
        </ReactTooltip>
      </>
    );
  } else if (props.type === TooltipType.swap) {
    return (
      <>
        <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
          {props.children}
        </a>
        <ReactTooltip
          disable={props.disable}
          showInitial={props.isShowInnitially}
          className={clsx(
            " tooltipCustom",
            isMobile ? "" : `playIconTooltip-${props.position ? props.position : "right"}`
          )}
          arrowColor={isMobile ? "rgba(60, 60, 60,0)" : "#341E54"}
          place={props.position ? props.position : "right"}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          {props.message && <span className="font-body1">{props.message}</span>}
          {props.toolTipChild}
        </ReactTooltip>
      </>
    );
  }

  return (
    <>
      <a className={props.classNameAncorToolTip} data-tip data-for={`tooltip_${randomId}`}>
        {props.children}
      </a>
      <ReactTooltip
        disable={props.disable}
        showInitial={props.isShowInnitially}
        className={clsx(
          " tooltipCustom",
          isMobile ? "" : `playIconTooltip-${props.position ? props.position : "right"}`
        )}
        arrowColor={isMobile ? "rgba(60, 60, 60,0)" : "#341E54"}
        place={props.position ? props.position : "right"}
        id={`tooltip_${randomId}`}
        effect="solid"
      >
        {props.message && <span className="font-body1">{props.message}</span>}
        {props.toolTipChild}
      </ReactTooltip>
    </>
  );
}
