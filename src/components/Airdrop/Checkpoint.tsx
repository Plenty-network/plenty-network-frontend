import { AppDispatch, store, useAppSelector } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import { useEffect, useState, useRef, useMemo } from "react";
import doneCheck from "../../assets/icon/airdrop/doneCheck.svg";

import { TwitterShareButton, TwitterIcon } from "react-share";
import check from "../../assets/icon/airdrop/check.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
import clsx from "clsx";
import { ChainAirdrop } from "./Disclaimer";
import Action from "./Action";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import { useDispatch } from "react-redux";
// import { addTweetedAccount } from "../../redux/airdrop/transactions";
import { IClaimDataResponse, Mission } from "../../api/airdrop/types";
export interface ICheckPoint {
  text: string;
  completed: boolean;
  className?: string;
  href: string;
  claimData: IClaimDataResponse;
  mission: Mission;
  disable: boolean;
  isFetching: boolean;
  twitterAction: string;
  handleTwitter: () => void;
  hasTweeted: boolean;
}

function CheckPoint(props: ICheckPoint) {
  const tweetRef = useRef(null);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  // const handleTwitter = () => {
  //   dispatch(addTweetedAccount(userAddress));
  // };
  const action = useMemo(() => {
    let flag = 0;

    props.claimData.claimData.map((data) => {
      if (data.mission === props.mission && data.mission !== "ELIGIBLE") {
        flag = 1;
        if (data.claimed) {
          flag = 2;
        }
      } else if (data.mission === props.mission && data.mission === "ELIGIBLE") {
        if (props.hasTweeted) {
          flag = 1;
          if (data.claimed) {
            flag = 2;
          }
        }
      }
    });
    return flag;
  }, [props.claimData, props.mission, props.hasTweeted]);
  return (
    <>
      <div
        className={clsx(
          "flex rounded-xl border border-muted-600  h-[42px] items-center px-4 mt-2",
          props.className
        )}
      >
        <p className="relative top-[3px]">
          <Image
            src={
              !props.isFetching && props.href === ""
                ? props.twitterAction.toLowerCase() === "take action" ||
                  props.twitterAction === "Not allowed"
                  ? check
                  : doneCheck
                : action !== 0
                ? doneCheck
                : check
            }
          />
        </p>
        <p className="font-subtitle1 ml-[7.67px] w-[40%] md:w-auto">{props.text}</p>

        <p
          className={clsx(
            "ml-auto px-2 h-[26px] flex items-center font-subtitle1 rounded-lg ",
            props.isFetching
              ? "text-primary-500 bg-primary-500/[0.1]"
              : props.claimData.eligible === false
              ? "bg-warning-500/[0.1] text-warning-500"
              : props.href === ""
              ? props.twitterAction.toLowerCase() === "claimed" &&
                props.twitterAction !== "Not allowed"
                ? "bg-success-500/[0.1] text-success-500"
                : props.twitterAction.toLowerCase() === "completed"
                ? "bg-info-400/[0.1] text-info-400 r "
                : "text-primary-500 bg-primary-500/[0.1] cursor-pointer"
              : action > 0
              ? action === 2
                ? "bg-success-500/[0.1] text-success-500"
                : "bg-info-400/[0.1] text-info-400 r "
              : "text-primary-500 bg-primary-500/[0.1] cursor-pointer"
          )}
        >
          {props.href === "" ? (
            <Action
              action={props.isFetching ? "fetching..." : props.twitterAction}
              href={props.href}
              value={
                !props.isFetching
                  ? props.twitterAction !== "Claimed" && props.twitterAction !== "Not allowed"
                    ? props.claimData.perMissionAmount
                    : undefined
                  : undefined
              }
              onclick={props.handleTwitter}
            />
          ) : props.isFetching ? (
            "fetching..."
          ) : props.disable ? (
            "Not allowed"
          ) : action > 0 ? (
            action === 2 ? (
              <Action action="Claimed" href={props.href} />
            ) : (
              <Action
                action="Completed"
                value={props.claimData.perMissionAmount}
                href={props.href}
              />
            )
          ) : (
            action === 0 && (
              <Action
                action="Take action"
                value={props.claimData.perMissionAmount}
                href={props.href}
              />
            )
          )}
        </p>
      </div>
    </>
  );
}

export default CheckPoint;
