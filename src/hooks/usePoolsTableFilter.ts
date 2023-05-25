import { useAllPoolsData, useMyPoolsData, usePoolsMain } from "../api/pools/query/poolsmain.query";
import { IAllPoolsData } from "../api/pools/types";
import { ITokenPriceList } from "../api/util/types";

import { BigNumber } from "bignumber.js";

// export const usePoolsTableFilter = (
//   poolTableData: IAllPoolsData[],
//   filterText: string | "My pools" | undefined,
//   address: string | undefined,
//   reFetchPool: boolean
// ) => {
//   if (poolTableData?.length) {
//     if (filterText && filterText !== "My pools") {
//       const newpoolTableData = poolTableData.filter((e) => e.poolType === filterText);
//       return { data: newpoolTableData, isFetched: true };
//     }
//     return { data: poolTableData, isFetched: true };
//   }
//   return { data: poolTableData, isFetched: true };
// };

export const usePoolsTableFilter = (
  tokenPrices: ITokenPriceList,
  filterText: string | "MyPools" | undefined,

  reFetchPool: boolean,
  page: number,
  tvlFilter: boolean
) => {
  const { data: poolTableData = [], isFetched } = useAllPoolsData(tokenPrices, page);

  if (poolTableData.length) {
    if (filterText) {
      const newpoolTableData = poolTableData.filter((e) => e.poolType === filterText);
      if (tvlFilter) {
        const result = newpoolTableData.filter((e) => e.tvl.isGreaterThan(new BigNumber(50)));
        return { data: result, isFetched: isFetched };
      }

      return { data: newpoolTableData, isFetched: isFetched };
    }
    if (tvlFilter) {
      return {
        data: poolTableData.filter((e) => e.tvl.isGreaterThan(new BigNumber(50))),
        isFetched: isFetched,
      };
    }
    return { data: poolTableData, isFetched: isFetched };
  }
  return { data: poolTableData, isFetched: isFetched };
};

export const useMyPoolsTableFilter = (
  userAddress: string,
  tokenPrices: ITokenPriceList,
  filterText: string | "MyPools" | undefined,

  reFetchPool: boolean,
  tvlFilter: boolean
) => {
  const { data: poolTableData = [], isFetched } = useMyPoolsData(userAddress, tokenPrices, 0);
  if (tvlFilter) {
    const result = poolTableData.filter((e) => e.tvl.isGreaterThan(new BigNumber(50)));
    return { data: result, isFetched: isFetched };
  }
  return { data: poolTableData, isFetched: isFetched };
};
