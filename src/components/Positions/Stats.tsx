import { IStatsProps } from "./types";
import StatsCard from "./StatsCard";

import { BigNumber } from "bignumber.js";

function Stats(props: IStatsProps) {
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
    <div className="flex min-w-[1053px] w-full justify-between gap-5">
      <StatsCard
        toolTipMessage={"Total value locked across your positions on the platform."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"TVL"}
        value={
          !props.statsPositions.isFetching
            ? `$${nFormatter(new BigNumber(props.statsPositions.tvl))}`
            : undefined
        }
      />
      <StatsCard
        toolTipMessage={"Total voting power of all your veNFTs."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total voting power"}
        value={nFormatter(new BigNumber(props.stats1?.totalEpochVotingPower))}
      />
      <StatsCard
        toolTipMessage={"Total amount PLY locked as vote escrow.s"}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total locked"}
        value={nFormatter(new BigNumber(props.stats1?.totalPlyLocked))}
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
