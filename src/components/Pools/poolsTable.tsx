import * as React from "react";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { POOL_TYPE } from "../../../pages/pools";
import { IAllPoolsData, IAllPoolsDataResponse } from "../../api/pools/types";
import { usePoolsTableFilter } from "../../hooks/usePoolsTableFilter";
import { usePoolsTableSearch } from "../../hooks/usePoolsTableSearch";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { getTotalVotingPower } from "../../redux/pools";
import { compareNumericString } from "../../utils/commonUtils";
import { BribesPool } from "../Bribes/BribesPools";
import { tokenParameterLiquidity } from "../Liquidity/types";
import Table from "../Table/Table";
import { NoSearchResult } from "../Votes/NoSearchResult";
import { PoolsCardHeader } from "./Cardheader";
import { AprInfoFuture } from "./Component/AprFuture";
import { AprInfo } from "./Component/AprInfo";
import { CircularOverLappingImage } from "./Component/CircularImageInfo";
import { NoContentAvailable, NoDataError } from "./Component/ConnectWalletOrNoToken";
import { PoolsText, PoolsTextWithTooltip } from "./Component/PoolsText";
import { ManageLiquidity } from "./ManageLiquidity";
import { ActiveLiquidity } from "./ManageLiquidityHeader";
import newPool from "../../assets/icon/pools/newPool.svg";
import Image from "next/image";
import clsx from "clsx";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { analytics } from "../../config/firebaseConfig";
import { logEvent } from "firebase/analytics";
import {
  setActiveStatev2,
  setIsGaugeAvailable,
  setShowLiquidityModalV2,
  setTokenXV2,
  setTokenYV2,
} from "../../redux/pools/manageLiqV2";
import Link from "next/link";

// Define the props for ShortCard component
export interface IShortCardProps {
  className?: string;
  poolsFilter?: POOL_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
  activeStateTab: PoolsCardHeader;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  reFetchPool: boolean;
  isFetching: boolean;
  isError: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  poolFilterwithTvl: boolean;
}

// Define the props for ManageBtn component
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  setShowLiquidityModal: (val: boolean) => void;
  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
  isGauge: boolean;
}

