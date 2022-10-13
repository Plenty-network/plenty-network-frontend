import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { BigNumber } from "bignumber.js";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { ELocksState, IVeNFTData, IVotePageData, IVotesData } from "../../api/votes/types";
import { IBribesBtn, IBribesTableBribes, IPoolsTableBribes } from "./types";
import lockDisable from "../../assets/icon/myPortfolio/voteDisable.svg";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../redux";
import { setSelectedDropDown } from "../../redux/veNFT";
import Vote from "../../../pages/Vote";
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
import { EpochCol } from "./EpochsCol";
import { Token } from "./Token";
import { IUserBribeData } from "../../api/bribes/types";
TimeAgo.addDefaultLocale(en);

export function MyBribesTableBribes(props: IBribesTableBribes) {
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

  const mobilecolumns = React.useMemo<Column<IUserBribeData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",

        columnWidth: "w-[153px]",

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
        Header: "Bribe",
        id: "Bribes",
        columnWidth: "w-[180px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "currentVotingPower"),
        accessor: (x: any) => <YourLiquidity value={x.bribeValue} />,
      },
      {
        Header: `Token`,
        id: "Token",

        columnWidth: "w-[180px]",

        canShort: true,

        sortType: (a: any, b: any) => compareNumericString(a, b, "baseValue"),
        accessor: (x: any) => <Token value={x.bribeToken} />,
      },

      {
        Header: "Epochs",
        id: "Epochs",
        columnWidth: "ml-auto w-[280px]",

        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "endTimeStamp"),

        accessor: (x: any) => (
          <EpochCol
            epochNumber={x.epoch}
            startEpoch={x.epochStartDate}
            endEpoch={x.epochEndDate}
            epochStart={x.epochStart}
            epochEnd={x.epochEnd}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IUserBribeData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,

        columnWidth: "w-[153px]",

        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "attachedTokenASymbol"),
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
        Header: "Bribe",
        id: "Bribes",
        columnWidth: "w-[180px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "currentVotingPower"),
        accessor: (x: any) => <YourLiquidity value={x.bribeValue} />,
      },
      {
        Header: `Token`,
        id: "Token",

        columnWidth: "w-[180px]",

        canShort: true,

        sortType: (a: any, b: any) => compareNumericString(a, b, "baseValue"),
        accessor: (x: any) => <Token value={x.bribeToken} />,
      },

      {
        Header: "Epochs",
        id: "Epochs",
        columnWidth: "ml-auto w-[280px]",

        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "endTimeStamp"),

        accessor: (x: any) => (
          <EpochCol
            epochNumber={x.epoch}
            startEpoch={x.epochStartDate}
            endEpoch={x.epochEndDate}
            epochStart={x.epochStart}
            epochEnd={x.epochEnd}
          />
        ),
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={`overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.locksPosition}
          shortby="Locks"
          isFetched={props.isfetched}
          TableName={""}
          TableWidth="min-w-[700px] lg:min-w-[1100px]"
        />
      </div>
    </>
  );
}
