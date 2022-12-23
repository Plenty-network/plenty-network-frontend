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

import info from "../../../src/assets/icon/common/infoIcon.svg";
import { useDispatch } from "react-redux";
import { addTweetedAccount } from "../../redux/airdrop/transactions";
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
}

function CheckPoint(props: ICheckPoint) {
  const tweetRef = useRef(null);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const tweetedAccounts = useAppSelector((state) => state.airdropTransactions.tweetedAccounts);
  const dispatch = useDispatch<AppDispatch>();
  const handleTwitter = () => {
    dispatch(addTweetedAccount(userAddress));
  };
  const action = useMemo(() => {
    let flag = 0;

    props.claimData.claimData.map((data) => {
      if (data.mission === props.mission && data.mission !== "ELIGIBLE") {
        flag = 1;
        if (data.claimed) {
          flag = 2;
        }
      } else if (data.mission === props.mission && data.mission === "ELIGIBLE") {
        if (tweetedAccounts.includes(userAddress)) {
          flag = 1;
          if (data.claimed) {
            flag = 2;
          }
        }
      }
    });
    return flag;
  }, [props.claimData, props.mission, tweetedAccounts]);
  return (
    <>
      <div
        className={clsx(
          "flex rounded-xl border border-muted-600  h-[42px] items-center ",
          props.className
        )}
      >
        <p className="relative top-0.5">
          <Image src={action === 1 ? doneCheck : check} />
        </p>
        <p className="font-subtitle1 ml-2 w-[50%] md:w-auto">{props.text}</p>

        <p
          className={clsx(
            "ml-auto px-2 h-[26px] flex items-center font-subtitle1 rounded-lg ",
            props.isFetching
              ? "text-primary-500 bg-primary-500/[0.1]"
              : props.claimData.eligible === false
              ? "bg-warning-500/[0.1] text-warning-500"
              : action > 0
              ? action === 2
                ? "bg-success-500/[0.1] text-success-500"
                : "bg-info-400/[0.1] text-info-400  "
              : "text-primary-500 bg-primary-500/[0.1]"
          )}
        >
          {props.isFetching ? (
            "fetching..."
          ) : props.disable ? (
            "Not allowed"
          ) : props.href === "" && action === 0 ? (
            <span onClick={handleTwitter}>
              <TwitterShareButton
                url="https://ghostnet.plenty.network/"
                style={{ height: "auto" }}
                ref={tweetRef}
              >
                {action === 0 && `Take action ${props.claimData.perMissionAmount.toFixed(2)}`}
              </TwitterShareButton>
            </span>
          ) : action > 0 ? (
            action === 2 ? (
              "Claimed"
            ) : (
              `Completed ${props.claimData.perMissionAmount.toFixed(2)}`
            )
          ) : (
            <Link href={props.href}>
              {action === 0 && `Take action ${props.claimData.perMissionAmount.toFixed(2)}`}
            </Link>
          )}
        </p>
      </div>
    </>
  );
}

export default CheckPoint;
