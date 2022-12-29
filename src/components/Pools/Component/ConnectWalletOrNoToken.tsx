import Image from "next/image";
import * as React from "react";
import noContentAvailble from "../../../assets/icon/pools/noContentAvailable.svg";
import { useAppDispatch } from "../../../redux";
import { walletConnection } from "../../../redux/wallet/wallet";
import Link from "next/link";
import { PoolsCardHeader } from "../Cardheader";
export interface IWalletNotConnectedProps {
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
}
export interface INoDataProps {
  content: string;
}

export function NoContentAvailable(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12 gap-5 flex-col">
      <Image alt={"alt"} src={noContentAvailble} />

      <Link href={"/pools"}>
        <div
          className="cursor-pointer border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg"
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
export interface IWallet {
  h1: string;
  subValue: string;
}
export function WalletNotConnected(props: IWallet) {
  const dispatch = useAppDispatch();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      {props.h1}
      {props.subValue && <div className="text-text-500 font-body3 mt-2">{props.subValue}</div>}
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div className="cursor-pointer" onClick={connectTempleWallet}>
        <div className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg">
          Connect wallet
        </div>
      </div>
    </div>
  );
}
export function NoDataError(props: INoDataProps) {
  return (
    <div className="flex justify-start md:justify-center items-center  mt-2 md:mt-12  w-[100vw]">
      {props.content}
    </div>
  );
}
