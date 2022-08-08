import Image from 'next/image';
import * as React from 'react';
import { InfoIconToolTip } from '../Tooltip/InfoIconTooltip';
import arrowDown from '../../assets/icon/common/arrowDown.svg';

export interface IShortCardHeaderProps {}
export interface ITabsProps {
  isShorting?: boolean;
  toolTipChild?: any;
  isToolTipEnabled?: boolean;
  text: string;
  subText?: string;
  arrowUp?: 'up' | 'down' | undefined;
  className?: string;
  isFirstRow?: boolean;
}

export function Tabs(props: ITabsProps) {
  return (
    <th
      className={`flex flex-1 justify-end cursor-pointer text-f12 text-text-50 text-left ${
        props.isFirstRow ? 'justify-start' : 'justify-end'
      }`}
    >
      <div className="flex gap-0 flex-col">
        <div
          className={`flex gap-1 ${
            props.isFirstRow ? 'justify-start' : 'justify-end'
          } `}
        >
          {props.isToolTipEnabled && <InfoIconToolTip message="tooltip" />}
          {props.text}
        </div>
        {props.subText && (
          <div className="text-text-500 font-light">{props.subText}</div>
        )}
      </div>
      {props.arrowUp && (
        <Image
          src={arrowDown}
          className={props.arrowUp === 'up' ? 'rotate-0' : 'rotate-180'}
        />
      )}
    </th>
  );
}

export function VotesHeader(props: IShortCardHeaderProps) {
  return (
    <tr className="border  border-borderCommon  bg-cardBackGround flex px-5 py-3 items-center rounded-t-xl	rounded-b	">
      <Tabs text="Pools" className="justify-start" isFirstRow />
      <Tabs text="Rewards" isToolTipEnabled />
      <Tabs text="Total votes" isToolTipEnabled />
      <Tabs text="My votes" isToolTipEnabled />
    </tr>
  );
}
