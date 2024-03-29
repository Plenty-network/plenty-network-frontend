import { store, useAppSelector } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";

import { isMobile } from "react-device-detect";
import "animate.css";
import { useEffect, useState, useMemo } from "react";
import vectorDown from "../../assets/icon/common/vector.svg";
import clsx from "clsx";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import CheckPoint from "./Checkpoint";
import { AIRDROP_MISSIONS_FOR_DISPLAY } from "../../constants/airdrop";
import { IClaimDataResponse } from "../../api/airdrop/types";
export interface ISteps {
  claimData: IClaimDataResponse;
  fetching: boolean;
  twitterAction: string;
  handleTwitter: () => void;
  hasTweeted: boolean;
}

function Steps(props: ISteps) {
  const [isDropDownActive, setIsDropDownActive] = useState(true);
  const userAddress = useAppSelector((state) => state.wallet.address);
  return (
    <>
      <div
        className="flex items-center cursor-pointer px-5"
        onClick={() => setIsDropDownActive(!isDropDownActive)}
      >
        {isDropDownActive ? (
          <p className="bg-primary-500/[0.2] rounded-lg h-[28px] px-2 text-primary-500 font-subtitle1 flex items-center">
            {props.claimData.success
              ? props.hasTweeted
                ? 6 - props.claimData.claimData.length
                : 7 - props.claimData.claimData.length
              : 6}{" "}
            steps to complete
          </p>
        ) : (
          <p className="">
            <span className="md:font-subtitle4 font-subtitle2  mr-1">
              {isMobile ? "Tweet about the new..." : "Tweet about the new plenty.network"}{" "}
            </span>
            <span className="font-subtitle1 text-primary-500">
              +
              {props.claimData.success
                ? props.hasTweeted
                  ? 6 - props.claimData.claimData.length
                  : 7 - props.claimData.claimData.length
                : 6}{" "}
              steps to complete
            </span>
          </p>
        )}
        <p className="ml-auto  relative top-[-3px]">
          <Image
            alt={"alt"}
            className={clsx("cursor-pointer", isDropDownActive ? "rotate-0" : "rotate-180")}
            src={vectorDown}
          />
        </p>
      </div>
      {isDropDownActive && (
        <div className={clsx("mt-5 px-3 ", isDropDownActive ? "scale-in-animation" : "")}>
          {AIRDROP_MISSIONS_FOR_DISPLAY.map((item) => {
            return (
              <>
                <CheckPoint
                  claimData={props.claimData}
                  completed={true}
                  text={isMobile ? item.mobileDisplayText : item.displayText}
                  isFetching={props.fetching}
                  href={item.href}
                  mission={item.mission}
                  disable={props.claimData.success === false || props.claimData.eligible === false}
                  twitterAction={props.twitterAction}
                  handleTwitter={props.handleTwitter}
                  hasTweeted={props.hasTweeted}
                />
              </>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Steps;
