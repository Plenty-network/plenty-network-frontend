import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import "animate.css";
import plentyIcon from "../../assets/icon/common/plentyLogo.svg";
import myportfolionav from "../../assets/icon/myPortfolio/myportfolionav.svg";
import { store, useAppSelector } from "../../redux";
import { ConnectWalletBtnDeskTop } from "../Button/ConnectWalletDesktop";
import { Epoch } from "../Epoch";
import { NotificationIcon } from "../NotificationIcon";
export interface ITopNavBarProps {
  setShowNotification: Function;
  setShowFiat: React.Dispatch<React.SetStateAction<boolean>>;
  isBanner: boolean;
  isLanding: boolean;
  isBribes: boolean;
  setNodeSelector: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
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
      <Image alt={"alt"} src={`/assets/icon/${props.image}`} height={"26px"} width={"26px"} />
    </div>
  );
}

export function TopNavBar(props: ITopNavBarProps) {
  // const userAddress = store.getState().wallet.address;
  const userAddress = useAppSelector((state) => state.wallet.address);
  //const isBanner = store.getState().walletLoading.isBanner;
  const router = useRouter();

  return (
    <>
      <nav
        className={clsx(
          "hidden  md:flex border-b border-border-500/50 w-screen fixed h-16 items-center shadow   pr-4 pl-0 topNavblurEffect z-50",
          props.isBanner ? "top-[38px]" : ""
        )}
      >
        <div className="h-full w-[240px] border-border-500/50 border-r flex items-center pl-[22px]">
          {!props.isBribes ? (
            <Link href={"/"}>
              <Image className="cursor-pointer" alt={"alt"} src={plentyIcon} />
            </Link>
          ) : (
            <Image className="" alt={"alt"} src={plentyIcon} />
          )}
        </div>
        {!props.isLanding && (
          <div className="flex justify-between flex-1 h-full">
            {!router.pathname.includes("swap") && !router.pathname.includes("migrate") && <Epoch />}
            <div className="ml-auto flex flex-row gap-7 ">
              <div className="flex items-center flex-row gap-3.5 ">
                {userAddress && !props.isBribes && (
                  <Link className={`cursor-pointer  `} href={"/myportfolio"}>
                    <div className="gradientBorder">
                      <div className="innerContent cursor-pointer  flex items-center border border-primary-750 bg-primary-850 px-[14px] h-[44px] rounded-xl mt-[10px]">
                        <Image alt={"alt"} src={myportfolionav} />
                        <span className="text-blue-500 font-body4 ml-1">My portfolio</span>
                      </div>
                    </div>
                  </Link>
                )}
                {userAddress && !props.isBribes && (
                  <div className="my-1 flex items-center">
                    <IconBTN image={"verticalline.svg"} />
                  </div>
                )}
                {userAddress && (
                  <NotificationIcon
                    className="cursor-pointer hover:opacity-90"
                    onClick={props.setShowNotification}
                  />
                )}
              </div>
              <ConnectWalletBtnDeskTop
                setNodeSelector={props.setNodeSelector}
                setShowFiat={props.setShowFiat}
                setShowToast={props.setShowToast}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
