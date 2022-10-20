import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVeNFTData } from "../../api/votes/types";
import { IBribesBtn, IPoolsTableBribes } from "./types";

import { store } from "../../redux";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { getVeNFTsList } from "../../api/votes";

import { compareNumericString } from "../../utils/commonUtils";

import { YourLiquidity } from "../PoolsPosition/YourLiquidity";
import { VoteShare } from "./VoteShare";
import { IPoolsForBribesData } from "../../api/bribes/types";
import { BribesPool } from "./BribesPools";
TimeAgo.addDefaultLocale(en);

export function PoolsTableBribes(props: IPoolsTableBribes) {
  const userAddress = store.getState().wallet.address;

  const { valueFormat } = useTableNumberUtils();

  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const [tabledata, setTabledata] = React.useState(props.locksPosition);
  React.useEffect(() => {
    setTabledata(props.locksPosition);
  }, [props.locksPosition]);
  React.useEffect(() => {
    if (props.searchValue && props.searchValue.length) {
      const filter = props.locksPosition.filter((e: any) => {
        return (
          e.tokenA.toLowerCase().includes(props.searchValue.trim().toLowerCase()) ||
          e.tokenB.toLowerCase().includes(props.searchValue.trim().toLowerCase()) ||
          (props.searchValue.toLowerCase() === "xtz" &&
            e.tokenA.toLowerCase().search(/\btez\b/) >= 0) ||
          (props.searchValue.toLowerCase() === "xtz" &&
            e.tokenB.toLowerCase().search(/\btez\b/) >= 0)
        );
      });
      if (filter.length === 0) {
        setNoSearchResult(true);
      } else {
        setNoSearchResult(false);
      }
      setTabledata(filter);
    } else {
      setNoSearchResult(false);
      setTabledata(props.locksPosition);
    }
  }, [props.searchValue]);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IPoolsForBribesData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        isToolTipEnabled: true,
        columnWidth: "w-[153px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        tooltipMessage: "AMM token pair.",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"20px"} height={"20px"} />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body4">
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </span>
              <span className="text-f12 text-text-500">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Bribes",
        id: "Bribes",
        columnWidth: "w-[100px]",
        subText: "current epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Voting bribes for the ongoing epoch.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribes"),
        accessor: (x: any) => <BribesPool value={x.bribes} bribesData={x.bribesData} />,
      },
      {
        Header: `Liquidity`,
        id: "Liquidity",
        subText: "current",
        columnWidth: "w-[100px]",
        tooltipMessage: "Total value locked in the pool.",
        canShort: true,
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "liquidity"),
        accessor: (x: any) => <YourLiquidity value={x.liquidity} />,
      },
      {
        Header: "Vote Share",
        id: "VoteShare",
        columnWidth: "w-[100px]",
        subText: "current epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Votes received by the pool in the ongoing epoch.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalVotesCurrent"),

        accessor: (x: any) => (
          <VoteShare value={x.totalVotesCurrent} percentage={x.totalVotesPercentageCurrent} />
        ),
      },
      {
        Header: "Vote Share",
        id: "VoteShare1",
        columnWidth: "w-[100px]",
        subText: "previous epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Votes received by the pool in the last epoch.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalVotesPrevious"),

        accessor: (x: any) => (
          <VoteShare value={x.totalVotesPrevious} percentage={x.totalVotesPercentagePrevious} />
        ),
      },
      {
        Header: "",
        id: "vote",
        columnWidth: "ml-auto",
        accessor: (x) => (
          <BribeBtn
            setShowAddBribes={props.setShowAddBribes}
            setSelectedPool={props.setSelectedPool}
            data={x}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPoolsForBribesData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,
        isToolTipEnabled: true,
        columnWidth: "w-[153px]",
        tooltipMessage: "AMM token pair.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"24px"} height={"24px"} />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"24px"} height={"24px"} />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body4">
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </span>
              <span className="text-f12 text-text-500">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Bribes",
        id: "Bribes",
        columnWidth: "w-[180px]",
        subText: "current epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Voting bribes for the ongoing epoch.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribes"),
        accessor: (x: any) => <BribesPool value={x.bribes} bribesData={x.bribesData} />,
      },
      {
        Header: `Liquidity`,
        id: "Liquidity",
        subText: "current",
        columnWidth: "w-[180px]",
        tooltipMessage: "Total value locked in the pool.",
        canShort: true,
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "liquidity"),
        accessor: (x: any) => <YourLiquidity value={x.liquidity} />,
      },
      {
        Header: "Vote Share",
        id: "VoteShare",
        columnWidth: "w-[180px]",
        subText: "current epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Votes received by the pool in the ongoing epoch.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalVotesCurrent"),

        accessor: (x: any) => (
          <VoteShare value={x.totalVotesCurrent} percentage={x.totalVotesPercentageCurrent} />
        ),
      },
      {
        Header: "Vote Share",
        id: "VoteShare1",
        columnWidth: "w-[180px]",
        subText: "previous epoch",
        isToolTipEnabled: true,
        tooltipMessage: "Votes received by the pool in the last epoch.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalVotesPrevious"),

        accessor: (x: any) => (
          <VoteShare value={x.totalVotesPrevious} percentage={x.totalVotesPercentagePrevious} />
        ),
      },
      {
        Header: "",
        id: "vote",
        columnWidth: "ml-auto",
        accessor: (x) => (
          <BribeBtn
            setShowAddBribes={props.setShowAddBribes}
            setSelectedPool={props.setSelectedPool}
            data={x}
          />
        ),
      },
    ],
    [valueFormat]
  );
  function BribeBtn(props: IBribesBtn): any {
    //isstaked
    return (
      <div
        className="bg-primary-500/10 md:w-[151px] w-[78px] cursor-pointer  text-primary-500 hover:opacity-90  md:font-subtitle3 font-f11-600  rounded-lg flex items-center h-[40px] justify-center"
        onClick={() => {
          props.setSelectedPool(props.data);
          props.setShowAddBribes(true);
        }}
      >
        Add Bribe
      </div>
    );
  }

  return (
    <>
      <div className={`overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={tabledata ? tabledata : []}
          noSearchResult={noSearchResult}
          shortby="pool"
          isFetched={props.isfetched}
          TableName={""}
          TableWidth="min-w-[800px] lg:min-w-[1200px]"
        />
      </div>
    </>
  );
}
