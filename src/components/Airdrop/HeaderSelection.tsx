import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
import WalletAddress from "./WalletAddress";
export interface IHeaderSelection {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  chain: ChainAirdrop;
  isDisclaimer: boolean;
}

function HeaderSelection(props: IHeaderSelection) {
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { isConnected, address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();

  return (
    <div className="flex font-title2-bold items-center">
      <div
        className={clsx(
          props.chain === ChainAirdrop.Tezos
            ? "text-primary-500 bg-primary-500/[0.2]"
            : "bg-muted-400 border border-shimmer-100 text-text-500",
          " px-3 h-[38px] flex items-center rounded-xl cursor-pointer"
        )}
        onClick={() => props.setChain(ChainAirdrop.Tezos)}
      >
        {ChainAirdrop.Tezos}
      </div>
      <div
        className={clsx(
          props.chain === ChainAirdrop.Other_chain
            ? "text-primary-500 bg-primary-500/[0.2]"
            : "bg-muted-400 border border-shimmer-100 text-text-500",
          " px-3 h-[38px] flex items-center ml-4  rounded-xl cursor-pointer"
        )}
        onClick={() => props.setChain(ChainAirdrop.Other_chain)}
      >
        {ChainAirdrop.Other_chain}
      </div>
      {!props.isDisclaimer && props.chain === ChainAirdrop.Other_chain ? (
        <div className="ml-auto mt-0.5 ">
          {isConnected && ethAddress && ethChain && <WalletAddress />}
        </div>
      ) : null}
    </div>
  );
}

export default HeaderSelection;
