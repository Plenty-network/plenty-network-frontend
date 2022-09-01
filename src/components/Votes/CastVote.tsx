import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import lock from "../../../src/assets/icon/vote/lock.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { ICastVoteProps } from "./types";
import React, { useState, useMemo } from "react";
import { store } from "../../redux";

function CastVote(props: ICastVoteProps) {
  const currentEpoch = store.getState().epoch.currentEpoch;
  const closeModal = () => {
    props.setShow(false);
  };
  const dateFormat = useMemo(() => {
    var date = new Date(currentEpoch.endTimestamp);
    return `${date.getUTCDate()}/${("0" + date.getUTCMonth()).slice(
      -2
    )}/${date.getUTCFullYear()}, ${("0" + date.getUTCHours()).slice(-2)}:${(
      "0" + date.getUTCMinutes()
    ).slice(-2)}`;
  }, [currentEpoch.endTimestamp]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  return props.show ? (
    <PopUpModal
      onhide={closeModal}
      className="w-[400px] max-w-[400px] px-4 md:px-6 md:w-[602px] md:max-w-[602px]"
    >
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={() => props.setShow(false)}>
              <Image src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Cast Vote </div>
            <div className="relative top-[2px]">
              <Image src={info} />
            </div>
          </div>
          <div className="border bg-card-200 mt-5 border-text-800 rounded-2xl  pt-[22px] pb-[25px]">
            <div className="text-text-50 font-body4 px-3 md:px-5">Your votes power</div>
            <div className="flex mt-1 mb-3 px-3 md:px-5">
              <div>
                <span className="font-title2 text-white">{props.totalVotingPower}%</span>
                <span className="font-body1 text-text-250 ml-1">distributed between</span>
              </div>
              <div className="ml-auto bg-text-800/[0.5] relative -top-[9px] rounded-lg flex items-center h-[36px] px-2">
                <Image src={lock} />
                <span className="font-body4 text-white">
                  {Number(props.selectedDropDown.votingPower).toFixed(3)} /
                </span>
                <span className="font-body4 text-text-500 ml-px">
                  #{props.selectedDropDown.tokenId}
                </span>
              </div>
            </div>
            {props.selectedPools.map((pool, index) => {
              return (
                <div
                  className="flex h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-3 md:px-5"
                  key={index}
                >
                  <div className="flex items-center">
                    <span className="flex">
                      <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                        <Image src={getImagesPath(pool.tokenA)} width={"24px"} height={"24px"} />
                      </div>
                      <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                        <Image src={getImagesPath(pool.tokenB)} width={"24px"} height={"24px"} />
                      </div>
                    </span>
                    <span className="text-white font-body4  relative top-[1px]">
                      {pool.tokenA}/{pool.tokenB}
                    </span>
                  </div>
                  <div className="ml-auto font-body4 text-white">{pool.votingPower}%</div>
                </div>
              );
            })}
            <div className="mt-5 pl-3 md:pl-5 md:flex items-center">
              <span className="text-text-250 font-body2 mr-1">
                You can claim your rewards after
              </span>
              <span className="hidden md:block">
                <span className="relative top-0.5">
                  <Image src={info} />
                </span>
                <span className="text-white ml-1 font-subtitle2 ">{dateFormat} UTC</span>
              </span>
              <span className="block md:hidden">
                <div>
                  <span className="relative top-0.5">
                    <Image src={info} />
                  </span>
                  <span className="text-white ml-1 font-subtitle2 ">{dateFormat} UTC</span>
                </div>
              </span>
            </div>
          </div>
          <div className="mt-[18px]">
            <Button color="primary" onClick={props.onClick}>
              Confirm vote
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default CastVote;
