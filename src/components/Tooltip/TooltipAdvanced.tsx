import Image from 'next/image';
import * as React from 'react';
// import ReactTooltip from 'react-tooltip';

import closeIcon from '../../assets/icon/common/closeCross.svg';
import { generateRandomString } from '../../utils/commonUtils';
import  ReactTooltip from './ReactTooltipExtends';

export enum Position {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}
export enum TooltipType {
  withoutArrowsAndTitle,
  withoutTitle,
  withTitle,
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
  isShowInnitially?:boolean;
}

export function ToolTip(props: IToolTipProps) {
  const randomId = generateRandomString(8);
  if (props.type === TooltipType.withoutArrowsAndTitle) {
    return (
      <>
        <a
          className={props.classNameAncorToolTip}
          data-tip
          data-for={`tooltip_${randomId}`}
        >
          {props.children}
        </a>
        <ReactTooltip
          showInitial={props.isShowInnitially}
          className="tooltipCustom"
          arrowColor="rgba(60, 60, 60,0)"
          place={props.position ? props.position : 'right'}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          {props.message && <span className='!font-medium' >{props.message}</span>}
          {props.toolTipChild}
        </ReactTooltip>
      </>
    );
  } else if (props.type === TooltipType.withTitle) {
    return (
      <>
        <a
          className={props.classNameAncorToolTip}
          data-tip
          data-for={`tooltip_${randomId}`}
        >
          {props.children}
        </a>
        <ReactTooltip
        showInitial={props.isShowInnitially}
          className="tooltipCustom"
          arrowColor="#341E54"
          place={props.position ? props.position : 'right'}
          id={`tooltip_${randomId}`}
          effect="solid"
        >
          <div className="absolute right-2 top-1 cursor-pointer">
            <Image src={closeIcon} />
          </div>
          <div className="flex flex-col gap-1 mr-2   relative">
            <div className="text-f12 font-medium">{props.title}</div>
            <div className="text-f12">
              {props.message && <span className='!font-medium'>{props.message}</span>}
              {props.toolTipChild}
            </div>
          </div>
        </ReactTooltip>
      </>
    );
  }
  
  return (
    <>
      <a
        className={props.classNameAncorToolTip}
        data-tip
        data-for={`tooltip_${randomId}`}
      >
        {props.children}
      </a>
      <ReactTooltip
        showInitial={props.isShowInnitially}
        className="tooltipCustom"
        arrowColor="#341E54"
        place={props.position ? props.position : 'right'}
        id={`tooltip_${randomId}`}
        effect="solid"
      >
        {props.message && <span className='!font-medium'>{props.message}</span>}
        {props.toolTipChild}
      </ReactTooltip>
    </>
  );
}
