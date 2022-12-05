import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";

import doneCheck from "../../assets/icon/airdrop/doneCheck.svg";

import check from "../../assets/icon/airdrop/check.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";

import info from "../../../src/assets/icon/common/infoIcon.svg";
export interface ICheckPoint {
  text: string;
  completed: boolean;
  className?: string;
  href: string;
}

function CheckPoint(props: ICheckPoint) {
  return (
    <>
      <div
        className={clsx(
          "flex rounded-xl border border-muted-600  h-[42px] items-center ",
          props.className
        )}
      >
        <p className="relative top-0.5">
          <Image src={props.completed ? doneCheck : check} />
        </p>
        <p className="font-subtitle1 ml-2">{props.text}</p>

        <p
          className={clsx(
            "ml-auto px-2 h-[26px] flex items-center font-subtitle1 rounded-lg ",
            props.completed
              ? "bg-success-500/[0.1] text-success-500"
              : "text-primary-500 bg-primary-500/[0.1] "
          )}
        >
          <Link href={props.href}>{props.completed ? "Completed" : "Take action"}</Link>
        </p>
      </div>
    </>
  );
}

export default CheckPoint;
