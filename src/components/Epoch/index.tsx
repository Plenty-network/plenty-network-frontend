import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import vectorDown from "../../assets/icon/common/vector.svg";
import { useCountdown } from "../../hooks/useCountDown";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IEpochListObject } from "../../api/votes/types";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../redux";
import { getEpochData, setSelectedEpoch } from "../../redux/epoch/epoch";

export interface IEpochProps {
  onClick: Function;
  selectedText: string;
  className?: string;
  title?: string;
}

export function Epoch(props: IEpochProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const epochData = store.getState().epoch.epochData;
  const currentEpoch = store.getState().epoch.currentEpoch;
  const selectedEpoch = store.getState().epoch.selectedEpoch;
  const reff = React.useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });

  React.useEffect(() => {
    dispatch(setSelectedEpoch(epochData[0]));
    console.log(epochData[0]?.epochNumber);
    props.onClick(currentEpoch?.epochNumber);
  }, [currentEpoch?.epochNumber, epochData[0]?.epochNumber]);

  function Options(props: {
    onClick: Function;
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
          props.onClick(props.epochNumber);
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
  if (minutes < 0 || seconds < 0) {
    dispatch(getEpochData());
    console.log(epochData[0]?.epochNumber);
    dispatch(setSelectedEpoch(epochData[0]));
    props.onClick(currentEpoch?.epochNumber);
  }

  return (
    <>
      <div className="relative flex gap-[10px] p-[14px]" ref={reff}>
        <Image src={epoachIcon} />
        <div className="flex flex-col gap-[6px]">
          <div className="flex gap-1">
            <p className="text-text-250 text-f12">
              Epoch{" "}
              <span className="text-white">
                {selectedEpoch?.epochNumber
                  ? selectedEpoch.epochNumber
                  : epochData[0]?.epochNumber
                  ? epochData[0].epochNumber
                  : 0}
              </span>
            </p>
            <InfoIconToolTip message="Epoch lipsum" />
            <Image
              className="rotate-180"
              src={vectorDown}
              onClick={() => setIsDropDownActive(!isDropDownActive)}
            />
          </div>
          <div className="flex gap-2 text-f12 text-white font-semibold cursor-pointer">
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
                onClick={props.onClick}
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
