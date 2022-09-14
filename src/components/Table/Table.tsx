import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useTable, Column, useFilters, useSortBy, usePagination } from "react-table";
import { useAppSelector } from "../../redux";
import { getHeightOfElement } from "../../utils/getHeight";
import { NoContentAvailable, WalletNotConnected } from "../Pools/Component/ConnectWalletOrNoToken";
import { Tabs } from "../Pools/ShortCardHeader";
import { NoSearchResult } from "../Votes/NoSearchResult";
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
  isVotesTable = false,
  noSearchResult = false,
  TableName,
}: {
  columns: Column<D>[];
  data: D[];
  shortby?: string;
  noSearchResult?: boolean;
  isConnectWalletRequired?: boolean;
  isFetched?: boolean;
  isVotesTable?: boolean;
  TableName?: string;
}) => {
  const [shortByGroup, setshortByGroup] = useState({
    id: shortby ?? "usd",
    desc: true,
  });
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const headerRef = useRef(null);
  const [heightBody, setheightBody] = useState(480);

  useEffect(() => {
    const heightOfbody = getHeightOfElement(headerRef.current);
    setheightBody(window.innerHeight - heightOfbody);
  }, [headerRef]);
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
      <table className={clsx("w-full flex flex-col ", isVotesTable ? "gap-1.5" : "gap-1.5")}>
        <thead ref={headerRef}>
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={`headerGroup_${index}`}
              className="border border-borderCommon bg-cardBackGround flex md:pr-5 md:pl-11 md:py-3 px-1 py-3  items-center rounded-t-xl	rounded-b "
            >
              {headerGroup.headers.map((column, i) => (
                <Tabs
                  key={`tabls_${column.render("Header")?.toString()}_${i}`}
                  text={column.render("Header")?.toString()}
                  className="justify-start"
                  TableName={TableName}
                  index={i}
                  isFirstRow={i == 0}
                  isVotesTable={isVotesTable ? i === headerGroup.headers.length - 1 : false}
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
        <tbody
          className={clsx(" flex-col flex overflow-y-auto", isVotesTable ? "gap-1" : "gap-1")}
          style={{ height: `${heightBody}px` }}
        >
          {isConnectWalletRequired && walletAddress && isFetched && !data.length ? (
            <NoContentAvailable />
          ) : null}
          {isFetched && noSearchResult ? <NoSearchResult /> : null}
          {isConnectWalletRequired && !walletAddress && isFetched ? <WalletNotConnected /> : null}
          {!isFetched ? <SimmerEffect lines={6} /> : null}
          {isFetched && data.length
            ? page.map((row: any) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key
                  <tr
                    className={`border border-borderCommon  bg-cardBackGround flex md:pr-3 md:pl-11 md:py-3 px-1 py-1 items-center  rounded-lg slideFromTop `}
                  >
                    {row.cells.map((cell: any, i: any) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <td
                          className={` flex items-center ${
                            i == 0 || (TableName === "PoolsPosition" && i === 1)
                              ? "justify-start"
                              : "justify-end"
                          } ${
                            TableName === "PoolsPosition"
                              ? i === 0
                                ? " w-[150px]"
                                : i === 1 || i === 5 || i === 6 || i === 4
                                ? "w-[200px]"
                                : " w-[130px]"
                              : isVotesTable && i === row.cells.length - 1
                              ? "w-[100px] md:w-[220px]"
                              : i == 0
                              ? "w-[150px]"
                              : "flex-1 w-[120px]"
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
