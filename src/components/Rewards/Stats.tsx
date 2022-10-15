import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { EClaimAllState, IStatsCardProps, IStatsProps, IStatsRewardsProps } from "./types";

import { BigNumber } from "bignumber.js";
import StatsCard from "./StatsCard";
import StatsCardFirst from "./StatsCardFirst";
import { store } from "../../redux";

function StatsRewards(props: IStatsRewardsProps) {
  const claimAllInflationData = store.getState().portfolioRewards.claimAllInflationData;
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <div className="flex gap-2.5 min-w-[1130px] w-full justify-between ">
      <StatsCard
        toolTipMessage={"PLY rewards through gauges."}
        title={"PLY emisisons"}
        value={nFormatter(props.plyEmission)}
        subValue={"PLY"}
        disable={props.plyEmission?.isEqualTo(0)}
        setShowClaimAllPly={props.setShowClaimPly}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.PLYEMISSION}
      />
      <StatsCard
        title={"Trading fees"}
        toolTipMessage={"Trading fees from the AMMs you voted for."}
        value={nFormatter(new BigNumber(props.tradingfeeStats))}
        setShowClaimAllPly={props.setShowClaimPly}
        disable={props.feeClaimData.length === 0}
        isDollar={true}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.TRADINGFEE}
      />
      <StatsCard
        title={"Bribes"}
        toolTipMessage={"Bribes through AMMs you have voted for."}
        value={nFormatter(new BigNumber(props.bribesStats))}
        setShowClaimAllPly={props.setShowClaimPly}
        disable={props.bribesClaimData.length === 0}
        isDollar={true}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.BRIBES}
      />
      <StatsCard
        title={"Unclaimed Inflation"}
        toolTipMessage={
          "Anti dilution inflation of the lockers. Claimed amount is added to your existing lockers."
        }
        tooltipWidth={"w-[300px]"}
        value={nFormatter(new BigNumber(props.unclaimInflation.unclaimedInflationAmount))}
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
