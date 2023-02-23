import { useEffect, useState } from "react";

export const usePoolsTableSearch = (
  poolsTable: any = [],
  searchText: string,
  isFetched: boolean,
  length: number
) => {
  const [poolsTableData, setPoolsTableData] = useState(poolsTable);
  useEffect(() => setPoolsTableData(poolsTable), [poolsTable.length]);
  useEffect(() => {
    if (searchText && searchText.length) {
      const _poolsTableData = poolsTable.filter((e: any) => {
        return (
          e.tokenA.toLowerCase().includes(searchText.trim().toLowerCase()) ||
          e.tokenB.toLowerCase().includes(searchText.trim().toLowerCase()) ||
          (searchText.toLowerCase() === "xtz" && e.tokenA.toLowerCase().search(/\btez\b/) >= 0) ||
          (searchText.toLowerCase() === "tez" && e.tokenA.toLowerCase().search(/\bxtz\b/) >= 0) ||
          (searchText.toLowerCase() === "tez" && e.tokenB.toLowerCase().search(/\bxtz\b/) >= 0) ||
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
