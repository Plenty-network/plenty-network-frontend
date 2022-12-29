import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useDispatch } from "react-redux";
import { IEpochListObject } from "../../api/util/types";
import vectorDown from "../../assets/icon/common/vector.svg";

import epoch from "../../assets/icon/navigation/epoch.svg";
import { useCountdown } from "../../hooks/useCountDown";
import { useInterval } from "../../hooks/useInterval";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { getEpochData, setSelectedEpoch } from "../../redux/epoch/epoch";

export interface IMobileEpochProps {}

export function MobileEpoch(props: IMobileEpochProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const dispatch = useDispatch<AppDispatch>();
  const indexOfCurrent = epochData.findIndex((data: IEpochListObject) => data.isCurrent === true);
  const [days, hours, minutes, seconds] = useCountdown(
    currentEpoch?.endTimestamp ? currentEpoch.endTimestamp : Date.now()
  );
  useInterval(() => {
    if (minutes < 0 || seconds < 0) {
      dispatch(getEpochData());
      dispatch(setSelectedEpoch(epochData[indexOfCurrent]));
    }
  }, 5000);
  const router = useRouter();
  return (
    <div className="z-50 ">
      <div
        className={`flex justify-between cursor-pointer py-2 px-5 ${
          currentEpoch.isCurrent ? "bg-primary-700" : ""
        }`}
        onClick={
          router.pathname.includes("vote") ? () => setIsDropDownActive(!isDropDownActive) : () => {}
        }
      >
        <p className="text-white font-body4">
          Epoch
          <span className="text-white ml-1">
            {!router.pathname.includes("vote")
              ? epochData[indexOfCurrent]?.epochNumber
              : selectedEpoch?.epochNumber
              ? selectedEpoch.epochNumber
              : epochData[indexOfCurrent]?.epochNumber
              ? epochData[indexOfCurrent].epochNumber
              : 0}
            <span className="font-body2 text-text-250 ml-1">
              {selectedEpoch?.epochNumber === epochData[indexOfCurrent]?.epochNumber
                ? " (current) "
                : ""}
            </span>
          </span>
        </p>
        {router.pathname.includes("vote") && (
          <Image
            alt={"alt"}
            className={isDropDownActive ? "rotate-0" : "rotate-180"}
            src={vectorDown}
          />
        )}
      </div>
      {isDropDownActive && router.pathname.includes("vote") && (
        <>
          {epochData.map((epoch, i) => (
            <EpochOptions
              key={i}
              text={epoch.epochNumber}
              isCurrent={epoch.isCurrent}
              onClick={() => {
                dispatch(setSelectedEpoch(epoch));
                setIsDropDownActive(false);
              }}
              isActive={epoch.epochNumber === selectedEpoch.epochNumber}
            />
          ))}
        </>
      )}
    </div>
  );
}

export interface IEpochOptionsProps {
  text: string | number;
  onClick: Function;
  isActive: boolean;
  isCurrent: boolean;
}

export function EpochOptions(props: IEpochOptionsProps) {
  return (
    <div
      className={`flex justify-between cursor-pointer font-body4  py-2 px-5 ${
        props.isActive ? "bg-primary-700" : ""
      }`}
      onClick={props.onClick ? () => props.onClick() : () => {}}
    >
      Epoch {props.text} {props.isCurrent ? "(current)" : ""}
    </div>
  );
}
