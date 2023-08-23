import Image from "next/image";
import * as React from "react";
import "animate.css";
import loadingLogo from "../../assets/icon/common/loadingLogo.svg";
import settingLogo from "../../assets/icon/common/settingLogo.svg";
import walletIcon from "../../assets/icon/common/walletIcon.svg";
import copy from "copy-to-clipboard";
import truncateMiddle from "truncate-middle";
import copyLogo from "../../assets/icon/common/copyLogo.svg";

import switchLogo from "../../assets/icon/navigation/copy.svg";
import fiatLogo from "../../assets/icon/common/fiatLogo.svg";
import nodeSelectorLogo from "../../assets/icon/common/nodeSelectorLogo.svg";
import disconnectLogo from "../../assets/icon/common/disconnectLogo.svg";
import { useAppDispatch, useAppSelector } from "../../redux/index";
import { switchWallet, walletConnection, walletDisconnection } from "../../redux/wallet/wallet";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { useRouter } from "next/router";
import Link from "next/link";

import close from "../../assets/icon/common/close-icon.svg";

import { BUY_CRYPTO } from "../../constants/localStorage";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../config/firebaseConfig";

export interface IConnectWalletBtnDeskTopProps {
  setShowFiat: React.Dispatch<React.SetStateAction<boolean>>;
  setNodeSelector: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConnectWalletBtnDeskTop(props: IConnectWalletBtnDeskTopProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const isConnectWalletLoading = useAppSelector((state) => state.walletLoading.isLoading);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const reff = React.useRef(null);
  const connectTempleWallet = () => {
    logEvent(analytics, "connect_Wallet");
    return dispatch(walletConnection());
  };
  const copyAddress = () => {
    logEvent(analytics, "copy_address", { address: userAddress });
    copy(userAddress);
    props.setShowToast(true);
    setTimeout(() => {
      props.setShowToast(false);
    }, 6000);
  };
  const disconnectUserWallet = async () => {
    setShowMenu(false);
    if (userAddress) {
      return dispatch(walletDisconnection());
    }
  };
  const switchWalletFunction = async () => {
    setShowMenu(false);
    if (userAddress) {
      logEvent(analytics, "switch_address", { address: userAddress });
      return dispatch(switchWallet());
    }
  };
  const [showMenu, setShowMenu] = React.useState(false);
  useOutsideClick(reff, () => {
    setShowMenu(false);
  });

  const handleFiat = () => {
    logEvent(analytics, "buy_tez");
    setShowMenu(false);
    props.setShowFiat(true);
  };

  const [showCryptoTooltip, setShowCryptoTooltip] = React.useState(
    localStorage.getItem(BUY_CRYPTO)
  );
  const ele = document.getElementById("animate-tooltip");
  const handleClick = () => {
    ele && ele.classList.add("tooltipAnimation");
    //setTimeout(() => {
    setShowCryptoTooltip("true");
    localStorage.setItem(BUY_CRYPTO, "true");
    //}, 800);
  };
  if (userAddress) {
    return (
      <>
        <div className="relative flex items-center" ref={reff}>
          <button
            onClick={() => {
              handleClick();
              setShowMenu((sow) => !sow);
            }}
            className="flex flex-row justify-center items-center gap-2 bg-primary-500/10 py-2 px-4 hover:bg-opacity-95 rounded-2xl border border-primary-500/30"
          >
            <Image alt={"alt"} src={walletIcon} />
            <p
              className="text-f14 "
              style={{
                textOverflow: "ellipsis",
                width: "76px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {truncateMiddle(userAddress, 4, 4, "...")}
            </p>
            {isConnectWalletLoading && <Image alt={"alt"} src={loadingLogo} className="spin" />}
            <Image alt={"alt"} src={settingLogo} />
          </button>
          {(localStorage.getItem(BUY_CRYPTO) !== "true" || showCryptoTooltip !== "true") && (
            <div
              className="gradientBorderCrypto cursor-pointer"
              id="animate-tooltip"
              onClick={() => {
                handleClick();
                setShowMenu((sow) => !sow);
              }}
            >
              <div className="innerContentCrypto w-[334px]  top-[61px] cryptoTooltip ">
                <div className="flex mr-1">
                  <div className="text-white font-subtitle4">Buy tez</div>
                  <div
                    className="ml-auto cursor-pointer relative top-[1px] "
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                  >
                    <Image src={close} alt="close" />
                  </div>
                </div>
                <div className="font-body1 text-white mt-1 ">
                  Use your card or Apple Pay to purchase tez on Plenty, powered by Wert.
                </div>
              </div>
            </div>
          )}

          {showMenu && (
            <div className="absolute w-[320px] fade-in-3  right-0 top-[55px] mt-2 border z-50 bg-primary-750 rounded-2xl border-muted-50 py-3.5 flex flex-col">
              {/* <p className="bg-primary-755 text-f14 p-4 flex gap-2">
                <span className="text-text-400">Temple wallet</span>(
                <span className="text-text-50">{truncateMiddle(userAddress, 4, 4, "...")}</span>)
              </p> */}
              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                onClick={copyAddress}
              >
                <Image alt={"alt"} src={copyLogo} />
                <span>Copy address</span>
              </p>
              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                onClick={handleFiat}
              >
                <Image alt={"alt"} src={fiatLogo} />
                <span>Buy tez with fiat</span>
              </p>
              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                onClick={switchWalletFunction}
              >
                <Image alt={"alt"} src={switchLogo} />
                <span>Switch account</span>
              </p>

              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                onClick={() => {
                  logEvent(analytics, "node_Selector");
                  props.setNodeSelector(true);
                }}
              >
                <Image alt={"alt"} src={nodeSelectorLogo} />
                <span>Node Selector</span>
              </p>
              <p>
                {router.pathname.includes("myportfolio") ? (
                  <Link className={``} href={"/swap"}>
                    <p
                      onClick={disconnectUserWallet}
                      className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                    >
                      <Image alt={"alt"} src={disconnectLogo} />
                      <span>Disconnect</span>
                    </p>
                  </Link>
                ) : (
                  <p
                    onClick={disconnectUserWallet}
                    className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                  >
                    <Image alt={"alt"} src={disconnectLogo} />
                    <span>Disconnect</span>
                  </p>
                )}
              </p>
            </div>
          )}
        </div>
      </>
    );
  }
  return (
    <div className="flex items-center">
      <button
        onClick={connectTempleWallet}
        className="bg-primary-500/5 py-2 px-4 hover:bg-opacity-95 rounded-2xl border border-primary-500/100  text-f14 "
      >
        Connect wallet
      </button>
    </div>
  );
}
