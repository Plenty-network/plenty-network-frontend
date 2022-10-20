import { EClaimAllState, IStatsRewardsProps } from "./types";

import { BigNumber } from "bignumber.js";
import StatsCard from "./StatsCard";
import { store, useAppSelector } from "../../redux";

function StatsRewards(props: IStatsRewardsProps) {
  // const claimAllInflationData = store.getState().portfolioRewards.claimAllInflationData;
  const claimAllInflationData = useAppSelector((state) => state.portfolioRewards.claimAllInflationData);
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
        value={props.plyEmission}
        subValue={"PLY"}
        isLoading={!props.fetchingPly}
        disable={props.plyEmission?.isEqualTo(0)}
        setShowClaimAllPly={props.setShowClaimPly}
        setClaimValueDollar={props.setClaimValueDollar}
        setClaimState={props.setClaimState}
        state={EClaimAllState.PLYEMISSION}
      />
      <StatsCard
        title={"Trading fees"}
        toolTipMessage={"Trading fees from the AMMs you voted for."}
        value={props.tradingfeeStats}
        isLoading={props.fetchingTradingfee}
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
        value={props.bribesStats}
        isLoading={props.fetchingTradingfee}
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
        value={props.unclaimInflation.unclaimedInflationAmount}
        subValue={"PLY"}
        isLoading={
          props.fetchingUnclaimedInflationData &&
          Number(props.unclaimInflation.unclaimedInflationAmount) === 0
        }
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
