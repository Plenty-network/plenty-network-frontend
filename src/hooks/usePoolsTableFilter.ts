import { useAllPoolsData, useMyPoolsData, usePoolsMain } from "../api/pools/query/poolsmain.query";
import { IAllPoolsData } from "../api/pools/types";
import { ITokenPriceList } from "../api/util/types";

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

  reFetchPool: boolean
) => {
  const { data: poolTableData = [], isFetched } = useAllPoolsData(tokenPrices, 0);
  if (poolTableData.length) {
    if (filterText) {
      const newpoolTableData = poolTableData.filter((e) => e.poolType === filterText);
      return { data: newpoolTableData, isFetched: isFetched };
    }
    return { data: poolTableData, isFetched: isFetched };
  }
  return { data: poolTableData, isFetched: isFetched };
};

export const useMyPoolsTableFilter = (
  userAddress: string,
  tokenPrices: ITokenPriceList,
  filterText: string | "MyPools" | undefined,

  reFetchPool: boolean
) => {
  const { data: poolTableData = [], isFetched } = useMyPoolsData(userAddress, tokenPrices, 0);

  return { data: poolTableData, isFetched: isFetched };
};
