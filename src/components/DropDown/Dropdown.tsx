import Image from "next/image";
import * as React from "react";
import clsx from "clsx";

import arrow from "../../assets/icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";

export interface IDropdownProps {
  Options: Array<string>;
  onClick: Function;
  selectedText: string;
  className?: string;
  classNameInner?: string;
  title?: string;
  isDisabled?: boolean;
}

export function Dropdown(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  return (
    <div className={`relative min-w-[76px] md:min-w-[150px] ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]  cursor-pointer flex gap-2 md:gap-4 py-2 px-2 md:px-3 md:justify-between border  rounded-lg hover:border-text-700 hover:bg-text-800/[0.25]",
          isDropDownActive
            ? "bg-muted-500 border-muted-300 hover:bg-muted-500 hover:border-muted-300"
            : "border-text-800 bg-text-800/[0.25] hover:border-text-700 hover:bg-text-800/[0.25]",
          props.classNameInner
        )}
        onClick={() => (!props.isDisabled ? setIsDropDownActive(!isDropDownActive) : "")}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p className={clsx(" flex gap-1", isDropDownActive ? "text-white" : "text-text-600")}>
          {props.selectedText && props.selectedText.length ? (
            <span className="text-white">{props.selectedText}</span>
          ) : (
            <>
              <span className="hidden md:block  md:font-body4">{props.title && props.title}</span>{" "}
              <span className="font-subtitle1 md:hidden md:font-body4">
                {props.title && props.title}
              </span>
            </>
          )}
        </p>
        <p className="ml-auto relative -top-0">
          <Image
            src={arrow}
            className={isDropDownActive ? "rotate-0 ml-auto" : "rotate-180 ml-auto"}
          />
        </p>
      </div>
      {isDropDownActive && !props.isDisabled && (
        <div className="absolute  mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1 z-10">
          {props.Options.map((text, i) => (
            <Options onClick={props.onClick} key={`${text}_${i}`} text={text} />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: { onClick: Function; text: string }) {
    return (
      <div
        onClick={() => {
          props.onClick(props.text);
          setIsDropDownActive(false);
        }}
        className=" hover:bg-muted-500 px-2 flex items-center h-[36px] z-10 cursor-pointer"
      >
        {props.text}
      </div>
    );
  }
}
