import Image from "next/image";
import * as React from "react";
import copyLogo from "../../assets/icon/common/copyLogo.svg";
import disconnectLogo from "../../assets/icon/common/disconnectLogo.svg";
import fiatLogo from "../../assets/icon/common/fiatLogo.svg";

import copy from "copy-to-clipboard";
import truncateMiddle from "truncate-middle";
import mobileConnectWallet from "../../assets/icon/common/mobileConnectWallet.svg";
import nodeSelectorLogo from "../../assets/icon/common/nodeSelectorLogo.svg";
import { useAppDispatch, useAppSelector } from "../../redux/index";
import { switchWallet, walletConnection, walletDisconnection } from "../../redux/wallet/wallet";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { MobileEpoch } from "../Epoch/MobileEpoch";

import switchLogo from "../../assets/icon/navigation/copy.svg";

export interface IConnectWalletBtnMobileProps {}

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
  if (userAddress) {
    return (
      <div className="relative flex" ref={reff}>
        <Image
          src={mobileConnectWallet}
          onClick={() => {
            setShowMenu((sow) => !sow);
          }}
        />
        {showMenu && (
          <div className="absolute w-[320px] right-0 mt-2 border z-50 bg-primary-750 rounded-2xl border-muted-50 py-3.5 flex flex-col">
            <p className="bg-primary-755 text-f14 p-4 flex gap-2">
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
            </p>
            <p
              className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-not-allowed text-white text-f14"
              onClick={() => copy(userAddress)}
            >
              <Image src={copyLogo} />
              <span>Copy address</span>
            </p>
            <p className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-not-allowed text-white text-f14">
              <Image src={fiatLogo} />
              <span>Fiat</span>
            </p>
            <p
              className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
              onClick={switchWalletFunction}
            >
              <Image src={switchLogo} />
              <span>Switch account</span>
            </p>

            <p className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-not-allowed text-white text-f14">
              <Image src={nodeSelectorLogo} />
              <span>Node Selector</span>
            </p>

            <p
              onClick={disconnectUserWallet}
              className="flex gap-2 px-4  py-4 hover:bg-primary-755  cursor-pointer text-white text-f14"
            >
              <Image src={disconnectLogo} />
              <span>Disconnect</span>
            </p>

            <MobileEpoch />
          </div>
        )}
      </div>
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