// ShortCard is a React functional component
export function ShortCard(props: IShortCardProps) {
  // Retrieve user's address from Redux store
  const userAddress = useAppSelector((state) => state.wallet.address);

  // Get the Redux dispatch function
  const dispatch = useDispatch<AppDispatch>();

  // Utilize a hook for number formatting
  const { valueFormat } = useTableNumberUtils();

  // Get token prices from Redux store
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);

  // Fetch and filter pool table data
  const { data: poolTableData = [], isFetched: isFetch = false } = usePoolsTableFilter(
    tokenPrices,
    props.poolsFilter,
    props.reFetchPool,
    0,
    props.poolFilterwithTvl
  );

  // Search and filter pool table data
  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch,
    poolTableData.length
  );

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const NoData = React.useMemo(() => {
    if (
      userAddress &&
      props.activeStateTab === PoolsCardHeader.Mypools &&
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
      return <NoDataError content={"No pools data"} />;
    }
  }, [userAddress, poolsTableData, isFetched, props.isFetching]);

  // Define the columns for the mobile view
  const mobilecolumns = React.useMemo<Column<IAllPoolsData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[160px]",
        showOnMobile: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <div className="flex gap-1 items-center max-w-[180px]">
            <CircularOverLappingImage
              tokenA={
                tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? x.tokenB.toString()
                  : x.tokenA.toString()
              }
              tokenB={
                tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? x.tokenA.toString()
                  : x.tokenB.toString()
              }
              src1={
                tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? getImagesPath(x.tokenB.toString())
                  : getImagesPath(x.tokenA.toString())
              }
              src2={
                tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? getImagesPath(x.tokenA.toString())
                  : getImagesPath(x.tokenB.toString())
              }
            />
            <div className="flex flex-col gap-[2px]">
              <span className="md:text-f14 text-f12 text-white ">
                {tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenB.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenA.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenA.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenB.toString()
                    )}`}
              </span>
              <span className="text-f12 text-text-500">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "APR",
        id: "apr",
        subText: "current epoch",
        columnWidth: "w-[130px]",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x) =>
          x.isGaugeAvailable ? (
            <AprInfo currentApr={x.apr} boostedApr={x.boostedApr} isMobile={true} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "APR",
        id: "apr1",
        columnWidth: "w-[90px] pr-2.5",
        subText: "next epoch",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "futureApr"),
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <AprInfoFuture futureApr={x.futureApr} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
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
            text={valueFormat(x.volume.toNumber())}
            token1={x.volumeTokenA.toString()}
            token2={x.volumeTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
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
            text={valueFormat(x.tvl.toNumber())}
            token1={x.tvlTokenA.toString()}
            token2={x.tvlTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Fees",
        id: "fees",
        columnWidth: "w-[122px]",
        subText: "7D",
        tooltipMessage: "Trading fees collected by the pool in the current epoch.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "fees"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={valueFormat(x.fees.toNumber())}
            token1={x.feesTokenA.toString()}
            token2={x.feesTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Bribes",
        id: "Bribes",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeUSD"),
        subText: "current epoch",
        columnWidth: "w-[123px] pr-2.5",
        tooltipMessage:
          "Incentives provided by the protocols to boost the liquidity of their tokens.",
        isToolTipEnabled: true,
        accessor: (x) =>
          x.isGaugeAvailable ? (
            <BribesPool value={x.bribeUSD} bribesData={x.bribes} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[115px] ml-auto",
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={false}
            isStakeAvailable={false}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
            setShowLiquidityModal={props.setShowLiquidityModal}
            isGauge={x.isGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );
  // Define the columns for the desktop view
  const desktopcolumns = React.useMemo<Column<IAllPoolsData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[220px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <>
            {!x.isGaugeAvailable ? (
              <ToolTip
                id="tooltipM"
                position={Position.top}
                toolTipChild={<div className="">No gauge for the pool</div>}
              >
                <Image src={newPool} width={"20px"} height={"20px"} className="cursor-pointer" />
              </ToolTip>
            ) : null}
            <div
              className={clsx(
                "flex gap-1 items-center max-w-[200px]",
                !x.isGaugeAvailable ? "ml-[14px]" : "ml-[34px]"
              )}
            >
              <CircularOverLappingImage
                tokenA={
                  tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? x.tokenB.toString()
                    : x.tokenA.toString()
                }
                tokenB={
                  tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? x.tokenA.toString()
                    : x.tokenB.toString()
                }
                src1={
                  tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? getImagesPath(x.tokenB.toString())
                    : getImagesPath(x.tokenA.toString())
                }
                src2={
                  tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? getImagesPath(x.tokenA.toString())
                    : getImagesPath(x.tokenB.toString())
                }
              />
              <div className="flex flex-col gap-[2px]">
                <span className="md:text-f14 text-f12 text-white ">
                  {tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? ` ${tEZorCTEZtoUppercase(x.tokenB.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenA.toString()
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.tokenA.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenB.toString()
                      )}`}
                </span>
                <span className="text-f12 text-text-500 progTitle">{x.poolType} Pool</span>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "APR",
        id: "apr",
        columnWidth: "w-[210px]",
        subText: "current epoch",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <AprInfo currentApr={x.apr} boostedApr={x.boostedApr} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "APR",
        id: "apr1",
        columnWidth: "w-[150px]",
        subText: "next epoch",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "futureApr"),
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <AprInfoFuture futureApr={x.futureApr} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
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
            text={valueFormat(x.volume.toNumber())}
            token1={x.volumeTokenA.toString()}
            token2={x.volumeTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
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
            text={valueFormat(x.tvl.toNumber())}
            token1={x.tvlTokenA.toString()}
            token2={x.tvlTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Fees",
        id: "fees",
        columnWidth: "w-[122px]",
        subText: "7D",
        tooltipMessage: "Trading fees collected by the pool in the current epoch.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "fees"),
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={valueFormat(x.fees.toNumber())}
            token1={x.feesTokenA.toString()}
            token2={x.feesTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Bribes",
        id: "Bribes",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "bribeUSD"),
        subText: "current epoch",
        columnWidth: "w-[183px] pr-2.5",
        tooltipMessage:
          "Incentives provided by the protocols to boost the liquidity of their tokens.",
        isToolTipEnabled: true,
        accessor: (x) =>
          x.isGaugeAvailable ? (
            <BribesPool value={x.bribeUSD} bribesData={x.bribes} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
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
            isLiquidityAvailable={false}
            isStakeAvailable={false}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
            setShowLiquidityModal={props.setShowLiquidityModal}
            isGauge={x.isGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );
  // Define a component for the "Manage" button
  function ManageBtn(props: IManageBtnProps): any {
    return (
      <Link href={`/pools/v2/manageLiquidity`}>
        <div className="pl-0 pr-1 md:pr-0 md:pl-0">
          <div
            className="bg-primary-500/10 font-caption2 md:font-subtitle4  hover:bg-primary-500/20 cursor-pointer  text-primary-500 px-5 md:px-7 py-2 rounded-lg"
            onClick={() => {
              if (process.env.NODE_ENV === "production") {
                logEvent(analytics, "pools_manage_clicked", {
                  pool: `${props.tokenA}/${props.tokenB}`,
                });
              }
              userAddress && dispatch(getTotalVotingPower());
              dispatch(setIsGaugeAvailable(props.isGauge));
              //props.setIsGaugeAvailable(props.isGauge);
              if (props.isGauge) {
                props.isLiquidityAvailable
                  ? props.isStakeAvailable
                    ? dispatch(setActiveStatev2(ActiveLiquidity.Rewards))
                    : dispatch(setActiveStatev2(ActiveLiquidity.Staking))
                  : dispatch(setActiveStatev2(ActiveLiquidity.Liquidity));
              } else {
                dispatch(setActiveStatev2(ActiveLiquidity.Liquidity));
              }
              dispatch(
                setTokenXV2({
                  name: props.tokenA,
                  image: getImagesPath(props.tokenA.toString()),
                  symbol: props.tokenA,
                })
              );
              // setTokenIn({
              //   name: props.tokenA,
              //   image: getImagesPath(props.tokenA.toString()),
              //   symbol: props.tokenA,
              // });
              dispatch(
                setTokenYV2({
                  name: props.tokenB,
                  image: getImagesPath(props.tokenB.toString()),
                  symbol: props.tokenB,
                })
              );
              // setTokenOut({
              //   name: props.tokenB,
              //   image: getImagesPath(props.tokenB.toString()),
              //   symbol: props.tokenB,
              // });
              dispatch(setShowLiquidityModalV2(true));
              //props.setShowLiquidityModal(true);
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
      <div className={` overflow-x-auto innerPool  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={poolsTableData}
          shortby="apr"
          TableName="newPools"
          tableType={true}
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableWidth="min-w-[1100px] lg:min-w-[1140px]"
          NoData={NoData}
          loading={props.isFetching}
        />
      </div>
    </>
  );
}
