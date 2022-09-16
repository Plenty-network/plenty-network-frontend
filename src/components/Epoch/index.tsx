import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";

import info from "../../assets/icon/swap/info.svg";
import vectorDown from "../../assets/icon/common/vector.svg";
import { useCountdown } from "../../hooks/useCountDown";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IEpochListObject } from "../../api/util/types";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../redux";
import { getEpochData, setSelectedEpoch } from "../../redux/epoch/epoch";
import { useInterval } from "../../hooks/useInterval";
import { ToolTip } from "../Tooltip/TooltipAdvanced";
import { useRouter } from "next/router";

export interface IEpochProps {
  className?: string;
  title?: string;
}

export function Epoch(props: IEpochProps) {
  const router = useRouter();
  console.log(router);
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const epochData = store.getState().epoch.epochData;
  const currentEpoch = store.getState().epoch.currentEpoch;
  const selectedEpoch = store.getState().epoch.selectedEpoch;
  const reff = React.useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  const indexOfCurrent = epochData.findIndex((data: IEpochListObject) => data.isCurrent === true);

  React.useEffect(() => {
    dispatch(setSelectedEpoch(currentEpoch));
  }, [epochData[indexOfCurrent]?.epochNumber, currentEpoch?.endTimestamp]);

  function Options(props: {
    startDate: number;
    epochNumber: number;
    isCurrent?: boolean;
    epoch: IEpochListObject;
  }) {
    var date = new Date(props.startDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Decr",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    const dispatch = useDispatch<AppDispatch>();
    return (
      <div
        onClick={() => {
          dispatch(setSelectedEpoch(props.epoch));
          setIsDropDownActive(false);
        }}
        className="hover:bg-primary-700 px-5 flex font-body4 text-text-50 items-center h-[36px] cursor-pointer"
      >
        {props.isCurrent
          ? `Epoch${props.epochNumber} (current)`
          : `Epoch${props.epochNumber} (${day}-${monthNames[month]}-${year.toString().substr(-2)})`}
      </div>
    );
  }

  const [days, hours, minutes, seconds] = useCountdown(
    currentEpoch?.endTimestamp ? currentEpoch.endTimestamp : Date.now()
  );
  useInterval(() => {
    if (minutes < 0 || seconds < 0) {
      dispatch(getEpochData());
      dispatch(setSelectedEpoch(epochData[indexOfCurrent]));
    }
  }, 5000);

  return (
    <>
      <div className="relative flex gap-[10px] p-[14px]" ref={reff}>
        <Image src={epoachIcon} />
        <div
          className={clsx(
            " flex flex-col gap-[6px]",
            router.pathname.includes("Vote") ? "cursor-pointer" : "cursor-not-allowed"
          )}
          {...(router.pathname.includes("Vote")
            ? { onClick: () => setIsDropDownActive(!isDropDownActive) }
            : {})}
        >
          <div className="flex items-center  gap-1">
            <p className="relative top-[2px]">
              <ToolTip
                id="tooltipM"
                toolTipChild={
                  <div className="w-[200px]">
                    A weekly voting period that starts every Thursday, 12:00 AM (UTC)
                  </div>
                }
              >
                <Image src={info} width={"14px"} height={"14px"} />
              </ToolTip>
            </p>

            <p className="text-text-250 text-f12">
              Epoch{" "}
              <span className="text-white">
                {!router.pathname.includes("Vote")
                  ? epochData[indexOfCurrent]?.epochNumber
                  : selectedEpoch?.epochNumber
                  ? selectedEpoch.epochNumber
                  : epochData[indexOfCurrent]?.epochNumber
                  ? epochData[indexOfCurrent].epochNumber
                  : 0}
                {selectedEpoch?.epochNumber === epochData[indexOfCurrent]?.epochNumber &&
                  " (current) "}
              </span>
            </p>
            <p className="relative -top-[1.5px]">
              <Image className="rotate-180" src={vectorDown} />
            </p>
          </div>
          <div className="flex gap-2 -mt-[6px] text-f12 text-white font-semibold cursor-pointer">
            <span className="flex gap-1">
              <span>{days} d</span>:<span>{hours} h</span>:<span>{minutes} m</span>:
              <span>{seconds} s</span>
            </span>
          </div>
        </div>
        {isDropDownActive && (
          <div
            className={clsx(
              "absolute  top-[60px] max-w-[220px] w-[210px] z-50  mt-2 py-4 w-full bg-muted-600  rounded-2xl flex flex-col gap-1"
            )}
          >
            {epochData.map((text, i) => (
              <Options
                key={`${text.epochNumber}_${i}`}
                startDate={text.startTimestamp}
                epochNumber={text.epochNumber}
                isCurrent={text.isCurrent}
                epoch={text}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
