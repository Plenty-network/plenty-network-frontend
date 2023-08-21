import * as React from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { useEffect, useState } from "react";
import { PoolsCardHeaderV3 } from "./CardHeaderv3";
import { POOL_TYPE } from "../../../../pages/pools/v3";
import { AppDispatch, useAppSelector } from "../../../redux";
import { useTableNumberUtils } from "../../../hooks/useTableUtils";
import { useMyPoolsTableFilterv3 } from "../../../hooks/usePoolsTableFilter";
import { usePoolsTableSearch } from "../../../hooks/usePoolsTableSearch";
import { ActiveLiquidity } from "../../Pools/ManageLiquidityHeader";
import { PoolsCardHeader } from "../../Pools/Cardheader";
import { NoContentAvailable, NoDataError } from "../../Pools/Component/ConnectWalletOrNoToken";
import { NoSearchResult } from "../../Votes/NoSearchResult";
import { tokenParameterLiquidity } from "../../Liquidity/types";
import { compareNumericString } from "../../../utils/commonUtils";
import Table from "../../Table/Table";
import { ManageTabV3 } from "../ManageTabV3";
import { tEZorCTEZtoUppercase, tokenChange, tokenChangeB } from "../../../api/util/helpers";
import clsx from "clsx";
import { CircularOverLappingImage } from "../../Pools/Component/CircularImageInfo";
import { Apr } from "./Apr";
import { PoolsTextWithTooltip } from "./PoolsText";
import { settopLevelSelectedToken } from "../../../redux/poolsv3";
import {
  setActiveStatev3,
  setFeeTier,
  setShowLiquidityModalV3,
  setTokenXV3,
  setTokenYV3,
} from "../../../redux/poolsv3/manageLiq";
import Link from "next/link";

export interface IShortCardProps {
  className?: string;
  poolsFilter: POOL_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;

  setSearchValue?: Function;
  activeStateTab: PoolsCardHeaderV3;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;

  reFetchPool: boolean;
  //data: IAllPoolsData[];
  isFetching: boolean;
  isError: boolean;
}
export interface IManageBtnProps {
  tokenA: string;
  tokenB: string;

