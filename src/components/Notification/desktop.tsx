import * as React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { setHasNotification } from "../../redux/wallet/wallet";
import { NotificationList } from "./NotificationList";
import { removeAllNotification } from "./notificationMessageSave";

export interface INotificationBarProps {
  onhide: Function;
}

export default function NotificationBar(props: INotificationBarProps) {
  const [isClose, setIsClose] = React.useState(false);
  const [isClearNotification, setClearNotification] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const clickedInModal = (e: any) => {
    try {
      if (e.target.id === "modal_outer") {
        closeModalFunction();
      }
    } catch (e) {}
  };
  const closeModalFunction = () => {
    setIsClose(true);
    setTimeout(() => {
      props.onhide && props.onhide();
    }, 300);
  };
  const clearNotification = () => {
    setTimeout(() => {
      dispatch(setHasNotification(false));
      setClearNotification((currentState) => !currentState);
    }, 500);
    removeAllNotification();
  };
  return (
    <div
      onClick={clickedInModal}
      id="modal_outer"
      className={`fixed z-50 w-screen h-screen   ${isClose ? "fade-out-3" : "fade-in-3"}`}
    >
      <div className="notificationShadow absolute top-[96px] right-[14.6rem]">
        <div
          className="   relative 
       w-[364px] 
       h-[544px] 
       bg-primary-900
       rounded-[8px]
       flex 
       flex-col
       max-w-[460px]

       "
        >
          <div className="notificationShadow absolute bg-popUpNotificationHeader z-10 rotate-45 w-8 h-8 right-[13px] -top-[2px]"></div>
          <div className="bg-popUpNotificationHeader h-[44px] rounded-t-[4px] z-20 flex justify-between font-semibold items-center px-4 !py-[13px] text-f14">
            <p>Notification</p>
            <p onClick={clearNotification} className="cursor-pointer font-body1">
              Clear
            </p>
          </div>
          {/*  */}
          <NotificationList isClearNotification={isClearNotification} />
        </div>
      </div>
    </div>
  );
}
