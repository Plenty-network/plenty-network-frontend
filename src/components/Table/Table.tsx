import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { Column, useFilters, usePagination, useSortBy, useTable } from "react-table";
import { useRouter } from "next/router";
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
  tableType,
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
  noSearchResult?: boolean;
  isConnectWalletRequired?: boolean;
  isFetched?: boolean;
  isVotesTable?: boolean;
  TableName?: string;
  TableWidth?: string;
  tableType?: string;
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
    isMobile ? setheightBody(heightOfbody - 64) : setheightBody(heightOfbody);
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
        pageSize: 100,
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
      <table className={clsx(" flex flex-col ", isVotesTable ? "gap-1.5" : "gap-1.5", TableWidth)}>
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
                TableName === "lockPosition" ? "lg:pl-[30px]" : "lg:pl-[50px] "
              )}
            >
              {headerGroup.headers.map((column, i) => (
                <Tabs
                  key={`tabls_${column.render("Header")?.toString()}_${i}`}
                  text={column.render("Header")?.toString()}
                  className="justify-start"
                  TableName={TableName}
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
          className={clsx(" flex-col flex overflow-y-auto", isVotesTable ? "gap-1" : "gap-1")}
          {...(!router.pathname.includes("MyPortfolio") &&
            !router.pathname.includes("pools") && {
              style: { height: `${heightBody}px` },
            })}
        >
          {/* {isConnectWalletRequired && walletAddress && isFetched && !data.length ? (
            <NoContentAvailable />
          ) : null} */}
          {isFetched && noSearchResult ? <NoSearchResult /> : null}
          {isFetched && data.length === 0 && NoData && NoData}
          {isConnectWalletRequired && !walletAddress && isFetched ? <WalletNotConnected /> : null}
          {!isFetched ? <SimmerEffect lines={3} /> : null}
          {isFetched && data.length
            ? page.map((row: any) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key

                  <tr
                    className={` flex   items-center  rounded-lg slideFromTop pl-5 pr-4  lg:pr-[25px]  ${
                      TableName === "poolsRewards" || TableName === "locksRewards"
                        ? "justify-between  "
                        : ""
                    } 
                    ${TableName === "lockPosition" ? "lg:pl-[30px]" : "lg:pl-[50px] "}
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
                            i == 0 ? "justify-start" : "justify-end "
                          }   `}
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
