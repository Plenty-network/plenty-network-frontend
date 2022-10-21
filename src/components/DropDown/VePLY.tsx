import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import vectorIcon from "../../assets//icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IVePLYData } from "../../api/stake/types";
import { ELocksState } from "../../api/votes/types";
import loader from "../../assets/animations/shimmer-swap.json";
import Lottie from "lottie-react";

export interface IDropdownProps {
  Options: IVePLYData[];
  onClick: Function;
  selectedText: IVePLYData;
  className?: string;
  isConfirmStake?: boolean;
  isListLoading?: boolean;
}

export function VePLY(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  return (
    <div className={`relative min-w-[100px] md:min-w-[150px] ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "  flex gap-2 md:gap-4 py-2.5 px-2 md:px-3 justify-between border border-text-700 rounded-lg",
          isDropDownActive ? "hover:bg-text-800/[0.25]" : "hover:bg-text-800/[0.5]",
          props.Options.length === 0
            ? "border-border-200 bg-card-200 hover:bg-card-200 hover:border-border-200"
            : props.selectedText.boostValue === ""
            ? "border-primary-800 bg-card-500"
            : "border-primary-800 bg-primary-250",

          props.Options.length === 0 ||
            (props.isConfirmStake && props.selectedText.boostValue !== "")
            ? "cursor-not-allowed"
            : "cursor-pointer"
        )}
        onClick={
          props.Options.length === 0 ? () => {} : () => setIsDropDownActive(!isDropDownActive)
        }
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
              <span className={clsx("hidden md:block  md:font-body4")}>
                {props.isListLoading
                  ? "Loading..."
                  : props.Options.length !== 0
                  ? "Select veNFT"
                  : "No veNFT!"}
              </span>{" "}
              <span className="font-subtitle1 md:font-body4 md:hidden">veNFT</span>
            </>
          )}
        </p>
        {props.isListLoading ? (
          <Lottie animationData={loader} loop={true} style={{ height: "20px", width: "20px" }} />
        ) : (
          <Image
            src={vectorIcon}
            alt={"vectorIcon"}
            className={!isDropDownActive ? "rotate-180" : "rotate-0"}
          />
        )}
      </div>
      {isDropDownActive && props.Options.length > 0 && (
        <div
          className={clsx(
            "absolute z-10 max-h-[210px] overflow-y-auto w-[124px] md:w-[163px] mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1",
            props.isConfirmStake && props.selectedText.boostValue !== "" && "hidden"
          )}
        >
          {props.Options.map((text, i) => (
            <Options
              onClick={props.onClick}
              key={`${text.tokenId}_${i}`}
              boostValue={text.boostValue}
              tokenId={text.tokenId}
              options={text}
            />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: {
    onClick: Function;
    boostValue: string;
    tokenId: string;
    options: IVePLYData;
  }) {
    return (
      <div
        onClick={
          props.options.lockState === ELocksState.EXPIRED
            ? () => {}
            : () => {
                props.onClick({
                  boostValue: props.boostValue,
                  tokenId: props.tokenId,
                });
                setIsDropDownActive(false);
              }
        }
        className={clsx(
          "  hover:bg-muted-500 px-4 py-2 flex items-center h-[36px]  flex",
          props.options.lockState === ELocksState.EXPIRED ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={clsx(
            "font-body4 ",
            props.options.lockState === ELocksState.EXPIRED ? "text-text-800" : "text-white"
          )}
        >
          {props.boostValue}x
        </span>
        <span
          className={clsx(
            "ml-auto font-body3 ",
            props.options.lockState === ELocksState.EXPIRED ? "text-text-800" : "text-text-500"
          )}
        >
          #{props.tokenId}
        </span>
      </div>
    );
  }
}
