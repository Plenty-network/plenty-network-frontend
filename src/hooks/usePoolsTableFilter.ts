import { usePoolsMain } from "../api/pools/query/poolsmain.query";
import { IAllPoolsData } from "../api/pools/types";

export const usePoolsTableFilter = (
  poolTableData: IAllPoolsData[],
  filterText: string | "My pools" | undefined,
  address: string | undefined,
  reFetchPool: boolean
) => {
  if (poolTableData?.length) {
    if (filterText && filterText !== "My pools") {
      const newpoolTableData = poolTableData.filter((e) => e.poolType === filterText);
      return { data: newpoolTableData, isFetched: true };
    }
    return { data: poolTableData, isFetched: true };
  }
  return { data: poolTableData, isFetched: true };
};
