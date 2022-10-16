import * as React from "react";
import { AppDispatch, useAppSelector } from "../../redux";
import { getAllNotification } from "./notificationMessageSave";
import { SingleNotification } from "./SingleNotification";
import { isMobile } from "react-device-detect";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setHasNotification } from "../../redux/wallet/wallet";

export interface INotificationListProps {
  isClearNotification: boolean;
}

export function NotificationList(props: INotificationListProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  let notificationList = getAllNotification(walletAddress);

  const dispatch = useDispatch<AppDispatch>();
  React.useEffect(() => {
    notificationList = getAllNotification(walletAddress);
  }, [props.isClearNotification]);
  React.useEffect(() => {
    notificationList.length > 0 && dispatch(setHasNotification(true));
  }, [notificationList]);
  if (!notificationList.length) {
    return (
      <div className="flex-1 flex flex-col p-5 justify-center items-center">
        <div className="text-f14">You’re all caught up</div>
        <div className="text-center text-f10 ">
          This is where you’ll see notifications about your Plenty transactions
        </div>
        {isMobile && (
          <Link href={"/swap"}>
            <div className="text-primary-500 font-caption1-small mt-[18px]">Swap your assets</div>
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="overflow-y-auto">
      {notificationList.map((e) => (
        <SingleNotification key={e.currentTimeStamp} {...e} />
      ))}
    </div>
  );
}
