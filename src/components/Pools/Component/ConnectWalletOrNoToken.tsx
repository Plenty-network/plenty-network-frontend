import Image from "next/image";
import * as React from "react";
import walletNotConnected from "../../../assets/icon/pools/walletNotConnected.svg";
import noContentAvailble from "../../../assets/icon/pools/noContentAvailable.svg";

import { useAppDispatch } from "../../../redux";
import { walletConnection } from "../../../redux/wallet/wallet";
import { OutlineBtn } from "../../Button/OutlineButtonCommon";
import Link from "next/link";
import { PoolsCardHeader } from "../Cardheader";
export interface IWalletNotConnectedProps {
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
}

export function NoContentAvailable(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12 gap-5 flex-col">
      <Image alt={"alt"} src={noContentAvailble} />

      <Link href={"/pools"}>
        <div
          className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg"
          onClick={
            props.setActiveStateTab ? () => props.setActiveStateTab(PoolsCardHeader.All) : () => {}
          }
        >
          View Pools
        </div>
      </Link>
    </div>
  );
}
export function WalletNotConnected() {
  const dispatch = useAppDispatch();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12 gap-5 flex-col">
      <Image alt={"alt"} src={walletNotConnected} />
      <OutlineBtn text="Connect wallet" className="w-max" onClick={connectTempleWallet} />
    </div>
  );
}
