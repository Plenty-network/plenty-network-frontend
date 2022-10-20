import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import { isMobile } from "react-device-detect";
import arrow from "../../assets/icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IEpochListObject } from "../../api/util/types";

export interface IDropdownProps {
  Options: IEpochListObject[];
  onClick: Function;
  selectedText: IEpochListObject;
  className?: string;
  classNameInner?: string;
  title?: string;
  isDisabled?: boolean;
}

export function EpochDropdown(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });

  const dateFormat = (timestamp: number) => {
    var date = new Date(timestamp);

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
      "Dec",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return `(${day} ${monthNames[month]},${year.toString()})`;
  };
  return (
    <div className={`relative min-w-[90px] md:min-w-[256px]  ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]  cursor-pointer flex gap-1 md:gap-4  px-2 md:px-5  h-[40px] md:h-[56px]  flex items-center md:justify-between border  rounded-2xl hover:border-text-700 hover:bg-text-800/[0.25]",
          props.isDisabled
            ? "border-border-200 bg-muted-200/[0.1]"
            : isDropDownActive
            ? "bg-muted-500 border-muted-300 hover:bg-muted-500 hover:border-muted-300"
            : "border-text-800 bg-text-800/[0.25] hover:border-text-700 hover:bg-text-800/[0.25]",
          props.classNameInner
        )}
        onClick={() => (!props.isDisabled ? setIsDropDownActive(!isDropDownActive) : "")}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p
          className={clsx(
            " flex gap-1",
            props.isDisabled ? "text-text-800" : isDropDownActive ? "text-white" : "text-text-600"
          )}
        >
          {props.selectedText.epochNumber ? (
            <p className="text-white flex font-subtitle4">
              Epoch {props.selectedText.epochNumber}{" "}
              <span className="text-text-500 font-body4 ml-1">
                <p
                  style={{
                    textOverflow: "ellipsis",
                    width: `${isMobile ? "40px" : "97px"}`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {dateFormat(props.selectedText.startTimestamp)} to{" "}
                  {dateFormat(props.selectedText.endTimestamp)}
                </p>
              </span>
            </p>
          ) : (
            <>
              <span className={clsx("hidden md:block  md:font-body4")}>{props.title}</span>{" "}
              <span className="font-subtitle1 md:hidden md:font-body4">{props.title}</span>
            </>
          )}
        </p>
        {!props.isDisabled && (
          <p className="ml-auto relative -top-0">
            <Image
              src={arrow}
              className={isDropDownActive ? "rotate-0 ml-auto" : "rotate-180 ml-auto"}
            />
          </p>
        )}
      </div>
      {isDropDownActive && !props.isDisabled && (
        <div className="absolute  mt-2 py-2 w-[335px] bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1 z-10">
          {props.Options.map((text, i) => (
            <Options onClick={props.onClick} key={`${text}_${i}`} text={text} />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: { onClick: Function; text: IEpochListObject }) {
    const dateFormat = (timestamp: number) => {
      var date = new Date(timestamp);

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
        "Dec",
      ];

      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      return `(${day} ${monthNames[month]},${year.toString()})`;
    };
    return (
      <div
        onClick={() => {
          props.onClick(props.text);
          setIsDropDownActive(false);
        }}
        className=" hover:bg-muted-500 px-5 font-subtitle4 text-white flex items-center h-[36px] z-10 cursor-pointer "
      >
        Epoch {props.text.epochNumber}{" "}
        <span className="text-text-500 font-body4 ml-1">
          {dateFormat(props.text.startTimestamp)} to {dateFormat(props.text.endTimestamp)}
        </span>
      </div>
    );
  }
}
