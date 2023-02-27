import Image from "next/image";
import playIcon from "../../assets/icon/pools/playIcon.svg";
import * as React from "react";
import { useAccount, useNetwork } from "wagmi";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
import WalletAddress from "./WalletAddress";
import { VideoModal } from "../Modal/videoModal";
export interface IHeaderSelection {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  chain: ChainAirdrop;
  isDisclaimer: boolean;
}

function HeaderSelection(props: IHeaderSelection) {
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { isConnected, address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  return (
    <>
      <div className="flex  items-center">
        <div
          className={clsx(
            props.chain === ChainAirdrop.Tezos
              ? "font-subtitle6 text-primary-500 bg-primary-500/[0.2] md:font-title2-bold"
              : "bg-muted-400 border border-shimmer-100 font-title3 md:font-title2-18 text-text-500",
            " px-3 h-[38px] flex items-center rounded-xl cursor-pointer"
          )}
          onClick={() => props.setChain(ChainAirdrop.Tezos)}
        >
          {ChainAirdrop.Tezos}
        </div>
        <div
          className={clsx(
            props.chain === ChainAirdrop.Other_chain
              ? "font-subtitle6 text-primary-500 bg-primary-500/[0.2] md:font-title2-bold"
              : "bg-muted-400 border border-shimmer-100 font-title3 md:font-title2-18 text-text-500",
            " px-3 h-[38px] flex items-center ml-[10px] md:ml-4  rounded-xl cursor-pointer"
          )}
          onClick={() => props.setChain(ChainAirdrop.Other_chain)}
        >
          {ChainAirdrop.Other_chain}
        </div>
        <div className="ml-1 relative top-0.5">
          {" "}
          <Image
            src={playIcon}
            onClick={() => setShowVideoModal(true)}
            height={"28px"}
            width={"28px"}
            className="cursor-pointer hover:opacity-90"
          />
        </div>
        {!props.isDisclaimer && props.chain === ChainAirdrop.Other_chain ? (
          <div className="ml-auto mt-0.5 ">
            {isConnected && ethAddress && ethChain && <WalletAddress />}
          </div>
        ) : null}
      </div>
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"zr41e0JdZXY"} />}
    </>
  );
}

export default HeaderSelection;
