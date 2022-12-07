import { store, useAppSelector } from "../../redux";
import { useChainModal, useAccountModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import eth from "../../../src/assets/icon/airdrop/eth.svg";
import { useAccount, useNetwork } from "wagmi";
import truncateMiddle from "truncate-middle";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";

import info from "../../../src/assets/icon/common/infoIcon.svg";
export interface IWalletAddress {}

function WalletAddress(props: IWalletAddress) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const { address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  return (
    <>
      <div className="flex ">
        <p className="font-title3 mr-1.5 cursor-pointer" onClick={openAccountModal}>
          {" "}
          ({ethAddress ? truncateMiddle(ethAddress as string, 5, 4, "...") : ""})
        </p>

        <p className="mr-1 cursor-pointer">
          <Image alt={ethChain?.name} src={eth} onClick={openChainModal} />
        </p>
      </div>
    </>
  );
}

export default WalletAddress;
