import React, { useState } from "react";
import { useTable, Column, useFilters, useSortBy, usePagination } from "react-table";
import { useAppSelector } from "../../redux";
import { NoContentAvailable, WalletNotConnected } from "../Pools/Component/ConnectWalletOrNoToken";
import { Tabs } from "../Pools/ShortCardHeader";
export interface ISimmerEffectProps {
  lines: number;
}

export function SimmerEffect(props: ISimmerEffectProps) {
  return (
    <>
      {Array(props.lines)
        .fill(1)
        .map((_, i) => (
          <tr
            key={`simmerEffect_${i}`}
            className={`border border-borderCommon h-16 bg-cardBackGround flex px-5 py-3 items-center justify-between rounded-lg animate-pulse `}
          ></tr>
        ))}
    </>
  );
}
const Table = <D extends object>({
  columns,
  data,
  shortby,
  isConnectWalletRequired = false,
  isFetched = false,
}: {
  columns: Column<D>[];
  data: D[];
  shortby?: string;
  isConnectWalletRequired?: boolean;
  isFetched?: boolean;
}) => {
  const [shortByGroup, setshortByGroup] = useState({
    id: shortby ?? "usd",
    desc: true,
  });
  const walletAddress = useAppSelector((state) => state.wallet.address);

  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    pageCount,
    setPageSize,
    state: { pageIndex },
    setSortBy,
  } = useTable<D>(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [shortByGroup],
      },
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
    },
    useFilters,
    useSortBy,
    usePagination
  );
  const shortByHandler = (sortByAtt: any) => {
    const currentShortBy = Object.assign({}, shortByGroup);
    if (currentShortBy.id == sortByAtt) {
      currentShortBy.desc = !currentShortBy.desc;
      setshortByGroup(currentShortBy);
      setSortBy([currentShortBy]);
    } else {
      setshortByGroup({
        id: sortByAtt,
        desc: true,
      });
      setSortBy([
        {
          id: sortByAtt,
          desc: true,
        },
      ]);
    }
  };

  return (
    <div>
      <table className="w-full flex flex-col gap-3">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={`headerGroup_${index}`}
              className="border border-borderCommon bg-cardBackGround flex md:px-5 md:py-3 px-1 py-1  items-center rounded-t-xl	rounded-b"
            >
              {headerGroup.headers.map((column, i) => (
                <Tabs
                  key={`tabls_${column.render("Header")?.toString()}_${i}`}
                  text={column.render("Header")?.toString()}
                  className="justify-start"
                  isFirstRow={i == 0}
                  isToolTipEnabled={column.hasOwnProperty("isToolTipEnabled")}
                  onClick={
                    column.hasOwnProperty("canShort")
                      ? () => {
                          shortByHandler(column.id);
                        }
                      : () => {}
                  }
                  arrowUp={
                    shortByGroup.id == column.id ? (shortByGroup.desc ? "down" : "up") : undefined
                  }
                  subText={
                    column.hasOwnProperty("subText") ? column.render("subText")?.toString() : ""
                  }
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody className=" flex-col flex gap-2">
          {isConnectWalletRequired && walletAddress && isFetched && !data.length ? (
            <NoContentAvailable />
          ) : null}
          {isConnectWalletRequired && !walletAddress && isFetched ? <WalletNotConnected /> : null}
          {!isFetched ? <SimmerEffect lines={6} /> : null}
          {isFetched && data.length
            ? page.map((row: any) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key
                  <tr
                    className={`border border-borderCommon  bg-cardBackGround flex md:px-5 md:py-3 px-1 py-1 items-center justify-between rounded-lg slideFromTop`}
                  >
                    {row.cells.map((cell: any, i: any) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <td
                          className={`flex-1  flex items-center ${
                            i == 0 ? "justify-start" : "justify-end"
                          }`}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
