import clsx from "clsx";
import * as React from "react";
import close from "../../assets/icon/swap/closeIcon.svg";
import Image from "next/image";

export interface IPopUpModalProps {
  children: React.ReactNode;
  onhide?: Function;
  title?: String;
  className?: string;
  headerChild?: any;
  footerChild?: any;
  Name?: string;
}

export function PopUpModal(props: IPopUpModalProps) {
  const [isClose, setIsClose] = React.useState(false);
  const clickedInModal = (e: any) => {
    try {
      if (e.target.id === "modal_outer") {
        setIsClose(true);
        setTimeout(() => {
          props.onhide && props.onhide();
        }, 300);
      }
    } catch (e) {}
  };
  return (
    <div
      onClick={clickedInModal}
      id="modal_outer"
      className={`z-index-max fixed top-0 left-0 flex flex-col gap-2 w-screen h-screen topNavblurEffect z-50 items-center justify-center ${
        isClose ? "fade-out-3" : "fade-in-3"
      }`}
    >
      <div
        className={clsx(
          "broder relative border-popUpNotification  max-w-[460px] w-[calc(100vw_-_38px)]  bg-sideBar  rounded-3xl border flex  flex-col px-6 py-5",
          props.title === "Select Token" && "h-[576px] ",
          props.Name === "Manage" ? "py-3" : "py-5",
          props.className
        )}
      >
        <div
          className="absolute right-0 top-[23px] px-6 cursor-pointer hover:opacity-90 hover:scale-90"
          onClick={() => {
            setIsClose(true);
            setTimeout(() => {
              props.onhide && props.onhide();
            }, 280);
          }}
        >
          {/* close btn */}
          <Image src={close} />
        </div>
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
