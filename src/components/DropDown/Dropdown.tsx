import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import vectorIcon from "../../assets//icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";

export interface IDropdownProps {
  Options: Array<string>;
  onClick: Function;
  selectedText: string;
  className?: string;
  classNameInner?: string;
  title?: string;
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
          "bg-text-800/[0.25]  cursor-pointer flex gap-2 md:gap-4 py-2 px-2 md:px-3 md:justify-between border border-text-700 rounded-lg",
          isDropDownActive ? "hover:bg-text-800/[0.25]" : "hover:bg-text-800/[0.5]",props.classNameInner
        )}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p className={clsx(" flex gap-1", isDropDownActive ? "text-muted-50" : "text-text-600")}>
          {props.selectedText && props.selectedText.length ? (
            <span className="text-white">{props.selectedText}</span>
          ) : (
            <>
              <span className="hidden md:block  md:font-body4">
                {props.title ? props.title : "Select"}
              </span>{" "}
              <span className="font-subtitle1 md:hidden md:font-body4">
                {props.title ? "My votes" : "vePLY"}
              </span>
            </>
          )}
        </p>
        <p className="ml-auto">
          <Image
            src={vectorIcon}
            className={!isDropDownActive ? "rotate-180 ml-auto" : "rotate-0 ml-auto"}
            onClick={() => setIsDropDownActive(!isDropDownActive)}
          />
        </p>
      </div>
      {isDropDownActive && (
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
