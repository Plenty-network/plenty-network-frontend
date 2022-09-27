import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { IStatsCardProps, IStatsProps, IStatsRewardsProps } from "./types";
import StatsCard from "./StatsCard";
import StatsCardFirst from "./StatsCardFirst";

function StatsRewards(props: IStatsRewardsProps) {
  return (
    <div className="flex gap-2.5 min-w-[1130px]">
      <StatsCard
        title={"PLY emisisons"}
        value={props.plyEmission?.toFixed(1)}
        subValue={"PLY"}
        disable={false}
        setShowClaimAllPly={props.setShowClaimAllPly}
      />
      <StatsCard
        title={"Trading fees"}
        value={props.tradingfeeStats.toFixed(2)}
        setShowClaimAllPly={props.setShowClaimAllPly}
        disable={true}
        isDollar={true}
      />
      <StatsCard
        title={"Bribes"}
        value={props.bribesStats.toFixed(2)}
        setShowClaimAllPly={props.setShowClaimAllPly}
        disable={true}
        isDollar={true}
      />
      <StatsCard
        title={"Unclaimed Inflation"}
        value={"322 PLY "}
        setShowClaimAllPly={props.setShowClaimAllPly}
        disable={true}
        isDollar={true}
      />
    </div>
  );
}

export default StatsRewards;
