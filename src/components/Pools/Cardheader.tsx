import * as React from "react";
import { isTablet } from "react-device-detect";
import { SwitchPools } from "../SwitchCheckbox/SwitchPools";
import { Switch } from "../SwitchCheckbox/switchWithoutIcon";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { InputSearchBox } from "./Component/SearchInputBox";

export interface ICardHeaderProps {
  className?: string;
  setActiveStateTab: Function;
  activeStateTab: any;
  searchValue: string;
  setSearchValue: Function;
  setPoolFilterwithTvl: React.Dispatch<React.SetStateAction<boolean>>;
  poolFilterwithTvl: boolean;
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

export enum PoolsCardHeader {
  All = "All",
  Stable = "Stable",
  Volatile = "Volatile",
  Mypools = "My pools",
}
export function CardHeader(props: ICardHeaderProps) {
  const { activeStateTab, setActiveStateTab, setSearchValue, searchValue } = props;
  return (
    <div className="flex md:justify-between items-center justify-center border-b border-b-borderCommon  bg-cardBackGround">
      <div
        className={`${props.className} flex  items-center border-b border-b-borderCommon md:justify-start w-full md:w-max px-4 md:px-0 justify-between bg-cardBackGround`}
      >
        {PoolsHeaderCard("All", 0, "")}
        {PoolsHeaderCard("Stable", 1, "")}
        {PoolsHeaderCard("Volatile", 2, "")}
        {PoolsHeaderCard("My pools", 3, "")}
      </div>
      <div className="hidden md:flex items-center ml-auto gap-3 mr-5 ">
        <p className="font-body1 hidden lg:flex">Hide small pools</p>
        <p>
          <ToolTip
            id="tooltipj"
            disable={!isTablet}
            position={Position.top}
            isShowInnitially={true}
            toolTipChild={<div className="">Hide small pools</div>}
          >
            <SwitchPools
              isChecked={props.poolFilterwithTvl}
              id="i"
              onChange={() => props.setPoolFilterwithTvl(!props.poolFilterwithTvl)}
            />
          </ToolTip>
        </p>
        <p className="w-[2px] border-r border-primary-900 h-5"></p>
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
