import Image from "next/image";
import * as React from "react";
import { ConnectWalletBtnDeskTop } from "../Button/ConnectWalletDesktop";
import myPostion from "../../assets/icon/common/myPosition.svg";
import plentyIcon from "../../assets/icon/common/plentyIcon.svg";
import { Epoch } from "../Epoch";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { NotificationIcon, NotiFicationType } from "../NotificationIcon";
export interface ITopNavBarProps {
  setShowNotification: Function;
}
export interface IIconBTNProps {
  onClick?: Function;
  image: string;
  className?: string;
}

export function IconBTN(props: IIconBTNProps) {
  return (
    <div
      className={`flex items-center ${props.className}`}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <Image src={`/assets/icon/${props.image}`} height={"26px"} width={"26px"} />
    </div>
  );
}

export function TopNavBar(props: ITopNavBarProps) {
  const [selectedDropDown, setSelectedDropDown] = useState("");
  return (
    <nav className="hidden md:flex border-b border-border-500/50 w-screen fixed h-16 items-center shadow   px-10 pl-0 topNavblurEffect z-50">
      <div className="h-full w-[240px] border-border-500/50 border-r flex items-center pl-[26px]">
        <Image src={plentyIcon} />
      </div>
      <div className="flex justify-between flex-1 h-full">
        <Epoch />
        <div className="flex flex-row gap-7 ">
          <div className="flex flex-row gap-3.5 ">
            <Link className={`cursor-pointer hover:opacity-90 `} href={"/MyPortfolio"}>
              <Image src={myPostion} className="cursor-pointer hover:opacity-90" />
            </Link>
            <div className="my-1 flex items-center">
              <IconBTN image={"verticalline.svg"} />
            </div>
            <NotificationIcon
              className="cursor-pointer hover:opacity-90"
              type={NotiFicationType.haveNotification}
              onClick={props.setShowNotification}
            />
          </div>
          <ConnectWalletBtnDeskTop />
        </div>
      </div>
    </nav>
  );
}
