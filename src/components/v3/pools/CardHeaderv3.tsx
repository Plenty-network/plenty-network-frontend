import * as React from "react";
import { InputSearchBox } from "../../Pools/Component/SearchInputBox";

export interface ICardHeaderProps {
  className?: string;
  setActiveStateTab: Function;
  activeStateTab: any;
  searchValue: string;
  setSearchValue: Function;
}

export interface ITabProps {
  isActive: boolean;
  text: string;
  onClick: Function;
  className?: string;
}

const active = "border-b border-b-primary-500 !text-white";

export function PoolsCardHeaderTab(props: ITabProps) {
  const { isActive, text, onClick } = props;
  return (
    <div
      onClick={() => onClick()}
      className={`md:w-[113px] flex-1 md:flex-none text-f16 text-center cursor-pointer py-4 text-navBarMuted ${
        isActive ? active : ""
      } ${props.className}`}
    >
      {text}
    </div>
  );
}

export enum PoolsCardHeaderV3 {
  All = "All",

  Mypools = "My pools",
}
export function CardHeaderV3(props: ICardHeaderProps) {
  const { activeStateTab, setActiveStateTab, setSearchValue, searchValue } = props;
  return (
    <div className="flex md:justify-between items-center justify-center border-b border-b-borderCommon  bg-cardBackGround">
      <div
        className={`${props.className} flex  items-center border-b border-b-borderCommon md:justify-start w-full md:w-max px-4 md:px-0 justify-between bg-cardBackGround`}
      >
        {PoolsHeaderCard("All", 0, "")}

        {PoolsHeaderCard("My pools", 3, "")}
      </div>
      <InputSearchBox
        className="hidden md:flex md:gap-1"
        value={searchValue}
        onChange={setSearchValue}
      />
    </div>
  );

  function PoolsHeaderCard(tab: string, i: number, className: string): JSX.Element {
    return (
      <PoolsCardHeaderTab
        key={tab + i}
        className={className}
        isActive={activeStateTab === tab}
        text={tab}
        onClick={() => {
          setActiveStateTab(tab);
          setSearchValue("");
        }}
      />
    );
  }
}
