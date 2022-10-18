import Image from "next/image";
import * as React from "react";
import clsx from "clsx";

import arrow from "../../assets/icon/vote/arrowNFT.svg";
import Rewards from "../../assets/icon/myPortfolio/rewards.svg";
import Positions from "../../assets/icon/myPortfolio/positions.svg";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { MyPortfolioSection } from "../../../pages/myportfolio";

export interface IDropdownProps {
  Options: Array<string>;
  onClick: React.Dispatch<React.SetStateAction<MyPortfolioSection>>;
  selectedText: MyPortfolioSection;
  className?: string;
  classNameInner?: string;
  title?: string;
  isDisabled?: boolean;
}

export function PortfolioDropdown(props: IDropdownProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  return (
    <div className={`relative w-[150px] ${props.className}`} ref={reff}>
      <div
        className={clsx(
          "bg-text-800/[0.25]  cursor-pointer flex gap-2 md:gap-4 py-1.5 px-2 md:px-3 md:justify-between border  rounded-lg hover:border-text-700 hover:bg-text-800/[0.25]",
          isDropDownActive
            ? "bg-muted-500 border-muted-300 hover:bg-muted-500 hover:border-muted-300"
            : "border-text-800 bg-text-800/[0.25] hover:border-text-700 hover:bg-text-800/[0.25]",
          props.classNameInner
        )}
        onClick={() => (!props.isDisabled ? setIsDropDownActive(!isDropDownActive) : "")}
        // onClick={() => setIsDropDownActive(true)}
      >
        <p
          className={clsx(
            " flex items-center gap-1",
            isDropDownActive ? "text-white" : "text-text-600"
          )}
        >
          {props.selectedText && (
            <span className="text-text-250 flex items-center">
              {props.selectedText}{" "}
              <span className="relative top-1">
                {props.selectedText === MyPortfolioSection.Positions ? (
                  <Image alt={"alt"} src={Positions} />
                ) : (
                  <Image alt={"alt"} src={Rewards} />
                )}
              </span>
            </span>
          )}
        </p>
        <p className="ml-auto relative top-1.5">
          <Image
            src={arrow}
            className={!isDropDownActive ? "rotate-0 ml-auto" : "rotate-180 ml-auto"}
          />
        </p>
      </div>
      {isDropDownActive && !props.isDisabled && (
        <div className="absolute w-[150px] mt-2 py-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1 z-10">
          {props.Options.map((text, i) => (
            <Options onClick={props.onClick} key={`${text}_${i}`} text={text} />
          ))}
        </div>
      )}
    </div>
  );

  function Options(props: { onClick: Function; text: string }) {
    return (
      <p
        className={clsx(
          " font-title3 cursor-pointer box-border py-3 w-[147px] flex items-center pl-4 gap-1",
          "text-text-250  rounded-l-lg"
        )}
        onClick={() => {
          props.onClick(
            props.text === MyPortfolioSection.Positions
              ? MyPortfolioSection.Positions
              : MyPortfolioSection.Rewards
          );
          setIsDropDownActive(false);
        }}
      >
        {props.text}
        {props.text === MyPortfolioSection.Positions ? (
          <Image alt={"alt"} src={Positions} />
        ) : (
          <Image alt={"alt"} src={Rewards} />
        )}
      </p>
    );
  }
}
