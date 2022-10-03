import dynamic from "next/dynamic";
import * as React from 'react';
import { isMobile } from "react-device-detect";

const NotificationMobile = dynamic(() => import("./Mobile"), {
  loading: () => <></>,
});
const NotificationDesktop = dynamic(() => import("./Desktop"), {
  loading: () => <></>,
});
export interface INotificationBarProps {
  onhide: Function;
}

export function NotificationBar(props: INotificationBarProps) {
     if(isMobile){
     return <NotificationMobile onhide={props.onhide}/>
     }
    return <NotificationDesktop onhide={props.onhide} />;
}
