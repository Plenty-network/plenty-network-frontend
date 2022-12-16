import Image from "next/image";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import info from "../../../src/assets/icon/common/infoIcon.svg";

import { isMobile } from "react-device-detect";
import ply from "../../assets/Tokens/ply.png";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";

import checkGrey from "../../assets/icon/airdrop/checkGrey.svg";
import link from "../../assets/icon/pools/external_violet.svg";
import HeaderSelection from "./HeaderSelection";
import List from "./DisclaimerList";
import Button from "../Button/Button";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
import { tokenParameter } from "../../constants/swap";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import Progress from "./Progress";
import Steps from "./Steps";
import { AppDispatch, useAppSelector } from "../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import OtherChain from "./Otherchain";
import { useAirdropClaimData } from "../../hooks/temp";
interface IMainAirdropProps {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  chain: ChainAirdrop;
}

function MainAirdrop(props: IMainAirdropProps) {
  const tokenOut = {
    name: "PLY",
    image: ply,
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const userAddress = useAppSelector((state) => state.wallet.address);
  const res = useAirdropClaimData();

  const ClaimButton = useMemo(() => {
    if (userAddress) {
      if (
        res.airdropClaimData.eligible &&
        res.airdropClaimData.pendingClaimableAmount.isGreaterThanOrEqualTo(0)
      ) {
        return (
          <button
            className={clsx("bg-primary-500 h-13 text-black w-full rounded-2xl font-title3-bold")}
          >
            Claim {res.airdropClaimData.pendingClaimableAmount.toFixed(2)}
          </button>
        );
      } else if (
        res.airdropClaimData.eligible === false ||
        res.airdropClaimData.success === false
      ) {
        return (
          <Button color="disabled" width="w-full">
            Not eligible
          </Button>
        );
      }
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect Wallet
        </Button>
      );
    }
  }, [props, userAddress, res]);
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
          <p className="ml-auto text-primary-500 font-caption2">Learn more</p>
        </div>
        {props.chain === ChainAirdrop.Other_chain && <OtherChain setChain={props.setChain} />}
        {props.chain === ChainAirdrop.Tezos && (
          <div className="mt-3 border border-muted-300 bg-muted-400 rounded-xl py-5">
            <Progress claimData={res.airdropClaimData} />
            <div className="border-t border-text-800 my-3"></div>
            <Steps claimData={res.airdropClaimData} />
          </div>
        )}
        {props.chain === ChainAirdrop.Tezos && <div className="mt-[18px]">{ClaimButton}</div>}
      </div>
      <div className="font-body2 text-text-250 mt-[10px] mx-2 md:mx-auto md:w-[568px] text-center mb-5">
        Know more about Airdrop and its eligibility{" "}
        <span className="text-primary-500">Learn more</span>
      </div>
    </>
  );
}

export default MainAirdrop;
