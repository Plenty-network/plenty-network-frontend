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
  className?: string;
}

const active = "border-b border-b-primary-500 text-primary-500";

export function Header(props: ITabProps) {
  const { isActive, text, onClick } = props;
  return (
    <div
      onClick={() => onClick()}
      className={`md:w-[113px] flex-1 md:flex-none text-f16 text-center cursor-pointer py-4  ${
        isActive ? active : "text-text-250"
      } ${props.className}`}
    >
      {text}
    </div>
  );
}

export enum MyPortfolioHeader {
  Pools = "Pools V2",
  Locks = "Locks",
  Poolsv3 = "Pools V3",
}
export function MyPortfolioCardHeader(props: ICardHeaderProps) {
  const { activeStateTab, setActiveStateTab } = props;
  return (
    <div className="flex md:justify-between justify-center border-b border-b-borderCommon  ">
      <div
        className={`${props.className} flex justify-center items-center border-b border-b-borderCommon md:justify-start w-full md:w-max  md:px-[24px] justify-between `}
      >
        {PoolsHeaderCard("Pools V2", 0, "")}
        {PoolsHeaderCard("Pools V3", 1, "")}
        {PoolsHeaderCard("Locks", 2, "")}
      </div>
    </div>
  );

  function PoolsHeaderCard(tab: string, i: number, className: string): JSX.Element {
    return (
      <Header
        key={tab + i}
        className={className}
        isActive={activeStateTab === tab}
        text={tab}
        onClick={() => {
          setActiveStateTab(tab);
        }}
      />
    );
  }
}

export function MyPortfolioCardHeaderRewards(props: ICardHeaderProps) {
  const { activeStateTab, setActiveStateTab } = props;
  return (
    <div className="flex md:justify-between justify-center border-b border-b-borderCommon  ">
      <div
        className={`${props.className} flex justify-center items-center border-b border-b-borderCommon md:justify-start w-full md:w-max  md:px-[24px] justify-between `}
      >
        {PoolsHeaderCard("Pools V2", 0, "")}

        {PoolsHeaderCard("Locks", 1, "")}
      </div>
    </div>
  );
  function PoolsHeaderCard(tab: string, i: number, className: string): JSX.Element {
    return (
      <Header
        key={tab + i}
        className={className}
        isActive={activeStateTab === tab}
        text={tab}
        onClick={() => {
          setActiveStateTab(tab);
        }}
      />
    );
  }
}
