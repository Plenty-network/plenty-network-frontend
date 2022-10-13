import { useEffect, useState } from "react";

export const usePoolsTableSearch = (
  poolsTable: any = [],
  searchText: string,
  isFetched: boolean
) => {
  const [poolsTableData, setPoolsTableData] = useState(poolsTable);
  useEffect(() => setPoolsTableData(poolsTable), [poolsTable.length]);
  useEffect(() => {
    if (searchText && searchText.length) {
      const _poolsTableData = poolsTable.filter((e: any) => {
        return (
          e.tokenA.toLowerCase().includes(searchText) ||
          e.tokenB.toLowerCase().includes(searchText) ||
          (searchText.toLowerCase() === "xtz" && e.tokenA.toLowerCase().search(/\btez\b/) >= 0) ||
          (searchText.toLowerCase() === "xtz" && e.tokenB.toLowerCase().search(/\btez\b/) >= 0)
        );
      });
      setPoolsTableData(_poolsTableData);
    } else {
      setPoolsTableData(poolsTable);
    }
  }, [searchText]);
  return [poolsTableData, isFetched];
};
