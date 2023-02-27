import Image from "next/image";
import * as React from "react";
import copyLogo from "../../assets/icon/common/copyLogo.svg";
import disconnectLogo from "../../assets/icon/common/disconnectLogo.svg";
import fiatLogo from "../../assets/icon/common/fiatLogo.svg";

import "animate.css";
import copy from "copy-to-clipboard";
import truncateMiddle from "truncate-middle";
import mobileConnectWallet from "../../assets/icon/common/mobileConnectWallet.svg";
import nodeSelectorLogo from "../../assets/icon/common/nodeSelectorLogo.svg";
import { store, useAppDispatch, useAppSelector } from "../../redux/index";
import { switchWallet, walletConnection, walletDisconnection } from "../../redux/wallet/wallet";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { MobileEpoch } from "../Epoch/MobileEpoch";

import close from "../../assets/icon/swap/closeIcon.svg";
import switchLogo from "../../assets/icon/navigation/copy.svg";
import clsx from "clsx";
import WertWidgetPopup from "../Wert";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { BUY_CRYPTO } from "../../constants/localStorage";
import ReactTooltip from "react-tooltip";

export interface IConnectWalletBtnMobileProps {
  setNodeSelector: React.Dispatch<React.SetStateAction<boolean>>;
  isBanner: boolean;
  setShowFiat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConnectWalletBtnMobile(props: IConnectWalletBtnMobileProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useAppDispatch();
  const reff = React.useRef(null);
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
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
      return dispatch(switchWallet());
    }
  };
  const [showMenu, setShowMenu] = React.useState(false);
  useOutsideClick(reff, () => {
    setShowMenu(false);
  });

  const handleFiat = () => {
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
    //}, 200);
  };
  const copyAddress = () => {
    copy(userAddress);
    props.setShowToast(true);
    setTimeout(() => {
      props.setShowToast(false);
    }, 6000);
  };
  if (userAddress) {
    return (
      <>
        <div className="relative flex" ref={reff}>
          <Image
            src={mobileConnectWallet}
            onClick={() => {
              ReactTooltip.hide();
              setShowMenu((sow) => !sow);
            }}
          />

          {(localStorage.getItem(BUY_CRYPTO) !== "true" || showCryptoTooltip !== "true") && (
            <div
              className="w-[335.5px] gradientBorderCrypto"
              id="animate-tooltip"
              onClick={() => {
                handleClick();
                setShowMenu((sow) => !sow);
              }}
            >
              <div className="w-[334px] absolute cryptoTooltip">
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
            <div
              className={clsx(
                "absolute w-[320px]  right-0 mt-2 border z-50 bg-primary-750 rounded-2xl border-muted-50 py-3.5 flex flex-col",
                props.isBanner ? "top-[52px]" : ""
              )}
            >
              {/* <p className="bg-primary-755 text-f14 p-4 flex gap-2">
              <span className="text-text-400">Temple wallet</span>(
              <span
                className="text-text-50"
                style={{
                  textOverflow: "ellipsis",
                  width: "68px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {truncateMiddle(userAddress, 4, 4, "...")}
              </span>
              )
            </p> */}
              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
                onClick={copyAddress}
              >
                <Image alt={"alt"} src={copyLogo} />
                <span>Copy address</span>
              </p>
              <p
                className="flex gap-2 px-4  py-4 hover:bg-primary-755 cursor-pointer  text-white text-f14"
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
                onClick={() => props.setNodeSelector(true)}
              >
                <Image alt={"alt"} src={nodeSelectorLogo} />
                <span>Node Selector</span>
              </p>

              <p
                onClick={disconnectUserWallet}
                className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14 z-50"
              >
                <Image alt={"alt"} src={disconnectLogo} />
                <span>Disconnect</span>
              </p>
            </div>
          )}
        </div>
      </>
    );
  }
  return (
    <div className="flex flex-col justify-center">
      <button
        onClick={() => connectTempleWallet()}
        className="bg-primary-500/5 px-[12px] py-[6.5px] hover:bg-opacity-95 rounded-md border text-primary-500 border-primary-500/100"
      >
        Connect
      </button>
    </div>
  );
}
