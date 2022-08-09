import * as React from "react";
import { InputSearchBox } from "./Component/SearchInputBox";

export interface ICardHeaderProps {
  className?: string;
  setActiveStateTab: Function;
  activeStateTab: any;
  searchValue:string;
  setSearchValue:Function;
}

export interface ITabProps {
  isActive: boolean;
  text: string;
  onClick: Function;
}

const active = "border-b border-b-primary-500 text-white";

export function PoolsCardHeaderTab(props: ITabProps) {
  const { isActive, text, onClick } = props;
  return (
    <div
      onClick={() => onClick()}
      className={`w-[113px] text-f16 text-center cursor-pointer py-4 text-navBarMuted ${isActive ? active : ""
        }`}
    >
      {text}
    </div>
  );
}

export enum PoolsCardHeader {
  All = "All",
  Stable = "Stable",
  Volatile = "Volatile",
  Mypools = "My pools",
}
export function CardHeader(props: ICardHeaderProps) {
  const { activeStateTab, setActiveStateTab,setSearchValue,searchValue } = props; 
  const ListOfTabs = ["All", "Stable", "Volatile", "My pools"];
  return (
    <div className="flex justify-between border-b border-b-borderCommon  bg-cardBackGround">
    <div
      className={`${props.className} flex  items-center border-b border-b-borderCommon  bg-cardBackGround`}
    >
      {ListOfTabs.map((tab, i) => (
        <PoolsCardHeaderTab
          key={tab + i}
          isActive={activeStateTab === tab}
          text={tab}
          onClick={() => setActiveStateTab(tab)}
        />
      ))}
    </div>
    <InputSearchBox value={searchValue} onChange={setSearchValue} />
    </div>
  );
}
