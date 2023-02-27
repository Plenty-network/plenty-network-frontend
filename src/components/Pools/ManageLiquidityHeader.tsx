import * as React from "react";

export interface IManageLiquidityHeaderProps {
  activeStateTab: any;
  setActiveStateTab: Function;
  className?: string;
  isGaugeAvailable: boolean;
}

export interface ITabProps {
  isActive: boolean;
  text: string;
  onClick: Function;
}

const active = "border border-primary-500 rounded-xl bg-primary-500/20 text-white";

export function Tab(props: ITabProps) {
  const { isActive, text, onClick } = props;
  return (
    <div
      onClick={() => onClick()}
      className={`flex justify-center cursor-pointer items-center flex-1 py-1.5 ${
        isActive ? active : ""
      }`}
    >
      {text}
    </div>
  );
}
export enum ActiveLiquidity {
  Liquidity = "Liquidity",
  Staking = "Staking",
  Rewards = "Rewards",
}
export function ManageLiquidityHeader(props: IManageLiquidityHeaderProps) {
  const { activeStateTab, setActiveStateTab } = props;
  var ListOfTabs;
  if (props.isGaugeAvailable) {
    ListOfTabs = ["Liquidity", "Staking", "Rewards"];
  } else {
    ListOfTabs = ["Liquidity"];
  }

  return (
    <div
      className={`flex row justify-between text-text-400 text-f16 bg-muted-500 rounded-xl ${props.className}`}
    >
      {ListOfTabs.map((tab, i) => (
        <Tab
          key={tab + i}
          isActive={activeStateTab === tab}
          text={tab}
          onClick={() => setActiveStateTab(tab)}
        />
      ))}
    </div>
  );
}
