import { store, useAppSelector } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import eth from "../../../src/assets/icon/airdrop/eth.svg";

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
  return (
    <>
      <div className="flex ">
        <p className="font-title3 mr-1.5"> ({truncateMiddle(userAddress, 4, 4, "...")})</p>

        <p className="mr-1">
          <Image alt={"alt"} src={eth} />
        </p>
      </div>
    </>
  );
}

export default WalletAddress;
