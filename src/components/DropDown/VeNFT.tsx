import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import vectorIcon from "../../assets//icon/common/vector.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { IVeNFTData } from "../../api/votes/types";

export interface IDropdownProps {
  Options: IVeNFTData[];
  onClick: Function;
  selectedText: {
    votingPower: string;
    tokenId: string;
  };
  title: string;
  className?: string;
  isConfirmStake?: boolean;
}

export function VeNFT(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  return (
    <div className={`relative min-w-[150px] ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]   flex gap-2 md:gap-4 py-3 md:py-2 px-2 md:px-3 justify-between border border-text-700 rounded-lg",
          isDropDownActive ? "hover:bg-text-800/[0.25]" : "hover:bg-text-800/[0.5]",
          props.Options.length === 0
            ? "border-border-200 bg-card-200 hover:bg-card-200 hover:border-border-200"
            : props.selectedText.votingPower === ""
            ? "border-text-700 bg-text-800/[0.25]"
            : "border-primary-800 bg-primary-250",

          props.Options.length === 0 ||
            (props.isConfirmStake && props.selectedText.votingPower !== "")
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
              : props.selectedText.votingPower === ""
              ? "text-text-600"
              : "text-text-500"
          )}
        >
          {props.selectedText.votingPower !== "" && props.selectedText.tokenId !== "" ? (
            <>
              <span className="font-body4 text-white">
                {Number(props.selectedText.votingPower).toFixed(3)}x
              </span>
              <span className="font-body3 text-text-500">(#{props.selectedText.tokenId})</span>
            </>
          ) : (
            <>
              <span className={clsx("hidden md:block  md:font-body4")}>{props.title}</span>{" "}
              <span className="block md:hidden font-subtitle1 md:font-body4">
                Select your veNFT
              </span>
            </>
          )}
        </p>
        <Image
          src={vectorIcon}
          className={!isDropDownActive ? "rotate-180" : "rotate-0"}
          {...((props.isConfirmStake && props.selectedText.votingPower !== "") ||
          props.Options.length === 0
            ? {}
            : { onClick: () => setIsDropDownActive(!isDropDownActive) })}
        />
      </div>
      {isDropDownActive && props.Options.length > 0 && (
        <div
          className={clsx(
            "absolute z-20 w-[124px] md:w-[163px] mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1",
            props.isConfirmStake && props.selectedText.votingPower !== "" && "hidden"
          )}
        >
          {props.Options.map((text, i) => (
            <Options
              onClick={props.onClick}
              key={`${text.tokenId}_${i}`}
              votingPower={text.votingPower.toString()}
              tokenId={text.tokenId.toString()}
            />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: { onClick: Function; votingPower: string; tokenId: string }) {
    return (
      <div
        onClick={() => {
          props.onClick({
            votingPower: props.votingPower,
            tokenId: props.tokenId,
          });
          setIsDropDownActive(false);
        }}
        className="  hover:bg-muted-500 px-4 flex items-center h-[36px] cursor-pointer flex"
      >
        <span className="font-body4 text-white">{Number(props.votingPower).toFixed(3)}x</span>
        <span className="ml-auto font-body3 text-text-500">#{props.tokenId}</span>
      </div>
    );
  }
}
