import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { IStatsCardProps, IStatsProps, IStatsRewardsProps } from "./types";
import StatsCard from "./StatsCard";
import StatsCardFirst from "./StatsCardFirst";

function StatsRewards(props: IStatsRewardsProps) {
  return (
    <div className="flex gap-2.5 min-w-[1130px]">
      <StatsCard title={"PLY emisisons"} value={props.plyEmission.toFixed(1)} subValue={"PLY"} />
      <StatsCard title={"Trading fees"} value={"$12.3 K "} />
      <StatsCard title={"Bribes"} value={"$12.3 K "} />
      <StatsCard title={"Unclaimed Inflation"} value={"322 PLY "} />
    </div>
  );
}

export default StatsRewards;
