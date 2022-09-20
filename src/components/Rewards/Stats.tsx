import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { IStatsCardProps, IStatsProps } from "./types";
import StatsCard from "./StatsCard";
import StatsCardFirst from "./StatsCardFirst";

function StatsRewards(props: IStatsCardProps) {
  return (
    <div className="flex gap-5 min-w-[994px]">
      <StatsCardFirst />
      <StatsCard title={"Bribes"} value={"$12.3 K "} />
      <StatsCard title={"Unclaimed Inflation"} value={"322 PLY "} subValue={"$35.38"} />
    </div>
  );
}

export default StatsRewards;
