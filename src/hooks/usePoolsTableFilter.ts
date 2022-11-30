import { usePoolsMain } from "../api/pools/query/poolsmain.query";
import { IPoolsDataWrapperResponse } from "../api/pools/types";

export const usePoolsTableFilter = (
  poolTableData: IPoolsDataWrapperResponse[],
  filterText: string | "MyPools" | undefined,
  address: string | undefined,
  reFetchPool: boolean
) => {
  // const { data: poolTableData = [], isFetched } = usePoolsMain();

  if (poolTableData?.length) {
    if (filterText === "MyPools") {
      const newpoolTableData = poolTableData.filter(
        (e) => e.isLiquidityAvailable || e.isStakeAvailable
      );
      return { data: newpoolTableData, isFetched: true };
    }
    if (filterText) {
      const newpoolTableData = poolTableData.filter((e) => e.poolType === filterText);
      return { data: newpoolTableData, isFetched: true };
    }
    return { data: poolTableData, isFetched: true };
  }
  return { data: poolTableData, isFetched: false };
};
