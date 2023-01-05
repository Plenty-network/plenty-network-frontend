import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
export interface IList {}

function ListOtherChain(props: IList) {
  return (
    <>
      <div className="flex font-body3 text-text-50">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          If you are eligible for the airdrop, you will have to sign a message using an EVM-based
          wallet to prove ownership of the address.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          The signed message would contain the Tezos address at which you choose to receive the
          airdrop.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Your EVM-based wallet of choice will connect to Ethereum by default. If you are a user of
          another EVM-based chain, you may continue with the signing since the generated signature
          is the same for all EVM-based networks.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Please provide a fresh Tezos address that does NOT already have an airdrop assigned to it.
        </div>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Provided Tezos address must have enough XTZ to pay for gas, and transaction fees.
        </div>
      </div>
    </>
  );
}

export default ListOtherChain;
