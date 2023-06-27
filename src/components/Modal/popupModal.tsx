import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import close from "../../assets/icon/swap/closeIcon.svg";

export interface IPopUpModalProps {
  children: React.ReactNode;
  onhide?: Function;
  title?: String;
  className?: string;
  headerChild?: any;
  footerChild?: any;
  Name?: string;
  noGlassEffect?: boolean;
  isAnimteToLoader?: boolean;
  isFullSizeOnMobile?: boolean;
}
const TIME_TO_CLOSE = 300;
const TIME_TO_TRANSACTION_CLOSE = 600;
export function PopUpModal(props: IPopUpModalProps) {
  const [isClose, setIsClose] = React.useState(false);
  const currentTimeToClose = props.isAnimteToLoader ? TIME_TO_TRANSACTION_CLOSE : TIME_TO_CLOSE;
  const clickedInModal = (e: any) => {
    try {
      if (e.target.id === "modal_outer" && props.Name !== "disclaimer") {
        setIsClose(true);
        setTimeout(() => {
          props.onhide && props.onhide();
        }, currentTimeToClose);
      }
    } catch (e) {}
  };
  return (
    <div
      onClick={clickedInModal}
      id="modal_outer"
      className={`z-index-max fixed top-0 left-0 flex flex-col gap-2 w-screen h-screen  z-50 items-center justify-center   ${
        isClose ? "fade-out-3" : "fade-in-3"
      }
      
      ${props.isAnimteToLoader && isClose ? "scale-out-tr" : "topNavblurEffect"}
      `}
    >
      <div
        id="popuploadermain"
        className={clsx(
          "broder  relative border-popUpNotification  max-w-[460px]  bg-sideBar   border flex  flex-col   py-5",
          props.title === "Select Token" && "h-[576px] ",
          props.Name === "Manage" ? "px-0 py-3" : "py-5 px-3 md:px-5",
          props.Name === "video"
            ? "md:w-max"
            : props.isFullSizeOnMobile
            ? "w-full md:w-[calc(100vw_-_38px)]"
            : "w-[calc(100vw_-_38px)]",
          props.Name === "addBribes" ? "rounded-3xl" : "rounded-3xl",
          props.className
        )}
      >
        {props.Name !== "disclaimer" && (
          <div
            className={clsx(
              "absolute right-0  px-6 cursor-pointer hover:opacity-90 hover:scale-90",
              props.Name === "newposition"
                ? "top-[28px]"
                : props.Name === "positions"
                ? "top-[26px]"
                : "top-[23px]"
            )}
            onClick={() => {
              setIsClose(true);
              //setTimeout(() => {
              props.onhide && props.onhide();
              // }, currentTimeToClose);
            }}
          >
            {/* close btn */}
            <Image alt={"alt"} src={close} />
          </div>
        )}
        {props.headerChild && <div className="font-title3">{props.headerChild}</div>}
        {props.title && <div className="font-title3">{props.title}</div>}
        {props.title === "Confirm" && (
          <div className="border-t mt-5 border-text-800/[0.5] relative -left-[22px] w-[455px]"></div>
        )}
        {props.children}
      </div>
      {props.footerChild}
    </div>
  );
}