  feeTier: any;
}
export function MyPoolTablev3(props: IShortCardProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const tokens = useAppSelector((state) => state.config.tokens);
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();

  const { data: poolTableData = [], isFetched: isFetch = false } = useMyPoolsTableFilterv3(
    userAddress,
    tokenPrices,
    props.poolsFilter,

    props.reFetchPool
  );

  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch,
    poolTableData.length
  );

  const [isGaugeAvailable, setIsGaugeAvailable] = React.useState(false);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const NoData = React.useMemo(() => {
    if (
      userAddress &&
      props.activeStateTab === PoolsCardHeaderV3.Mypools &&
      isFetched &&
      !props.isFetching
    ) {
      return <NoContentAvailable setActiveStateTab={props.setActiveStateTab} />;
    } else if (poolsTableData.length === 0 && props.isError && !props.isFetching) {
      return <NoDataError content={"Server down"} />;
    } else if (
      poolsTableData.length === 0 &&
      props.searchValue !== "" &&
      isFetched &&
      !props.isFetching
    ) {
      return <NoSearchResult />;
    } else if (poolsTableData.length === 0 && !props.isFetching && userAddress) {
      return <NoDataError content={"No Pools data"} />;
    }
  }, [userAddress, poolsTableData, isFetched, props.isFetching]);

  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const desktopcolumns = React.useMemo<Column<any>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[320px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <>
            <div className={clsx("flex gap-1 items-center max-w-[320px]", "ml-1 md:ml-[54px]")}>
              <CircularOverLappingImage
                tokenA={
                  tEZorCTEZtoUppercase(x.tokenA?.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenB?.toString()).substring(0, 1).toLowerCase()
                    ? x.tokenB?.toString()
                    : x.tokenA?.toString()
                }
                tokenB={
                  tEZorCTEZtoUppercase(x.tokenA?.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenB?.toString()).substring(0, 1).toLowerCase()
                    ? x.tokenA?.toString()
                    : x.tokenB?.toString()
                }
                src1={
                  tEZorCTEZtoUppercase(x.tokenA?.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenB?.toString()).substring(0, 1).toLowerCase()
                    ? getImagesPath(x.tokenB?.toString())
                    : getImagesPath(x.tokenA?.toString())
                }
                src2={
                  tEZorCTEZtoUppercase(x.tokenA?.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenB?.toString()).substring(0, 1).toLowerCase()
                    ? getImagesPath(x.tokenA?.toString())
                    : getImagesPath(x.tokenB?.toString())
                }
              />
              <div className="flex items-center ">
                <span className="md:text-f14 text-f12 text-white ">
                  {tEZorCTEZtoUppercase(x.tokenA?.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenB?.toString()).substring(0, 1).toLowerCase()
                    ? ` ${tEZorCTEZtoUppercase(x.tokenB?.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenA?.toString()
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.tokenA?.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenB?.toString()
                      )}`}
                </span>
                <span className="bg-primary-500/[0.2] rounded-lg  px-2 text-white md:font-body2 font-caption1-small  text-center	py-1.5 px-2   w-fit  ml-2 md:ml-3">
                  {x.feeTier}%
                </span>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "APR",
        id: "apr",
        columnWidth: "w-[80px]",

        tooltipMessage: "Annual percentage rate of return on your position through trading fees.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => <Apr currentApr={x.apr} />,
      },

      {
        Header: "Volume",
        id: "Volume24h",
        subText: "24h",
        columnWidth: "w-[129px]",
        isToolTipEnabled: true,
        tooltipMessage: "Pool’s trading volume in the last 24 hours.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "volume"),
        accessor: (x: any) => (
          <PoolsTextWithTooltip
            text={x.volume.toString()}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1="0"
            token2="0"
          />
        ),
      },
      {
        Header: "TVL",
        id: "TVL",
        columnWidth: "w-[122px]",
        tooltipMessage: "Total value locked up in the pool.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tvl"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.tvl.toString()}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1="0"
            token2="0"
          />
        ),
      },
      {
        Header: "Fees",
        id: "fees",
        columnWidth: "w-[122px]",
        subText: "7d",
        tooltipMessage: "Trading fees collected by the pool in the current epoch.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "fees"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.fees.toString()}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1="0"
            token2="0"
          />
        ),
      },

      {
        Header: "",
        id: "manage",
        sticky: "right",
        columnWidth: "w-[100px] md:w-[160px] ml-auto",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            feeTier={x.feeTier}
            tokenA={x.tokenA?.toString()}
            tokenB={x.tokenB?.toString()}
          />
        ),
      },
    ],
    [valueFormat]
  );

  function ManageBtn(props: IManageBtnProps): any {
    return (
      <Link href={`/pools/v3/manageLiquidity`}>
        <div className="pl-0 pr-1 md:pr-0 md:pl-0">
          <div
            className="bg-primary-500/10 font-caption2 md:font-subtitle4  hover:bg-primary-500/20 cursor-pointer  text-primary-500 px-5 md:px-7 py-2 rounded-lg"
            onClick={() => {
              dispatch(setActiveStatev3(ActiveLiquidity.Liquidity));

              dispatch(setFeeTier(props.feeTier));
              //props.setFeeTier(props.feeTier);
              dispatch(
                setTokenXV3({
                  name: props.tokenA,
                  image: getImagesPath(props.tokenA?.toString()),
                  symbol: props.tokenA,
                })
              );
              dispatch(
                setTokenYV3({
                  name: props.tokenB,
                  image: getImagesPath(props.tokenB?.toString()),
                  symbol: props.tokenB,
                })
              );
              dispatch(
                settopLevelSelectedToken({
                  name: props.tokenA,
                  image: getImagesPath(props.tokenA?.toString()),
                  symbol: props.tokenA,
                })
              );
              dispatch(setShowLiquidityModalV3(true));
            }}
          >
            Manage
          </div>
        </div>
      </Link>
    );
  }
  return (
    <>
      {true && (
        <div className={` overflow-x-auto innerPool  ${props.className}`}>
          <Table<any>
            columns={desktopcolumns}
            data={poolsTableData}
            shortby="fees"
            TableName="newPools"
            tableType={true}
            isFetched={isFetched}
            isConnectWalletRequired={props.isConnectWalletRequired}
            TableWidth="min-w-[880px]"
            NoData={NoData}
            loading={props.isFetching}
          />
        </div>
      )}
    </>
  );
}
