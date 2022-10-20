import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import plentyIcon from "../../assets/icon/common/plentyIcon.svg";
import portfolio from "../../assets/icon/common/portfolio-mobile.svg";
import { store } from "../../redux";
import { ConnectWalletBtnMobile } from "../Button/ConnectWalletMobile";
import { NotificationIcon } from "../NotificationIcon";
import "animate.css";
import clsx from "clsx";

export interface ITopNavBarMobileProps {
  setShowNotification: Function;
  isBribes: boolean;
  isBanner: boolean;
  setNodeSelector: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TopNavBarMobile(props: ITopNavBarMobileProps) {
  const userAddress = store.getState().wallet.address;
  //const isBanner = store.getState().walletLoading.isBanner;
  return (
    <div
      className={clsx(
        "flex fixed  w-screen bottomNavBarMobile px-5 h-[61px] justify-between border-b border-b-borderColor z-50",
        props.isBanner ? "top-[38px]" : "animate__animated animate__fadeInUp animate__faster"
      )}
    >
      {!props.isBribes ? (
        <Link href={"/"}>
          <Image src={plentyIcon} height={"22.47px"} width="100%" />
        </Link>
      ) : (
        <Image src={plentyIcon} height={"60px"} width="100%" />
      )}

      {!props.isBribes && (
        <div className="flex gap-3">
          {userAddress && (
            <Link href={"/myportfolio"}>
              <Image src={portfolio} />
            </Link>
          )}
          {userAddress && (
            <NotificationIcon
              className="cursor-pointer hover:opacity-90"
              onClick={props.setShowNotification}
            />
          )}
          <ConnectWalletBtnMobile
            setNodeSelector={props.setNodeSelector}
            isBanner={props.isBanner}
          />
        </div>
      )}
    </div>
  );
}
