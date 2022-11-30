import Image from "next/image";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import info from "../../../src/assets/icon/common/infoIcon.svg";

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
interface IMainAirdropProps {}

function MainAirdrop(props: IMainAirdropProps) {
  const [chain, setChain] = useState<ChainAirdrop>(ChainAirdrop.Tezos);
  const tokenOut = {
    name: "PLY",
    image: ply,
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const userAddress = useAppSelector((state) => state.wallet.address);
  const ClaimButton = useMemo(() => {
    if (userAddress) {
      if (false) {
        return (
          <Button color="primary" width="w-full" onClick={() => {}}>
            Claim
          </Button>
        );
      } else {
        return (
          <Button color="disabled" width="w-full">
            Claim
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
  }, [props]);
  return (
    <>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 p-5 mx-auto fade-in"
        )}
      >
        <HeaderSelection chain={chain} setChain={setChain} isDisclaimer={false} />
        <div className="mt-4 rounded-xl bg-muted-600 pl-4 pr-5 flex items-center h-[40px]">
          <p className="text-text-500 font-body2">
            An overview of what went behind the scenes for airdrop eligibility criteria
          </p>
          <p className="ml-auto text-primary-500 font-caption2">Learn more</p>
        </div>
        {chain === ChainAirdrop.Tezos ? (
          <div
            className={clsx(
              "lg:w-[600px] secondtoken h-[82px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2]  bg-card-500 mt-4"
            )}
          >
            <div className=" flex ">
              <div className={clsx(" mt-4", "flex-none")}>
                <TokenDropdown
                  tokenIcon={tokenOut.image}
                  tokenName={tokenOut.name}
                  isArrow={true}
                />
              </div>
              <div className=" my-3 flex-auto">
                <div className="text-right font-body1 text-text-400">YOUR CLAIMABLE BALANCE</div>
                <div>
                  <input
                    type="text"
                    disabled
                    className={clsx(
                      "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 "
                    )}
                    placeholder="0.0"
                    value={0.0}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <OtherChain />
        )}
        {chain === ChainAirdrop.Tezos && (
          <div className="mt-3 border border-muted-300 bg-muted-400 rounded-xl py-5">
            <Progress />
            <div className="border-t border-text-800 my-3"></div>
            <Steps />
          </div>
        )}
        {chain === ChainAirdrop.Tezos && <div className="mt-[18px]">{ClaimButton}</div>}
      </div>
      <div className="font-body2 text-text-250 mt-[10px] mx-2 md:mx-auto md:w-[568px] text-center mb-5">
        Know more about Airdrop and its eligibility{" "}
        <span className="text-primary-500">Learn more</span>
      </div>
    </>
  );
}

export default MainAirdrop;
