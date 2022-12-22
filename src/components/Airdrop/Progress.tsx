import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import { IClaimDataResponse } from "../../api/airdrop/types";
import { useAppSelector } from "../../redux";
export interface IProgress {
  claimData: IClaimDataResponse;
}

function Progress(props: IProgress) {
  const tweetedAccounts = useAppSelector((state) => state.airdropTransactions.tweetedAccounts);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const length = props.claimData.claimData.length;

  const remaining = 6 - length;

  return (
    <>
      <div className="flex gap-2 px-5">
        {props.claimData.claimData.reverse().map((data) => {
          return (
            <p
              className={clsx(
                data && (data.mission === "ELIGIBLE" ? tweetedAccounts.includes(userAddress) : true)
                  ? "bg-blue-100"
                  : "bg-info-300",
                "h-[6px]  w-[105px]"
              )}
            ></p>
          );
        })}
        {[...Array(remaining)].map((e, i) => (
          <p className="bg-info-300 h-[6px]  w-[105px]" key={i}></p>
        ))}
      </div>
      <div className="flex mt-3 px-5">
        <p className="font-subtitle3">
          <span className="relative top-[2px] mr-1.5">
            <Image alt={"alt"} src={info} />
          </span>
          Your progress
        </p>
        <p className="ml-auto text-primary-500 font-subtitle4">
          (
          {props.claimData.success
            ? (
                ((tweetedAccounts.includes(userAddress)
                  ? props.claimData.claimData.length
                  : props.claimData.claimData.length - 1) /
                  6) *
                100
              ).toFixed(2)
            : 0}
          %)
        </p>
      </div>
      {/* <div className="flex gap-2 px-5">
        <p
          className={clsx(
            props.claimData.claimData.length > 0 && tweetedAccounts.includes(userAddress)
              ? props.claimData.claimData[0]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 1
              ? props.claimData.claimData[1]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 2
              ? props.claimData.claimData[2]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 3
              ? props.claimData.claimData[3]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 4
              ? props.claimData.claimData[4]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 5
              ? props.claimData.claimData[5]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
      </div>
      <div className="flex mt-3 px-5">
        <p className="font-subtitle3">
          <span className="relative top-[2px] mr-1.5">
            <Image alt={"alt"} src={info} />
          </span>
          Your progress
        </p>
        <p className="ml-auto text-primary-500 font-subtitle4">
          (
          {(
            ((tweetedAccounts.includes(userAddress)
              ? props.claimData.claimData.length
              : props.claimData.claimData.length - 1) /
              6) *
            100
          ).toFixed(2)}
          %)
        </p>
      </div> */}
    </>
  );
}

export default Progress;
