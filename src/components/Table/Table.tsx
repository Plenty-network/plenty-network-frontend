import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTable, Column, useFilters, useSortBy, usePagination } from "react-table";
import { useAppSelector } from "../../redux";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { getHeightOfElement } from "../../utils/getHeight";
import { NoContentAvailable, WalletNotConnected } from "../Pools/Component/ConnectWalletOrNoToken";
import { Tabs } from "../Pools/ShortCardHeader";
import { NoSearchResult } from "../Votes/NoSearchResult";

import { isMobile } from "react-device-detect";
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
  NoData?: JSX.Element;
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

  return (
    <div>
      <table className={clsx(" flex flex-col ", isVotesTable ? "gap-1.5" : "gap-1.5", TableWidth)}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              ref={headerRef}
              key={`headerGroup_${index}`}
              className={clsx(
                "border border-borderCommon bg-cardBackGround flex  md:py-3  py-3  items-center rounded-t-xl	rounded-b ",
                TableName === "poolsRewards"
                  ? "justify-between md:pr-11 md:pl-11 px-3"
                  : "md:pr-5 md:pl-11 px-1"
              )}
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
          {isFetched && data.length === 0 && NoData && NoData}
          {isConnectWalletRequired && !walletAddress && isFetched ? <WalletNotConnected /> : null}
          {!isFetched ? <SimmerEffect lines={3} /> : null}
          {isFetched && data.length
            ? page.map((row: any) => {
                prepareRow(row);
                if (row.original.index === 2 && TableName === "locksRewards") {
                  return (
                    <tr
                      className={` flex  md:py-1 font-title3 px-1 py-1 flex items-center  rounded-lg slideFromTop ${
                        TableName === "locksRewards" && " md:pl-11 "
                      } `}
                    >
                      <div className="flex gap-1">
                        <Image src={epoachIcon} width={"22px"} height={"22px"} />
                        <span className="text-text-250">Epoch</span>
                        <span className="text-white">22</span>
                        <span className="text-text-50">(current)</span>
                      </div>
                      <div className="cursor-pointer flex items-center md:font-body4 font-subtitle4 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center">
                        Claim
                      </div>
                    </tr>
                  );
                } else {
                  return (
                    // eslint-disable-next-line react/jsx-key

                    <tr
                      className={`border border-borderCommon  bg-cardBackGround flex  md:py-3  py-1 items-center  rounded-lg slideFromTop ${
                        TableName === "poolsRewards"
                          ? "justify-between md:pl-11 md:pr-11 px-3"
                          : "md:pr-3 md:pl-11 px-1"
                      } `}
                    >
                      {row.cells.map((cell: any, i: any) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <td
                            className={`pr-1 flex items-center ${
                              i == 0 ? "justify-start" : "justify-end "
                            } ${
                              TableName === "poolsRewards"
                                ? i === 0
                                  ? "w-[200px]"
                                  : isMobile && i !== 0
                                  ? "w-[110px]"
                                  : "w-[150px]"
                                : TableName === "lockPosition"
                                ? !isMobile && i === 0
                                  ? " w-[150px]"
                                  : !isMobile && i === 2
                                  ? "w-[164px]"
                                  : isMobile && i === 0
                                  ? "w-[200px]"
                                  : isMobile && i === 1
                                  ? "w-[80px] pr-3"
                                  : isMobile && i === 2
                                  ? "w-[85px]"
                                  : isMobile && i === 3
                                  ? "w-[100px]"
                                  : i === 1 || i === 5 || i === 6 || i === 4
                                  ? "w-[200px]"
                                  : " w-[130px]"
                                : TableName === "poolsPosition"
                                ? i === 0
                                  ? "w-[180px]"
                                  : i === 5
                                  ? "w-[200px]"
                                  : isMobile && i === 2
                                  ? "w-[120px] flex-1"
                                  : "w-[80px] md:w-[120px]"
                                : TableName === "votesTable"
                                ? i === 4
                                  ? "w-[120px] md:w-[260px]"
                                  : i === 0
                                  ? "w-[150px]"
                                  : "w-[112px]"
                                : i === 0
                                ? "w-[150px]"
                                : " flex-1"
                            } ${TableName === "poolsPosition" && i === 5 && "ml-auto"} ${
                              i === 0 && "pl-3  md:pl-0"
                            } ${TableName === "votesTable" && i === 4 && "ml-auto"}`}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                }
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
