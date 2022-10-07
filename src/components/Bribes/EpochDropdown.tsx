import Image from "next/image";
import * as React from "react";
import clsx from "clsx";

import arrow from "../../assets/icon/vote/arrowNFT.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";

export interface IDropdownProps {
  Options: {
    epoch: number;
    start: number;
    end: number;
  }[];
  onClick: Function;
  selectedText: {
    epoch: number;
    start: number;
    end: number;
  };
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
      "Decr",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return `(${day} ${monthNames[month]},${year.toString()})`;
  };
  return (
    <div className={`relative min-w-[76px] md:min-w-[256px]  ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]  cursor-pointer flex gap-2 md:gap-4  px-2 md:px-5  h-[56px]  flex items-center md:justify-between border  rounded-2xl hover:border-text-700 hover:bg-text-800/[0.25]",
          isDropDownActive
            ? "bg-muted-500 border-muted-300 hover:bg-muted-500 hover:border-muted-300"
            : "border-text-800 bg-text-800/[0.25] hover:border-text-700 hover:bg-text-800/[0.25]",
          props.classNameInner
        )}
        onClick={() => (!props.isDisabled ? setIsDropDownActive(!isDropDownActive) : "")}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p className={clsx(" flex gap-1", isDropDownActive ? "text-white" : "text-text-600")}>
          {props.selectedText.epoch ? (
            <p
              className="text-white flex"
              style={{
                textOverflow: "ellipsis",
                width: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Epoch {props.selectedText.epoch}{" "}
              <span className="text-text-500 font-body4 ml-1">
                {dateFormat(props.selectedText.start)} to {dateFormat(props.selectedText.end)}
              </span>
            </p>
          ) : (
            <>
              <span className="hidden md:block  md:font-body4">{props.title}</span>{" "}
              <span className="font-subtitle1 md:hidden md:font-body4">{props.title}</span>
            </>
          )}
        </p>
        <p className="ml-auto relative top-1">
          <Image
            src={arrow}
            className={!isDropDownActive ? "rotate-0 ml-auto" : "rotate-180 ml-auto"}
          />
        </p>
      </div>
      {isDropDownActive && !props.isDisabled && (
        <div className="absolute  mt-2 py-2 w-[325px] bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1 z-10">
          {props.Options.map((text, i) => (
            <Options onClick={props.onClick} key={`${text}_${i}`} text={text} />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: {
    onClick: Function;
    text: {
      epoch: number;
      start: number;
      end: number;
    };
  }) {
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
        "Decr",
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
        Epoch {props.text.epoch}{" "}
        <span className="text-text-500 font-body4 ml-1">
          {dateFormat(props.text.start)} to {dateFormat(props.text.end)}
        </span>
      </div>
    );
  }
}
