import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import plentyIcon from "../../assets/icon/common/plentyIcon.svg";
import portfolio from "../../assets/icon/common/portfolio-mobile.svg";
import { store } from "../../redux";
import { ConnectWalletBtnMobile } from "../Button/ConnectWalletMobile";
import { NotificationIcon } from "../NotificationIcon";

export interface ITopNavBarMobileProps {
  setShowNotification: Function;
  isBribes: boolean;
  setNodeSelector: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TopNavBarMobile(props: ITopNavBarMobileProps) {
  const userAddress = store.getState().wallet.address;
  return (
    <div className="flex fixed w-screen bottomNavBarMobile px-5 h-[61px] justify-between border-b border-b-borderColor">
      <Link href={"/"}>
        <Image src={plentyIcon} height={"22.47px"} width="100%" />
      </Link>
      {!props.isBribes && (
        <div className="flex gap-3">
          {userAddress && (
            <Link href={"/myportfolio"}>
              <Image src={portfolio} />
            </Link>
          )}
          <NotificationIcon
            className="cursor-pointer hover:opacity-90"
            onClick={props.setShowNotification}
          />
          <ConnectWalletBtnMobile setNodeSelector={props.setNodeSelector} />
        </div>
      )}
    </div>
  );
}
