import Image from 'next/image';
import * as React from 'react';
export enum NotiFicationType{
    noNotification,
    haveNotification,
}
export interface INotificationIconProps {
    type:NotiFicationType,
    onClick:Function,
    className:string,
}

export function NotificationIcon (props: INotificationIconProps) {
  return (
    <div
      className={`flex items-center ${props.className}`}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <Image src={props.type===NotiFicationType.noNotification?'/assets/icon/bellicon.svg':'/assets/icon/bellIconWithDot.svg'} height={"26px"} width={"26px"} />
    </div>
  );
}
