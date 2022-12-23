import { useChainModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";
import truncateMiddle from "truncate-middle";
import { useEffect, useState } from "react";
import { defaultChains } from "../../config/rainbowWalletConfig";
export interface IWalletAddress {};

function WalletAddress() {
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
        currentChain.iconUrl ? (currentChain.iconUrl as string) : "/assets/chains/unsupported.svg"
      );
    } else {
      setChainIconUrl("/assets/chains/unsupported.svg");
    }
  }, [ethChain]);

  return (
    <>
      <div className="flex ">
        <p className="font-title3 mr-1.5 cursor-pointer" onClick={openAccountModal}>
          {" "}
          (
          {ethAddress
            ? isMobile
              ? truncateMiddle(ethAddress as string, 4, 2, "...")
              : truncateMiddle(ethAddress as string, 5, 4, "...")
            : ""}
          )
        </p>

        <p className="mr-1 cursor-pointer flex">
          <Image
            alt={ethChain?.name}
            src={chainIconUrl}
            height={18}
            width={18}
            onClick={openChainModal}
          />
        </p>
      </div>
    </>
  );
}

export default WalletAddress;
