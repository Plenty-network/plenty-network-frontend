import * as React from "react";

export interface ICardHeaderProps {
  className?: string;
  setActiveStateTab: Function;
  activeStateTab: any;
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
  const { activeStateTab, setActiveStateTab } = props;
  const ListOfTabs = ["All", "Stable", "Volatile", "My pools"];
  return (
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
  );
}
