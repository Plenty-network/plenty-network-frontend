import { IStatsProps } from "./types";
import StatsCard from "./StatsCard";

function Stats(props: IStatsProps) {
  return (
    <div className="flex min-w-[1053px]  gap-5">
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"TVL"}
        value={
          props.statsPositions?.tvl || Number(props.statsPositions?.tvl) <= 0
            ? `$${props.statsPositions?.tvl?.toFixed(1)}`
            : undefined
        }
      />
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total voting power"}
        value={props.statsPositions?.totalEpochVotingPower?.toFixed(1)}
      />
      <StatsCard
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total locked"}
        value={props.statsPositions?.totalPLYLocked?.toFixed(1)}
        subValue={"PLY"}
      />

      <StatsCard
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
