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
import { useEffect, useState } from "react";
import { defaultChains } from "../../config/rainbowWalletConfig";
export interface IWalletAddress {}

function WalletAddress(props: IWalletAddress) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [chainIconUrl, setChainIconUrl] = useState<string>("/assets/chains/fallback.svg");
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();
  /* Hooks provided by RainbowKit for account and chain changes */
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  /**
   * Get the default chains array from RainbowKit config and get relevant icon based on chain selected.
   * If not found or chain is unsupported use fallback icon.
   */
  useEffect(() => {
    const currentChain = defaultChains.find((chain) => chain.id === ethChain?.id);
    if (currentChain) {
      setChainIconUrl(
        currentChain.iconUrl ? (currentChain.iconUrl as string) : "/assets/chains/fallback.svg"
      );
    } else {
      setChainIconUrl("/assets/chains/fallback.svg");
    }
  }, [ethChain]);

  return (
    <>
      <div className="flex ">
        <p className="font-title3 mr-1.5 cursor-pointer" onClick={openAccountModal}>
          {" "}
          ({ethAddress ? truncateMiddle(ethAddress as string, 5, 4, "...") : ""})
        </p>

        <p className="mr-1 cursor-pointer flex">
          <Image alt={ethChain?.name} src={chainIconUrl} height={18} width={18} onClick={openChainModal} />
        </p>
      </div>
    </>
  );
}

export default WalletAddress;
