import * as React from "react";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { POOL_TYPE } from "../../../../pages/pools";
import { IAllPoolsData, IAllPoolsDataResponse } from "../../../api/pools/types";
import { usePoolsTableFilter, usePoolsTableFilterV3 } from "../../../hooks/usePoolsTableFilter";
import { usePoolsTableSearch } from "../../../hooks/usePoolsTableSearch";
import { useTableNumberUtils } from "../../../hooks/useTableUtils";
import { AppDispatch, store, useAppSelector } from "../../../redux";
import { getTotalVotingPower } from "../../../redux/pools";
import { compareNumericString } from "../../../utils/commonUtils";
import { BribesPool } from "../../Bribes/BribesPools";
import { tokenParameterLiquidity } from "../../Liquidity/types";
import Table from "../../Table/Table";
import { NoSearchResult } from "../../Votes/NoSearchResult";

import newPool from "../../../assets/icon/pools/newPool.svg";
import Image from "next/image";
import clsx from "clsx";
import { tEZorCTEZtoUppercase, tokenChange, tokenChangeB } from "../../../api/util/helpers";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import { PoolsCardHeaderV3 } from "./CardHeaderv3";
import { ActiveLiquidity } from "../../Pools/ManageLiquidityHeader";
import { NoContentAvailable, NoDataError } from "../../Pools/Component/ConnectWalletOrNoToken";
import { CircularOverLappingImage } from "../../Pools/Component/CircularImageInfo";

import { ManageLiquidity } from "../../Pools/ManageLiquidity";
import { ManageTabV3 } from "../ManageTabV3";
import { Apr } from "./Apr";
import { setPoolShare, setTokenInV3, settopLevelSelectedToken } from "../../../redux/poolsv3";

import { PoolsTextWithTooltip } from "./PoolsText";
import {
  setActiveStatev3,
  setFeeTier,
  setShowLiquidityModalV3,
  setTokenXV3,
  setTokenYV3,
} from "../../../redux/poolsv3/manageLiq";
import Link from "next/link";
import { getPoolsShareDataV3 } from "../../../api/v3/pools";

export interface IShortCardProps {
  className?: string;
  poolsFilter?: POOL_TYPE;
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
  setIsGaugeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isLiquidityAvailable: boolean;

  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
  isGauge: boolean;
  feeTier: any;
}
export function PoolsTableV3(props: IShortCardProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const { data: poolTableData = [], isFetched: isFetch } = usePoolsTableFilterV3(
    tokenPrices,
    props.poolsFilter,

    props.reFetchPool,
    0,
    true
  );

  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch,
    poolTableData.length
  );

  // const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
  //   ActiveLiquidity.Liquidity
  // );

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
    } else if (poolsTableData.length === 0 && !props.isFetching) {
      return <NoDataError content={"No Pools data"} />;
    }
  }, [userAddress, poolsTableData, isFetched, props.isFetching]);
  useEffect(() => {
    getPoolsShareDataV3().then((res) => {
      dispatch(setPoolShare(res.allData));
      console.log(res);
    });
  }, []);
  console.log("v3", poolsTableData);
  const mobilecolumns = React.useMemo<Column<any>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[290px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <>
            <div className={clsx("flex gap-1 items-center max-w-[270px]", "ml-1 md:ml-[34px]")}>
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
                <span className="bg-primary-500/[0.2] rounded-lg  px-2  text-white md:font-body2 font-caption1-small  text-center	py-1.5 px-2   w-fit  ml-2 md:ml-3">
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

        tooltipMessage: "Annual percentage rate of return on your position through trading fees",
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "volume.value"),
        accessor: (x: any) => (
          <PoolsTextWithTooltip
            text={x.volume.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.volume.token1}
            token2={x.volume.token2}
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "tvl.value"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.tvl.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.tvl.token1}
            token2={x.tvl.token2}
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "fees.value"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.fees.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.fees.token1}
            token2={x.fees.token2}
          />
        ),
      },

      {
        Header: "",
        id: "manage",
        sticky: "right",
        columnWidth: "w-[100px] md:w-[140px] ml-auto",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            feeTier={x.feeTier}
            isLiquidityAvailable={false}
            isStakeAvailable={false}
            tokenA={x.tokenA?.toString()}
            tokenB={x.tokenB?.toString()}
            isGauge={x.isGaugeAvailable}
            setIsGaugeAvailable={setIsGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );
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
            <div className={clsx("flex gap-1 items-center max-w-[320px]", "ml-[54px]")}>
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
                <span className="bg-primary-500/[0.2] rounded-lg  px-2  text-white md:font-body2 font-caption1-small  text-center	py-1.5 px-2   w-fit  ml-2 md:ml-3">
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

        tooltipMessage: "Annual percentage rate of return on your position through trading fees",
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "volume.value"),
        accessor: (x: any) => (
          <PoolsTextWithTooltip
            text={x.volume.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.volume.token1}
            token2={x.volume.token2}
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "tvl.value"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.tvl.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.tvl.token1}
            token2={x.tvl.token2}
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "fees.value"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.fees.value}
            token1Name={x.tokenA}
            token2Name={x.tokenB}
            token1={x.fees.token1}
            token2={x.fees.token2}
          />
        ),
      },

      {
        Header: "",
        id: "manage",
        sticky: "right",
        columnWidth: "w-[160px] ml-auto",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            feeTier={x.feeTier}
            isLiquidityAvailable={false}
            isStakeAvailable={false}
            tokenA={x.tokenA?.toString()}
            tokenB={x.tokenB?.toString()}
            isGauge={x.isGaugeAvailable}
            setIsGaugeAvailable={setIsGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );

  function ManageBtn(props: IManageBtnProps): any {
    return (
      <Link href={`/pools/v3/manageLiquidity`}>
        <div className="pl-0 pr-1 md:pr-0 md:pl-0 ml-5">
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
      {
        <div className={` overflow-x-auto innerPool  ${props.className}`}>
          <Table<any>
            columns={isMobile ? mobilecolumns : desktopcolumns}
            data={poolsTableData}
            shortby="fees"
            TableName="newPools"
            tableType={true}
            isFetched={isFetched}
            isConnectWalletRequired={props.isConnectWalletRequired}
            TableWidth="min-w-[900px]"
            NoData={NoData}
            loading={props.isFetching}
          />
        </div>
      }
    </>
  );
}
