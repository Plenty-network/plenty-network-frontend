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
    <div className="flex min-w-[1053px] w-full  gap-5">
      <StatsCard
        toolTipMessage={"Total value locked across your positions on the platform."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        isLoading={props.statsPositions.isFetching && Number(props.statsPositions.tvl) === 0}
        title={"TVL"}
        value={`$${nFormatter(new BigNumber(props.statsPositions.tvl))}`}
      />
      <StatsCard
        toolTipMessage={"Total voting power of all your veNFTs."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total voting power"}
        isLoading={props.stats1.isFetching && Number(props.stats1?.totalEpochVotingPower) === 0}
        value={nFormatter(new BigNumber(props.stats1?.totalEpochVotingPower))}
      />
      <StatsCard
        toolTipMessage={"Total amount PLY locked as vote escrows."}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"Total locked"}
        isLoading={props.stats1.isFetching && Number(props.stats1?.totalPlyLocked) === 0}
        value={nFormatter(new BigNumber(props.stats1?.totalPlyLocked))}
        subValue={"PLY"}
      />

      <StatsCard
        toolTipMessage={""}
        isLast={true}
        setShowCreateLockModal={props.setShowCreateLockModal}
        title={"PLY balance"}
        value={nFormatter(new BigNumber(props.plyBalance))}
        subValue={`$${nFormatter(new BigNumber(1 * Number(props.plyBalance)))}`}
      />
    </div>
  );
}

export default Stats;
