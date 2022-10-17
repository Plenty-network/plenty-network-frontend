import Image from "next/image";
import * as React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { store, useAppSelector } from "../../redux";
import { getAllNotification } from "../Notification/notificationMessageSave";
export enum NotiFicationType {
  noNotification,
  haveNotification,
}
export interface INotificationIconProps {
  onClick: Function;
  className: string;
}

export function NotificationIcon(props: INotificationIconProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const { isLoading } = useAppSelector((state) => state.flashMessage);
  const [ringAnimate, setRingAnimate] = React.useState(false);
  const [type, setType] = React.useState(NotiFicationType.noNotification);
  const hasNotification = store.getState().wallet.hasNotification;
  const length = getAllNotification(walletAddress).length;

  React.useEffect(() => {
    const typeInnitial: NotiFicationType = getAllNotification(walletAddress).length
      ? NotiFicationType.haveNotification
      : NotiFicationType.noNotification;
    if (typeInnitial == NotiFicationType.haveNotification) {
      setRingAnimate(true);
      setTimeout(() => {
        setRingAnimate(false);
      }, 1000);
    }
    setType(typeInnitial);
  }, [isLoading, walletAddress, length]);
  return (
    <div
      className={`flex items-center ${props.className}`}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <Image
        alt={"alt"}
        className={ringAnimate ? "ringAnimate" : ""}
        src={
          type === NotiFicationType.noNotification && !hasNotification
            ? "/assets/icon/bellicon.svg"
            : "/assets/icon/bellIconWithDot.svg"
        }
        height={"26px"}
        width={"26px"}
      />
    </div>
  );
}
