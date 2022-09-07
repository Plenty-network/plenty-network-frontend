import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import vectorIcon from "../../assets//icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IVePLYData } from "../../api/stake/types";

export interface IDropdownProps {
  Options: IVePLYData[];
  onClick: Function;
  selectedText: IVePLYData;
  className?: string;
  isConfirmStake?: boolean;
}

export function VePLY(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  return (
    <div className={`relative min-w-[76px] md:min-w-[150px] ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]   flex gap-2 md:gap-4 py-2 px-2 md:px-3 md:justify-between border border-text-700 rounded-lg",
          isDropDownActive ? "hover:bg-text-800/[0.25]" : "hover:bg-text-800/[0.5]",
          props.Options.length === 0
            ? "border-border-200 bg-card-200 hover:bg-card-200 hover:border-border-200"
            : props.selectedText.boostValue === ""
            ? "border-text-700 bg-text-800/[0.25]"
            : "border-primary-800 bg-primary-250",

          props.Options.length === 0 ||
            (props.isConfirmStake && props.selectedText.boostValue !== "")
            ? "cursor-not-allowed"
            : "cursor-pointer"
        )}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p
          className={clsx(
            " flex gap-1",
            isDropDownActive && "text-text-500",

            props.Options.length === 0
              ? "text-text-700"
              : props.selectedText.boostValue === ""
              ? "text-text-600"
              : "text-text-500"
          )}
        >
          {props.selectedText.boostValue !== "" && props.selectedText.tokenId !== "" ? (
            <>
              <span className="font-body4 text-white">{props.selectedText.boostValue}x</span>
              <span className="font-body3 text-text-500">(#{props.selectedText.tokenId})</span>
            </>
          ) : (
            <>
              <span className={clsx("hidden md:block  md:font-body4")}>Select</span>{" "}
              <span className="font-subtitle1 md:font-body4">vePLY</span>
            </>
          )}
        </p>
        <Image
          src={vectorIcon}
          className={!isDropDownActive ? "rotate-180" : "rotate-0"}
          {...((props.isConfirmStake && props.selectedText.boostValue !== "") ||
          props.Options.length === 0
            ? {}
            : { onClick: () => setIsDropDownActive(!isDropDownActive) })}
        />
      </div>
      {isDropDownActive && props.Options.length > 0 && (
        <div
          className={clsx(
            "absolute h-[210px] overflow-y-auto w-[124px] md:w-[163px] mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1",
            props.isConfirmStake && props.selectedText.boostValue !== "" && "hidden"
          )}
        >
          {props.Options.map((text, i) => (
            <Options
              onClick={props.onClick}
              key={`${text.tokenId}_${i}`}
              boostValue={text.boostValue}
              tokenId={text.tokenId}
            />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: { onClick: Function; boostValue: string; tokenId: string }) {
    return (
      <div
        onClick={() => {
          props.onClick({
            boostValue: props.boostValue,
            tokenId: props.tokenId,
          });
          setIsDropDownActive(false);
        }}
        className="  hover:bg-muted-500 px-4 py-2 flex items-center h-[36px] cursor-pointer flex"
      >
        <span className="font-body4 text-white">{props.boostValue}x</span>
        <span className="ml-auto font-body3 text-text-500">#{props.tokenId}</span>
      </div>
    );
  }
}
