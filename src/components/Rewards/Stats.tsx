import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { EClaimAllState, IStatsCardProps, IStatsProps, IStatsRewardsProps } from "./types";
import StatsCard from "./StatsCard";
import StatsCardFirst from "./StatsCardFirst";
import { store } from "../../redux";

function StatsRewards(props: IStatsRewardsProps) {
  const claimAllInflationData = store.getState().portfolioRewards.claimAllInflationData;
  return (
    <div className="flex gap-2.5 min-w-[1130px]">
      <StatsCard
        title={"PLY emisisons"}
        value={props.plyEmission?.toFixed(1)}
        subValue={"PLY"}
        disable={props.plyEmission?.isEqualTo(0)}
        setShowClaimAllPly={props.setShowClaimPly}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.PLYEMISSION}
      />
      <StatsCard
        title={"Trading fees"}
        value={props.tradingfeeStats.toFixed(2)}
        setShowClaimAllPly={props.setShowClaimPly}
        disable={props.feeClaimData.length === 0}
        isDollar={true}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.TRADINGFEE}
      />
      <StatsCard
        title={"Bribes"}
        value={props.bribesStats.toFixed(2)}
        setShowClaimAllPly={props.setShowClaimPly}
        disable={props.bribesClaimData.length === 0}
        isDollar={true}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.BRIBES}
      />
      <StatsCard
        title={"Unclaimed Inflation"}
        value={props.unclaimInflation.unclaimedInflationAmount.toFixed(2)}
        subValue={"PLY"}
        setShowClaimAllPly={props.setShowClaimPly}
        disable={claimAllInflationData.length === 0}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.UNCLAIMED}
      />
    </div>
  );
}

export default StatsRewards;
