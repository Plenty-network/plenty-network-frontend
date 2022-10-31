import Image from "next/image";
import * as React from "react";
import clsx from "clsx";

import lighting from "../../assets/icon/vote/lighting.svg";

import arrow from "../../assets/icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { ELocksState, IVeNFTData } from "../../api/votes/types";
import { useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { setisMyportfolio, setSelectedDropDown } from "../../redux/veNFT";
import PieChartButton from "../LocksPosition/PieChart";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

export interface IDropdownProps {
  Options: IVeNFTData[];
  selectedText: {
    votingPower: string;
    tokenId: string;
  };
  onClick: Function;
  title: string;
  className?: string;
  isConfirmStake?: boolean;
  isFetching: boolean;
}

export function VeNFT(props: IDropdownProps) {
  // const epochData = store.getState().epoch.currentEpoch;
  const epochData = useAppSelector((state) => state.epoch.currentEpoch);
  const totalTime = epochData ? epochData.endTimestamp - epochData.startTimestamp : 0;
  const remainingTime = epochData ? epochData.endTimestamp - new Date().getTime() : 0;
  const remainingPercentage =
    totalTime === 0 || remainingTime === 0 ? 0 : (remainingTime * 100) / totalTime;

  // currentTS = new Date().getTime() if epoch start and end TS are in milliseconds or Math.floor(new Date().getTime() /1000)
  //const props.selectedText = store.getState().veNFT.props.selectedText;
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });

  const checkExpired = (obj: { locksState: ELocksState }) => obj.locksState === ELocksState.EXPIRED;
  var isExpired = props.Options.some(checkExpired);
  return (
    <div
      className={`relative w-[150px] md:min-w-[200px] md:w-[170px] ${props.className}`}
      ref={reff}
    >
      <div
        className={clsx(
          "bg-text-800/[0.25]   flex gap-1 md:gap-2 md:gap-4 py-3 md:py-2 px-2 md:px-3 justify-between border hover:border-text-700 rounded-lg",
          props.Options.length === 0
            ? "border-border-200 bg-card-200 hover:bg-card-200 hover:border-border-200"
            : isDropDownActive
            ? "border-muted-50 bg-muted-500 hover:border-muted-50 hover:bg-muted-500"
            : props.selectedText.votingPower === ""
            ? "border-[0.8px] border-primary-500 bg-card-500 text-text-400"
            : "border-text-800 bg-text-800/[0.25]",

          props.Options.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
        )}
        {...(props.Options.length === 0
          ? {}
          : { onClick: () => setIsDropDownActive(!isDropDownActive) })}
      >
        <p
          className={clsx(
            " flex gap-1",
            isDropDownActive && "text-text-500",

            props.Options.length === 0
              ? "text-text-700"
              : props.selectedText.votingPower === ""
              ? "text-text-600"
              : "text-text-500"
          )}
        >
          {props.selectedText.votingPower !== "" && props.selectedText.tokenId !== "" ? (
            <>
              <Image alt={"alt"} src={lighting} />
              <span className="ml-1 font-body4 text-white">
                {Number(props.selectedText.votingPower) > 0
                  ? Number(props.selectedText.votingPower) < 0.001
                    ? `<0.001`
                    : Number(props.selectedText.votingPower).toFixed(3)
                  : "0"}
              </span>
              <span className="font-body3 text-text-500">(#{props.selectedText.tokenId})</span>
            </>
          ) : (
            <>
              <span className={clsx("hidden md:block  md:font-body4")}>{props.title}</span>{" "}
              <span className="block md:hidden font-subtitle1 md:font-body4">
                Select your veNFT
              </span>
            </>
          )}
        </p>

        <Image
          src={arrow}
          width={"12px"}
          height={"12px"}
          className={isDropDownActive ? "rotate-0" : "rotate-180"}
        />
      </div>
      {isDropDownActive && props.Options.length > 0 && (
        <div
          className={clsx(
            "absolute  max-h-[210px] overflow-y-auto z-20 w-[150px] min-w-[180px] md:w-[200px] mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1"
          )}
        >
          {props.Options.map(
            (text, i) =>
              text.locksState !== ELocksState.EXPIRED && (
                <Options
                  onClick={props.onClick}
                  key={`${text.tokenId}_${i}`}
                  votingPower={
                    text.locksState === ELocksState.DISABLED
                      ? text.nextEpochVotingPower.toString()
                      : text.votingPower.toString()
                  }
                  tokenId={text.tokenId.toString()}
                  veNFT={
                    text.locksState === ELocksState.AVAILABLE ||
                    text.locksState === ELocksState.CONSUMED
                      ? true
                      : false
                  }
                  lockState={text.locksState}
                  veNFTObj={text}
                />
              )
          )}
          {isExpired && <span className="text-text-250 px-4 font-f11">Expired</span>}
          {props.Options.map(
            (text, i) =>
              text.locksState === ELocksState.EXPIRED && (
                <Options
                  onClick={props.onClick}
                  key={`${text.tokenId}_${i}`}
                  votingPower={text.votingPower.toString()}
                  tokenId={text.tokenId.toString()}
                  veNFT={false}
                  lockState={text.locksState}
                  veNFTObj={text}
                />
              )
          )}
        </div>
      )}
    </div>
  );

  function Options(props: {
    onClick: Function;
    votingPower: string;
    tokenId: string;
    veNFT: Boolean;
    lockState:
      | ELocksState.AVAILABLE
      | ELocksState.CONSUMED
      | ELocksState.DISABLED
      | ELocksState.EXPIRED;
    veNFTObj: IVeNFTData;
  }) {
    const dispatch = useDispatch<AppDispatch>();
    return (
      <div
        onClick={
          props.veNFT
            ? () => {
                dispatch(
                  setSelectedDropDown({
                    votingPower:
                      props.lockState === ELocksState.CONSUMED
                        ? Number(props.veNFTObj.nextEpochVotingPower).toFixed(3)
                        : props.votingPower,
                    tokenId: props.tokenId,
                  })
                );
                dispatch(setisMyportfolio(false));
                props.onClick({
                  votingPower:
                    props.lockState === ELocksState.CONSUMED
                      ? Number(props.veNFTObj.nextEpochVotingPower).toFixed(3)
                      : props.votingPower,
                  tokenId: props.tokenId,
                });
                setIsDropDownActive(false);
              }
            : () => {}
        }
        className={clsx(
          "  hover:bg-muted-500 px-4 flex items-center h-[36px]  flex py-2.5",
          props.veNFT ? "cursor-pointer" : "cursor-not-allowed"
        )}
      >
        <Image alt={"alt"} src={lighting} />
        <span
          className={clsx(
            "ml-1 font-body4 ",
            props.lockState === ELocksState.AVAILABLE ? "text-white" : "text-text-800",
            props.lockState === ELocksState.CONSUMED || props.lockState === ELocksState.DISABLED
              ? "flex"
              : ""
          )}
        >
          {props.lockState === ELocksState.CONSUMED
            ? Number(props.veNFTObj.nextEpochVotingPower).toFixed(3)
            : Number(props.votingPower) > 0
            ? Number(props.votingPower) < 0.001
              ? `< ${Number(props.votingPower).toFixed(3)}`
              : Number(props.votingPower).toFixed(3)
            : "0"}
          {(props.lockState === ELocksState.CONSUMED ||
            props.lockState === ELocksState.DISABLED) && (
            <span className="ml-[6px]">
              <ToolTip
                id="tooltipM"
                position={Position.top}
                toolTipChild={
                  <div className="w-[100px] md:w-[180px]">
                    New locks are required to wait until the end of the present epoch to vote.
                  </div>
                }
              >
                <PieChartButton
                  violet={100 - remainingPercentage}
                  transparent={remainingPercentage}
                />
              </ToolTip>
            </span>
          )}
        </span>
        <span
          className={clsx("ml-auto font-body3", props.veNFT ? "text-text-500" : "text-text-800")}
        >
          #{props.tokenId}
        </span>
      </div>
    );
  }
}
