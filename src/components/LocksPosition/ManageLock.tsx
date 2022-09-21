import { PopUpModal } from "../Modal/popupModal";
import calender from "../../../src/assets/icon/vote/calender.svg";
import { useState, useMemo, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import wallet from "../../../src/assets/icon/pools/wallet.svg";
import Image from "next/image";
import Button from "../Button/Button";
import clsx from "clsx";
import { AppDispatch, store } from "../../redux";
import { connectedNetwork } from "../../common/walletconnect";
import { estimateVotingPower } from "../../api/votes";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { MAX_TIME, WEEK, YEAR } from "../../constants/global";
import { Datepicker } from "../DatePicker";
import { getCalendarRangeToEnable } from "../../api/util/epoch";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { TopBar } from "../LocksPosition/ManageLockTopBar";
import { IManageLockProps } from "./types";
import ConfirmLocking from "../Votes/ConfirmLocking";

function ManageLock(props: IManageLockProps) {
  const walletAddress = store.getState().wallet.address;
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);
  const [screen, setScreen] = useState("1");
  const [votingPower, setVotingPower] = useState(0);
  const [dateRange, setDateRange] = useState<{
    startTimeStamp: number;
    endTimeStamp: number;
    days: number;
    years: number[];
    alloweDates: number[];
  }>(
    {} as {
      startTimeStamp: number;
      endTimeStamp: number;
      days: number;
      years: number[];
      alloweDates: number[];
    }
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const closeModal = () => {
    props.setShow(false);
  };
  const handleInputPercentage = (value: number) => {
    props.setUpdatedPlyVoteValue((value * Number(props.plyBalance)).toString());
  };
  useEffect(() => {
    const res = getCalendarRangeToEnable();

    setDateRange({
      startTimeStamp: res.startTimestamp,
      endTimeStamp: res.endTimestamp,
      days: res.days,
      years: res.yearsToEnable,
      alloweDates: res.thursdaysToEnable,
    });
  }, []);
  useEffect(() => {
    const res = estimateVotingPower(
      new BigNumber(Number(props.updatedPlyVoteValue) + Number(props.manageData.baseValue)),
      props.lockingEndData.lockingDate === 0
        ? props.manageData.endTimeStamp / 1000
        : props.lockingEndData.lockingDate
    );
    setVotingPower(res);
  }, [props.updatedPlyVoteValue, props.lockingDate, props.manageData.baseValue]);
  const handlePlyInput = async (input: string | number) => {
    if (input === "" || isNaN(Number(input))) {
      props.setUpdatedPlyVoteValue("");

      return;
    } else {
      props.setUpdatedPlyVoteValue(input.toString());
      if (Number(props.lockingEndData.lockingDate) > 0) {
        const res = estimateVotingPower(
          new BigNumber(Number(props.updatedPlyVoteValue) + Number(props.manageData.baseValue)),
          props.lockingEndData.lockingDate === 0
            ? props.manageData.endTimeStamp / 1000
            : props.lockingEndData.lockingDate
        );

        setVotingPower(res);
      }
    }
  };
  const dateFormat = (dates: number) => {
    var date = new Date(dates);

    return `${date.getDate()}/${("0" + date.getMonth()).slice(-2)}/${date.getFullYear()}`;
  };
  const handleDateSelection = (days: number | undefined, userSelectedDate: string | undefined) => {
    const DAY = connectedNetwork === "testnet" ? 480 : 86400;
    const WEEK = 7 * DAY;

    const now = Math.floor(new Date().getTime() / 1000);

    const timeSpan = days
      ? days
      : Math.floor(new Date(userSelectedDate as string).getTime() / 1000) - now;

    const lockEnd =
      timeSpan >= MAX_TIME
        ? Math.floor((now + timeSpan) / WEEK) * WEEK
        : Math.floor((now + (timeSpan + WEEK - 1)) / WEEK) * WEEK;

    props.setLockingDate(dateFormat(lockEnd * 1000));
    if (Number(props.updatedPlyVoteValue) > 0) {
      const res = estimateVotingPower(
        new BigNumber(Number(props.updatedPlyVoteValue) + Number(props.manageData.baseValue)),
        lockEnd
      );
      setVotingPower(res);
    }
    props.setLockingEndData({ selected: days ? days : 0, lockingDate: lockEnd });
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };

  const ManageLockProceedButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect Wallet
        </Button>
      );
    } else if (Number(props.updatedPlyVoteValue) <= 0 && Number(props.lockingDate) <= 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Increase Lock
        </Button>
      );
    } else if (
      walletAddress &&
      props.updatedPlyVoteValue &&
      Number(props.updatedPlyVoteValue) > Number(props.plyBalance)
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button color={"primary"} onClick={() => setScreen("2")}>
          Increase Lock
        </Button>
      );
    }
  }, [props]);
  const onClickAmount = () => {
    handlePlyInput(Number(props.plyBalance));
  };

  return props.show ? (
    <PopUpModal
      onhide={closeModal}
      Name={"Manage"}
      className="w-[400px] max-w-[400px] py-2 px-0 md:w-[602px] md:max-w-[602px]"
    >
      {screen === "1" ? (
        <>
          <div className="px-4 md:px-6  mx-2 text-white font-title3">Manage Lock</div>
          <TopBar manageData={props.manageData} />
          <div
            className={clsx(
              "mx-4 md:mx-6 border pl-4 pr-5  bg-muted-200/[0.1] items-center flex  rounded-2xl h-[86px] hover:border-text-700 ",
              isFirstInputFocus ? "border-text-700" : "border-text-800 ",
              "mt-3"
            )}
          >
            <div className="flex-auto">
              <p>
                <input
                  type="text"
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-500 "
                  placeholder="0.0"
                  value={props.updatedPlyVoteValue}
                  onChange={(e) => handlePlyInput(e.target.value)}
                  onFocus={() => setIsFirstInputFocus(true)}
                  onBlur={() => setIsFirstInputFocus(false)}
                />
              </p>
              <p>
                <span className="mt-2 ml-1 font-body4 text-text-400">
                  ~$
                  {props.tokenPrice["PLY"]
                    ? Number(Number(props.updatedPlyVoteValue) * props.tokenPrice["PLY"]).toFixed(2)
                    : "0.00"}
                </span>
              </p>
            </div>

            <div
              className="cursor-pointer w-[55%] sm:w-auto ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3"
              onClick={onClickAmount}
            >
              <div>
                <Image src={wallet} width={"32px"} height={"32px"} />
              </div>
              <div className=" ml-1 text-primary-500 font-body2">
                {Number(props.plyBalance) >= 0 ? Number(props.plyBalance) : "0.00"} PLY
              </div>
            </div>
          </div>
          <div className="mr-4 md:mr-6 ml-auto mt-3 flex font-body4">
            <p
              className={clsx(
                "cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex",
                props.updatedPlyVoteValue !== "" &&
                  Number(props.updatedPlyVoteValue) === 0.25 * Number(props.plyBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.plyBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.25) })}
            >
              25%
            </p>
            <p
              className={clsx(
                "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex",
                props.updatedPlyVoteValue !== "" &&
                  Number(props.updatedPlyVoteValue) === 0.5 * Number(props.plyBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.plyBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.5) })}
            >
              50%
            </p>
            <p
              className={clsx(
                "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex",
                props.updatedPlyVoteValue !== "" &&
                  Number(props.updatedPlyVoteValue) === 0.75 * Number(props.plyBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.plyBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.75) })}
            >
              75%
            </p>
          </div>
          <div
            className={clsx(
              "mx-4 md:mx-6 bg-muted-400 border border-text-800 rounded-2xl py-5 mt-5",
              "mt-3"
            )}
          >
            <div className=" px-3 md:px-5 text-text-50 font-subtitle1">Choose lock end </div>
            <div className="mt-2 rounded-lg ml-5 mr-[24px] border-[1.3px] border-border-200 pr-5 pl-4 flex items-center h-[62px] hover:border-text-700">
              <div>
                <input
                  type="text"
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-subtitle6  md:font-subtitle6 outline-none w-[100%] placeholder:text-text-500"
                  placeholder="dd/mm/yyyy"
                  disabled
                  value={props.lockingDate}
                  onChange={(e) => props.setLockingDate(e.target.value)}
                />{" "}
              </div>
              <div className="ml-auto cursor-pointer">
                <Image src={calender} onClick={() => setIsDatePickerOpen(true)} />
                <Datepicker
                  selectedDate={new Date()}
                  startTimeStamp={dateRange.startTimeStamp}
                  endTimeStamp={dateRange.endTimeStamp}
                  setStartDate={handleDateSelection}
                  isOpen={isDatePickerOpen}
                  setIsOpen={setIsDatePickerOpen}
                  yearsToEnable={dateRange.years}
                  alloweDates={dateRange.alloweDates}
                />
              </div>
            </div>
            <div className="mt-3 px-3 md:px-5 flex gap-2">
              <p>
                <ToolTip
                  toolTipChild={
                    <div className="w-[210px] text-center">
                      Lock for 4 years for maximum voting power of 4000
                    </div>
                  }
                  id="tooltip8"
                  position={Position.top}
                >
                  <p
                    className={clsx(
                      "rounded-[32px] bg-muted-200/[0.1] border border-border-200 px-[13px] md:px-[25px] flex items-center h-[44px] text-text-500 font-subtitle1  md:font-subtitle3 cursor-pointer",
                      props.lockingEndData.selected === MAX_TIME
                        ? "bg-card-500 border-primary-500"
                        : "bg-muted-200/[0.1] border-border-200"
                    )}
                    onClick={() => handleDateSelection(MAX_TIME, undefined)}
                  >
                    Max lock
                  </p>
                </ToolTip>
              </p>
            </div>
            <div className={clsx("mt-3 border-t border-text-800/[0.5]")}></div>
            <div className={clsx("px-5 flex  flex items-center space-between", "mt-2")}>
              <div className="text-text-250 w-[155px] md:w-auto font-mobile-f1020 md:font-subtitle3">
                Your will receive a veNFT with a voting power of{" "}
              </div>
              <div className="ml-auto px-3 h-[38px] flex items-center text-primary-500 bg-primary-500/[0.1] rounded-[30px]">
                ~ {isNaN(votingPower) ? "0.00" : votingPower.toFixed(2)}
              </div>
            </div>
          </div>

          <div className={clsx("mx-4 md:mx-6 ", "mt-3")}>{ManageLockProceedButton}</div>
        </>
      ) : (
        <ConfirmLocking
          setScreen={setScreen}
          setShowCreateLockModal={props.setShowCreateLockModal}
          setShowConfirmTransaction={props.setShowConfirmTransaction}
          handleLockOperation={
            props.updatedPlyVoteValue !== "" && props.lockingEndData.selected === 0
              ? props.IncreaseLockValueOperation
              : props.updatedPlyVoteValue !== "" && props.lockingEndData.selected !== 0
              ? props.handleIncreaseVoteOperation
              : props.IncreaseLockEndOperation
          }
          votingPower={votingPower}
          ctaText={"Increase Lock"}
          endDate={
            props.lockingDate === "" ? dateFormat(props.manageData.endTimeStamp) : props.lockingDate
          }
        />
      )}
    </PopUpModal>
  ) : null;
}

export default ManageLock;
