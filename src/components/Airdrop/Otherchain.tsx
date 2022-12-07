import { AppDispatch, store, useAppSelector } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import infoBlue from "../../../src/assets/icon/pools/InfoBlue.svg";
import { useEffect, useState, useMemo } from "react";
import { ChainAirdrop } from "./Disclaimer";

import ply from "../../assets/Tokens/ply.png";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { tokenParameter } from "../../constants/swap";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import EvmWalletButton from "./EvmWalletButton";
export interface IOtherChain {}

function OtherChain(props: IOtherChain) {
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
            Claim from tezos wallet
          </Button>
        );
      } else {
        return (
          <Button color="disabled" width="w-full">
            Your wallet is not eligible
          </Button>
        );
      }
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect to wallet
        </Button>
      );
    }
  }, [props]);
  return (
    <>
      <div
        className={clsx(
          "lg:w-[600px] secondtoken h-[82px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2]  bg-card-500 mt-4"
        )}
      >
        <div className=" flex ">
          <div className={clsx(" mt-4", "flex-none")}>
            <TokenDropdown tokenIcon={tokenOut.image} tokenName={tokenOut.name} isArrow={true} />
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
      {/* <div className="mt-[18px]">{ClaimButton}</div> */}
      <div className="mt-[18px]">
        <EvmWalletButton />
      </div>
      {/* //TODO: Add the condition when wallet is not eligible */}
      {true && (
        <div className="h-[46px]  px-2 rounded-xl my-3 flex items-center bg-info-500/[0.1]">
          <p className="relative top-0.5">
            <Image src={infoBlue} />
          </p>
          <p className="font-body2 text-info-500 px-3 md:w-auto w-[249px]">
            In order to claim you should approve it on your tezos wallet
          </p>
        </div>
      )}
    </>
  );
}

export default OtherChain;
