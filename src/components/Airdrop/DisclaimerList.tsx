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
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
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
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <div className="relative -top-[10px] text-[40px]">.</div>
        <div className="ml-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the
        </div>
      </div>
    </>
  );
}

export default List;
