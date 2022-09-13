import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import arrowDown from "../../assets/icon/swap/arrowDown.svg";
import arrowDownViolet from "../../assets/icon/swap/arrowDownViolet.svg";
import { IStatsProps } from "./types";
import StatsCard from "./StatsCard";

function Stats(props: IStatsProps) {
  return (
    <div className="flex gap-5">
      <StatsCard setShowCreateLockModal={props.setShowCreateLockModal} />
      <StatsCard setShowCreateLockModal={props.setShowCreateLockModal} />
      <StatsCard setShowCreateLockModal={props.setShowCreateLockModal} />
      <StatsCard isLast={true} setShowCreateLockModal={props.setShowCreateLockModal} />
    </div>
  );
}

export default Stats;
