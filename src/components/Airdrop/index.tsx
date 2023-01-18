import { isMobile } from "react-device-detect";
import * as React from "react";
import HeaderSelection from "./HeaderSelection";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";

import OtherChain from "./Otherchain";
import { useAirdropClaimData } from "../../hooks/useAirdropClaimData";

import TezosChain from "./Tezoschain";
interface IMainAirdropProps {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  chain: ChainAirdrop;
}

function MainAirdrop(props: IMainAirdropProps) {
  return (
    <>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 p-5 mx-auto fade-in"
        )}
      >
        <HeaderSelection chain={props.chain} setChain={props.setChain} isDisclaimer={false} />
        <div className="mt-4 rounded-xl bg-muted-600 pl-4 pr-5 flex items-center h-[40px]">
          <p className="text-text-500 font-body2">
            {isMobile
              ? "Plenty airdrops eligibility criteria"
              : "An overview of what went behind the scenes for airdrop eligibility criteria"}
          </p>
          <p className="ml-auto text-primary-500 font-caption2">
            <a
              href="https://whitepaper.plenty.network/"
              target="_blank"
              rel="noreferrer"
              className="text-primary-500 font-caption2"
            >
              Learn more
            </a>
          </p>
        </div>
        {props.chain === ChainAirdrop.Other_chain && <OtherChain setChain={props.setChain} />}
        {props.chain === ChainAirdrop.Tezos && <TezosChain setChain={props.setChain} />}
      </div>
      <div className="font-body2 text-text-250 mt-[10px] mx-2 md:mx-auto md:w-[568px] text-center mb-5">
        Know more about Airdrop and its eligibility{" "}
        <span className="text-primary-500">
          <a
            href="https://medium.com/plenty-defi/ply-public-airdrop-criteria-9bbf778a74ac"
            target="_blank"
            rel="noreferrer"
            className="text-primary-500 "
          >
            Learn more
          </a>
        </span>
      </div>
    </>
  );
}

export default MainAirdrop;
