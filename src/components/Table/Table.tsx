import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { Column, useFilters, usePagination, useSortBy, useTable } from "react-table";
import { useRouter } from "next/router";
import { useAppSelector } from "../../redux";
import { getHeightOfElement } from "../../utils/getHeight";
import { NoDataError, WalletNotConnected } from "../Pools/Component/ConnectWalletOrNoToken";
import { Tabs } from "../Pools/ShortCardHeader";
import { NoSearchResult } from "../Votes/NoSearchResult";
import TablePagination from "./pagination-action";

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
            className={` border border-borderCommon h-16 bg-cardBackGround flex px-5 py-3 items-center justify-between rounded-lg animate-pulse-table `}
          ></tr>
        ))}
    </>
  );
}
const Table = <D extends object>({
  columns,
  data,
  shortby,
  tableType,
  loading,
  isConnectWalletRequired = false,
  isFetched = false,
  isVotesTable = false,
  noSearchResult = false,
  TableName,
  TableWidth,
  NoData,
}: {
  columns: Column<D>[];
  data: D[];
  shortby?: string;
  loading?: boolean;
  noSearchResult?: boolean;
  isConnectWalletRequired?: boolean;
  isFetched?: boolean;
  isVotesTable?: boolean;
  TableName?: string;
  TableWidth?: string;
  tableType?: boolean;
  NoData?: JSX.Element;
  tooltipMessage?: string;
}) => {
  const [shortByGroup, setshortByGroup] = useState({
    id: shortby ?? "usd",
    desc: true,
  });
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const headerRef = useRef(null);
  const [heightBody, setheightBody] = useState<number>(480);

  useEffect(() => {
    const heightOfbody = getHeightOfElement(headerRef.current);
    isMobile ? setheightBody(heightOfbody) : setheightBody(heightOfbody);
  }, [headerRef, isMobile]);
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
  const router = useRouter();
  return (
    <div>
      <table
        {...getTableProps()}
        className={clsx(" flex flex-col ", isVotesTable ? "gap-1.5" : "gap-1.5", TableWidth)}
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              ref={headerRef}
              key={`headerGroup_${index}`}
              className={clsx(
                "border border-borderCommon bg-cardBackGround flex  md:py-3  py-3  items-center rounded-t-xl	rounded-b  pl-5 pr-4  lg:pr-[25px]",
                TableName === "poolsRewards" || TableName === "locksRewards"
                  ? "justify-between "
                  : "",
                TableName === "lockPosition"
                  ? "lg:pl-[30px]"
                  : TableName === "newPools"
                  ? "lg:pl-[20px]"
                  : "lg:pl-[50px] "
              )}
            >
              {headerGroup.headers.map((column, i) => (
                <Tabs
                  key={`tabls_${column.render("Header")?.toString()}_${i}`}
                  text={column.render("Header")?.toString()}
                  className="justify-start"
                  TableName={TableName}
                  tableType={tableType}
                  columnWidth={
                    column.hasOwnProperty("columnWidth")
                      ? column.render("columnWidth")?.toString()
                      : ""
                  }
                  index={i}
                  isFirstRow={i == 0}
                  isVotesTable={isVotesTable ? i === headerGroup.headers.length - 1 : false}
                  isToolTipEnabled={column.hasOwnProperty("isToolTipEnabled")}
                  toolTipChild={
                    column.hasOwnProperty("tooltipMessage")
                      ? column.render("tooltipMessage")?.toString()
                      : ""
                  }
                  onClick={
                    column.hasOwnProperty("canShort")
                      ? () => {
                          shortByHandler(column.id);
                        }
                      : () => {}
                  }
                  arrowUp={
                    shortByGroup.id == column.id ? (shortByGroup.desc ? "up" : "down") : undefined
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
          className={clsx(" flex-col flex ", isVotesTable ? "gap-1" : "gap-1", isFetched ? "" : "")}
          {...(!router.pathname.includes("myportfolio") &&
            !router.pathname.includes("pools") && {
              style: { height: "auto" },
            })}
        >
          {/* {isConnectWalletRequired && walletAddress && isFetched && !data.length ? (
            <NoContentAvailable />
          ) : null} */}
          {isFetched && noSearchResult ? <NoSearchResult /> : null}
          {isFetched && data.length === 0 && NoData && NoData}
          {isConnectWalletRequired && !walletAddress && isFetched ? (
            <WalletNotConnected
              h1={"Connect your wallet"}
              subValue={"Please connect you wallet to view your pools"}
            />
          ) : null}
          {!isFetched ? <SimmerEffect lines={3} /> : null}
          {isFetched && data.length ? (
            page.length ? (
              page.map((row: any) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key

                  <tr
                    className={` flex   items-center  rounded-lg slideFromTop pl-5 pr-4  lg:pr-[25px]  ${
                      TableName === "poolsRewards" || TableName === "locksRewards"
                        ? "justify-between  "
                        : ""
                    } 
                    ${
                      TableName === "lockPosition"
                        ? "lg:pl-[30px]"
                        : TableName === "newPools"
                        ? "lg:pl-[20px]"
                        : "lg:pl-[50px] "
                    }
                    ${
                      TableName === "locksRewards" && row.original?.epoch !== ""
                        ? "py-1 "
                        : "border border-borderCommon  bg-cardBackGround md:py-3  py-1 "
                    }`}
                    key={row}
                  >
                    {row.cells.map((cell: any, i: any) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <td
                          className={` flex items-center ${cell.column.columnWidth} ${
                            i == 0
                              ? "justify-start"
                              : TableName === "mybribes" && i !== 3
                              ? "justify-start"
                              : "justify-end "
                          }  ${tableType === true ? "colSticky" : ""} `}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <NoDataError content={"No data on this selected page"} />
            )
          ) : null}
          {isFetched && data.length > 0 && (
            <tr className="h-[60px] mt-2 border border-borderCommon bg-cardBackGround px-5 py-4 rounded-lg  items-center w-auto">
              <div className="w-screen sm:w-auto">
                <TablePagination
                  count={pageCount}
                  rowsPerPage={10}
                  page={pageIndex}
                  setPageSize={setPageSize}
                  onChangePage={(number) => gotoPage(number)}
                />
              </div>
            </tr>
          )}
          {loading && (
            <tr
              className={` border border-borderCommon h-16 bg-cardBackGround flex px-5 py-3 items-center justify-between rounded-lg animate-pulse-table `}
            ></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
