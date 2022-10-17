import dynamic from "next/dynamic";
import * as React from "react";
import { isMobile } from "react-device-detect";

const NotificationMobile = dynamic(() => import("./Mobile"), {
  loading: () => <></>,
});
const NotificationDesktop = dynamic(() => import("./desktop"), {
  loading: () => <></>,
});
export interface INotificationBarProps {
  onhide: Function;
  isBanner: boolean;
}

export function NotificationBar(props: INotificationBarProps) {
  if (isMobile) {
    return <NotificationMobile onhide={props.onhide} isBanner={props.isBanner} />;
  }
  return <NotificationDesktop onhide={props.onhide} isBanner={props.isBanner} />;
}
