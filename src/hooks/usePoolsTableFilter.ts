import {
  useAllPoolsData,
  useAllPoolsDataV3,
  useMyPoolsData,
  useMyPoolsDatav3,
  usePoolsMain,
} from "../api/pools/query/poolsmain.query";
import { IAllPoolsData } from "../api/pools/types";
import { ITokenPriceList } from "../api/util/types";

import { BigNumber } from "bignumber.js";

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

export const usePoolsTableFilterV3 = (
  tokenPrices: ITokenPriceList,
  filterText: string | "MyPools" | undefined,

  reFetchPool: boolean,
  page: number,
  tvlFilter: boolean
) => {
  const { data: poolTableData = [], isFetched } = useAllPoolsDataV3(tokenPrices, page);

  if (poolTableData.length) {
    if (filterText) {
      // if (tvlFilter) {
      //   const result = poolTableData.filter((e) => e.tvl.isGreaterThan(new BigNumber(50)));
      //   return { data: result, isFetched: isFetched };
      // }

      return { data: poolTableData, isFetched: isFetched };
    }
    // if (tvlFilter) {
    //   return {
    //     data: poolTableData.filter((e) => e.tvl.isGreaterThan(new BigNumber(50))),
    //     isFetched: isFetched,
    //   };
    // }
    return { data: poolTableData, isFetched: isFetched };
  }
  return { data: poolTableData, isFetched: isFetched };
};

export const useMyPoolsTableFilterv3 = (
  userAddress: string,
  tokenPrices: ITokenPriceList,
  filterText: string | "MyPools" | undefined,

  reFetchPool: boolean
) => {
  const { data: poolTableData = [], isFetched } = useMyPoolsDatav3(userAddress, 0);

  return { data: poolTableData, isFetched: isFetched };
};
