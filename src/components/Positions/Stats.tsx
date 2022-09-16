import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { IStatsProps } from "./types";
import StatsCard from "./StatsCard";

function Stats(props: IStatsProps) {
  return (
    <div className="flex min-w-[1053px]  gap-5">
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"TVL"}
        value={"$12.3 K "}
      />
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total voting power"}
        value={"488"}
      />
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total locked"}
        value={"488"}
        subValue={"PLY"}
      />

      <StatsCard
        isLast={true}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"PLY Balance"}
        value={"322"}
        subValue={"$35.38"}
      />
    </div>
  );
}

export default Stats;
