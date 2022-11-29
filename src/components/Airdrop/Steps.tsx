import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";

import "animate.css";
import { useEffect, useState, useMemo } from "react";
import vectorDown from "../../assets/icon/common/vector.svg";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import CheckPoint from "./Checkpoint";
export interface ISteps {}

function Steps(props: ISteps) {
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  return (
    <>
      <div className="flex  px-5">
        {isDropDownActive ? (
          <p className="bg-primary-500/[0.2] rounded-lg h-[28px] px-2 text-primary-500 font-subtitle1 flex items-center">
            4 steps to complete
          </p>
        ) : (
          <p className="">
            <span className="font-subtitle4 mr-1">Tweet about the new plenty.network</span>
            <span className="font-subtitle1 text-primary-500">+4 steps to complete</span>
          </p>
        )}
        <p className="ml-auto  " onClick={() => setIsDropDownActive(!isDropDownActive)}>
          <Image
            alt={"alt"}
            className={isDropDownActive ? "rotate-0" : "rotate-180"}
            src={vectorDown}
          />
        </p>
      </div>
      {isDropDownActive && (
        <div
          className={clsx(
            "px-5 animate__animated ",
            isDropDownActive ? "animate__fadeInDown animate__faster" : ""
          )}
        >
          <CheckPoint completed={true} text={"Tweet about the new plenty.network"} />
          <CheckPoint className={"mt-2"} completed={false} text={"Swap  TEZ-CTEZ "} />
          <CheckPoint className={"mt-2"} completed={false} text={"Add liquidity and stake"} />
          <CheckPoint className={"mt-2"} completed={false} text={"Lock PLY and get veNFT"} />
          <CheckPoint
            className={"mt-2"}
            completed={false}
            text={"Vote for any pair in the guages"}
          />
        </div>
      )}
    </>
  );
}

export default Steps;
