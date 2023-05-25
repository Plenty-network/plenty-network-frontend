import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IBribesTableBribes } from "./types";
import { store, useAppSelector } from "../../redux";
import { useEffect } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { NoBribesPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import { EpochCol } from "./EpochsCol";
import { Token } from "./Token";
import { IUserBribeData } from "../../api/bribes/types";
import { BribeValue } from "./Bribe";
import { WalletNotConnected } from "../Pools/Component/ConnectWalletOrNoToken";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
TimeAgo.addDefaultLocale(en);

export function MyBribesTableBribes(props: IBribesTableBribes) {
  // const userAddress = store.getState().wallet.address;
  const tokens = useAppSelector((state) => state.config.tokens);
  const userAddress = useAppSelector((state) => state.wallet.address);

  const { valueFormat } = useTableNumberUtils();

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const [tabledata, setTabledata] = React.useState(props.locksPosition);

  useEffect(() => {
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
  const NoData = React.useMemo(() => {
    if (!userAddress) {
      return (
        <WalletNotConnected
          h1={"Connect your wallet"}
          subValue={"Please connect you wallet to view your bribes"}
        />
      );
    } else if (tabledata.length === 0) {
      return (
        <NoBribesPosition
          h1={"No bribes added"}
          subText={"You have not added any bribe for the voters of your pools."}
          cta={"Add Bribes"}
          setActiveStateTab={props.setActiveStateTab}
        />
      );
    }
  }, [userAddress, tabledata]);

  const mobilecolumns = React.useMemo<Column<IUserBribeData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        columnWidth: "w-[183px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 overflow-hidden rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                    ? tokenIcons[x.tokenB]
                      ? tokenIcons[x.tokenB].src
                      : tokens[x.tokenB.toString()]?.iconUrl
                      ? tokens[x.tokenB.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenA]
                    ? tokenIcons[x.tokenA].src
                    : tokens[x.tokenA.toString()]?.iconUrl
                    ? tokens[x.tokenA.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full overflow-hidden h-[24px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                    ? tokenIcons[x.tokenA]
                      ? tokenIcons[x.tokenA].src
                      : tokens[x.tokenA.toString()]?.iconUrl
                      ? tokens[x.tokenA.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenB]
                    ? tokenIcons[x.tokenB].src
                    : tokens[x.tokenB.toString()]?.iconUrl
                    ? tokens[x.tokenB.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body4">
                {tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenB)} / ${tEZorCTEZtoUppercase(x.tokenA)}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenA)} / ${tEZorCTEZtoUppercase(x.tokenB)}`}
              </span>
              <span className="text-f12 text-text-500">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Bribe",
        id: "Bribes",
        columnWidth: "w-[100px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeValue"),
        accessor: (x: any) => (
          <BribeValue value={x.bribeValue} valuePerEpoch={x.bribeValuePerEpoch} />
        ),
      },
      {
        Header: `Token`,
        id: "Token",

        columnWidth: "w-[100px]",

        canShort: true,

        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeToken"),
        accessor: (x: any) => <Token value={x.bribeToken} />,
      },

      {
        Header: "Epochs",
        id: "Epochs",
        columnWidth: "ml-auto w-[280px]",

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

        columnWidth: "w-[180px]",

        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full overflow-hidden w-[28px] h-[28px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                    ? tokenIcons[x.tokenB]
                      ? tokenIcons[x.tokenB].src
                      : tokens[x.tokenB.toString()]?.iconUrl
                      ? tokens[x.tokenB.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenA]
                    ? tokenIcons[x.tokenA].src
                    : tokens[x.tokenA.toString()]?.iconUrl
                    ? tokens[x.tokenA.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full overflow-hidden h-[28px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                    ? tokenIcons[x.tokenA]
                      ? tokenIcons[x.tokenA].src
                      : tokens[x.tokenA.toString()]?.iconUrl
                      ? tokens[x.tokenA.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenB]
                    ? tokenIcons[x.tokenB].src
                    : tokens[x.tokenB.toString()]?.iconUrl
                    ? tokens[x.tokenB.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body4">
                {tEZorCTEZtoUppercase(x.tokenA) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenB)} / ${tEZorCTEZtoUppercase(x.tokenA)}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenA)} / ${tEZorCTEZtoUppercase(x.tokenB)}`}
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeValue"),
        accessor: (x: any) => (
          <BribeValue value={x.bribeValue} valuePerEpoch={x.bribeValuePerEpoch} />
        ),
      },
      {
        Header: `Token`,
        id: "Token",

        columnWidth: "w-[180px]",

        canShort: true,

        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeToken"),
        accessor: (x: any) => <Token value={x.bribeToken} />,
      },

      {
        Header: "Epochs",
        id: "Epochs",
        columnWidth: "ml-auto w-[280px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "epochEnd"),
        canShort: true,
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
          data={tabledata ? tabledata : []}
          noSearchResult={noSearchResult}
          shortby="Epochs"
          isFetched={props.isfetched}
          TableName={"mybribes"}
          NoData={NoData}
          TableWidth="min-w-[700px] lg:min-w-[1100px]"
        />
      </div>
    </>
  );
}
