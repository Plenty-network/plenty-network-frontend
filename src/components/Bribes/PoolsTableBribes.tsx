import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { BigNumber } from "bignumber.js";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { ELocksState, IVeNFTData, IVotePageData, IVotesData } from "../../api/votes/types";
import { IBribesBtn, IPoolsTableBribes } from "./types";
import lockDisable from "../../assets/icon/myPortfolio/voteDisable.svg";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../redux";
import { setSelectedDropDown } from "../../redux/veNFT";
import { useRouter } from "next/router";
import { IAllLocksPositionData } from "../../api/portfolio/types";

import { useEffect, useState, useRef } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { getVeNFTsList } from "../../api/votes";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import { NoLocks } from "../Rewards/NoLocks";
import { YourLiquidity } from "../PoolsPosition/YourLiquidity";
import { VoteShare } from "./VoteShare";
import { IPoolsForBribesData } from "../../api/bribes/types";
TimeAgo.addDefaultLocale(en);

export function PoolsTableBribes(props: IPoolsTableBribes) {
  const epochData = store.getState().epoch.currentEpoch;
  const userAddress = store.getState().wallet.address;

  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);

  const { valueFormat } = useTableNumberUtils();
  useEffect(() => {
    getVeNFTsList(userAddress, epochData?.epochNumber).then((res) => {
      setVeNFTlist(res.veNFTData);
    });
  }, []);
  // const NoData = React.useMemo(() => {
  //   return <NoLocks setShowCreateLockModal={props.setShowCreateLockModal} />;
  // }, []);
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
        tooltipMessage: "Liquidity pool gauge to which the lock may be attached for boosting.",
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
        tooltipMessage:
          " Your current voting power. This is different from your epoch voting power which is recorded at the beginning of each epoch.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribes"),
        accessor: (x: any) => <YourLiquidity value={x.bribes} />,
      },
      {
        Header: `Liquidity`,
        id: "Liquidity",
        subText: "current",
        columnWidth: "w-[100px]",
        tooltipMessage: "Amount of PLY locked up until expiry.",
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
        tooltipMessage:
          " The lock is unusable once it expires and underlying PLY may be withdrawn.",
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
        tooltipMessage:
          " The lock is unusable once it expires and underlying PLY may be withdrawn.",
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
        tooltipMessage: "Liquidity pool gauge to which the lock may be attached for boosting.",
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
        tooltipMessage:
          " Your current voting power. This is different from your epoch voting power which is recorded at the beginning of each epoch.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribes"),
        accessor: (x: any) => <YourLiquidity value={x.bribes} />,
      },
      {
        Header: `Liquidity`,
        id: "Liquidity",
        subText: "current",
        columnWidth: "w-[180px]",
        tooltipMessage: "Amount of PLY locked up until expiry.",
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
        tooltipMessage:
          " The lock is unusable once it expires and underlying PLY may be withdrawn.",
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
        tooltipMessage:
          " The lock is unusable once it expires and underlying PLY may be withdrawn.",
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
          data={props.locksPosition ? props.locksPosition : []}
          shortby="Locks"
          isFetched={props.isfetched}
          TableName={""}
          TableWidth="min-w-[800px] lg:min-w-[1200px]"
        />
      </div>
    </>
  );
}
