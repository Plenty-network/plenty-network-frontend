import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
export interface IList {}

function List(props: IList) {
  return (
    <>
      <div className="flex font-body3 text-text-50">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          The amount of tokens assigned to you for this airdrop can be claimed in parts, by
          completing various tasks on the platform.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          After completion of every task, you may have to wait for a few minutes for the indexer to
          catch up and reflect the claimable airdrop amount on your screen.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Ghostnet testers who used Kukai have not been included in the airdrop. As a result of
          Social Authentication implementation, Kukai uses separate addresses for both testnet and
          mainnet making it impossible to track test data accurately
        </div>
      </div>
      {/* <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the
        </div>
      </div> */}
    </>
  );
}

export default List;
