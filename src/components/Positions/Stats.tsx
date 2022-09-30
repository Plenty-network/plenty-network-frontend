import { IStatsProps } from "./types";
import StatsCard from "./StatsCard";

function Stats(props: IStatsProps) {
  return (
    <div className="flex min-w-[1053px]  gap-5">
      <StatsCard
        toolTipMessage={"Total value locked across your positions on the platform."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"TVL"}
        value={
          props.statsPositions?.tvl || Number(props.statsPositions?.tvl) <= 0
            ? `$${props.statsPositions?.tvl?.toFixed(1)}`
            : undefined
        }
      />
      <StatsCard
        toolTipMessage={"Total voting power of all your veNFTs."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total voting power"}
        value={props.stats1?.totalEpochVotingPower?.toFixed(1)}
      />
      <StatsCard
        toolTipMessage={"Total amount PLY locked as vote escrow.s"}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total locked"}
        value={props.stats1?.totalPlyLocked?.toFixed(1)}
        subValue={"PLY"}
      />

      <StatsCard
        toolTipMessage={""}
        isLast={true}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"PLY Balance"}
        value={props.plyBalance.toFixed(1)}
        subValue={`$${(1 * Number(props.plyBalance)).toFixed(1)}`}
      />
    </div>
  );
}

export default Stats;
