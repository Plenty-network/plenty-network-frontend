import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import { IClaimAPIData, IClaimDataResponse } from "../../api/airdrop/types";
import { useAppSelector } from "../../redux";
export interface IProgress {
  claimData: IClaimAPIData[];
  res: IClaimDataResponse;
  fetching: boolean;
}

function Progress(props: IProgress) {
  const tweetedAccounts = useAppSelector((state) => state.airdropTransactions.tweetedAccounts);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const length = props.claimData.length;

  const remaining = 6 - length;

  return (
    <>
      {props.fetching || props.claimData.length === 0 ? (
        <>
          <div className="flex gap-2 px-5">
            {[...Array(6)].map((e, i) => (
              <p
                className={clsx(
                  props.fetching ? "bg-info-300" : "bg-info-300",
                  "h-[6px]  w-[105px]"
                )}
                key={i}
              ></p>
            ))}{" "}
          </div>
          <div className="flex mt-3 px-5">
            <p className="font-subtitle3">
              <span className="relative top-[2px] mr-1.5">
                <Image alt={"alt"} src={info} />
              </span>
              Your progress
            </p>
            <p className="ml-auto text-primary-500 font-subtitle4">( 0.00 %)</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 px-5">
            {props.claimData.map((data, index) => {
              if (data.mission !== "ELIGIBLE") {
                return <p className={clsx("bg-blue-100", "h-[6px]  w-[105px]")} key={index}></p>;
              }
            })}
            {props.claimData && props.claimData[0]?.mission === "ELIGIBLE" && (
              <p
                className={clsx(
                  tweetedAccounts.includes(userAddress) ? "bg-blue-100" : "bg-info-300",
                  "h-[6px]  w-[105px]"
                )}
              ></p>
            )}
            {[...Array(remaining)].map((e, i) => (
              <p className={clsx("bg-info-300 h-[6px]  w-[105px]")} key={i}></p>
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
              {props.res.success && !props.fetching
                ? (
                    ((tweetedAccounts.includes(userAddress)
                      ? props.claimData.length
                      : props.claimData.length - 1) /
                      6) *
                    100
                  ).toFixed(2)
                : 0}
              %)
            </p>
          </div>{" "}
        </>
      )}
    </>
  );
}

export default Progress;
