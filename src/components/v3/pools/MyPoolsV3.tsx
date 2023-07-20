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
import { ManageTabMobile } from "../ManageTabMobile";
import clsx from "clsx";
import { CircularOverLappingImage } from "../../Pools/Component/CircularImageInfo";
import { Apr } from "./Apr";
import { PoolsTextWithTooltip } from "./PoolsText";
import { settopLevelSelectedToken } from "../../../redux/poolsv3";

export interface IShortCardProps {
  className?: string;
  poolsFilter?: POOL_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
  activeStateTab: PoolsCardHeaderV3;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  reFetchPool: boolean;
  //data: IAllPoolsData[];
  isFetching: boolean;
  isError: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IManageBtnProps {
  setIsGaugeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isLiquidityAvailable: boolean;
  setShowLiquidityModal: (val: boolean) => void;
  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
  isGauge: boolean;
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
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
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
    } else if (poolsTableData.length === 0 && !props.isFetching) {
      return <NoDataError content={"No Pools data"} />;
    }
  }, [userAddress, poolsTableData, isFetched, props.isFetching]);
  const [feeTier, setFeeTier] = React.useState("");
  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>({
    name: "DAI.e",
    image: `/assets/tokens/DAI.e.png`,
    symbol: "DAI.e",
  });
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>({
    name: "USDC.e",
    image: `/assets/tokens/USDC.e.png`,
    symbol: "USDC.e",
  });
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const mobilecolumns = React.useMemo<Column<any>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[240px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <>
            <div className={clsx("flex gap-1 items-center max-w-[240px]")}>
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
                <span className="font-caption1-small text-white border-text-800 rounded-lg text-center	p-1 bg-muted-200 border w-[45px] ml-1">
                  0.05%
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
        subText: "external",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => (
          // x.isGaugeAvailable ? (
          <Apr currentApr={x.apr} />
        ),
        // ) : (
        //   <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
        //     -
        //   </div>
        // ),
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
        accessor: (x: any) => <PoolsTextWithTooltip text={x.volume.toString()} />,
      },
      {
        Header: "TVL",
        id: "TVL",
        columnWidth: "w-[122px]",
        tooltipMessage: "Total value locked up in the pool.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tvl"),
        accessor: (x) => <PoolsTextWithTooltip text={x.tvl.toString()} />,
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
        accessor: (x) => <PoolsTextWithTooltip text={x.fees.toString()} />,
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
            setShowLiquidityModal={props.setShowLiquidityModal}
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
        columnWidth: "w-[290px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <>
            {/* {!x.isGaugeAvailable ? (
              <ToolTip
                id="tooltipM"
                position={Position.top}
                toolTipChild={<div className="">No gauge for the pool</div>}
              >
                <Image src={newPool} width={"20px"} height={"20px"} className="cursor-pointer" />
              </ToolTip>
            ) : null} */}
            <div className={clsx("flex gap-1 items-center max-w-[270px]", "ml-[34px]")}>
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
                <span className="font-caption1-small text-white border-text-800 rounded-lg text-center	p-1 bg-muted-200 border w-[45px] ml-1">
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
        subText: "external",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => (
          // x.isGaugeAvailable ? (
          <Apr currentApr={x.apr} />
        ),
        // ) : (
        //   <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
        //     -
        //   </div>
        // ),
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
        accessor: (x: any) => <PoolsTextWithTooltip text={x.volume.toString()} />,
      },
      {
        Header: "TVL",
        id: "TVL",
        columnWidth: "w-[122px]",
        tooltipMessage: "Total value locked up in the pool.",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tvl"),
        accessor: (x) => <PoolsTextWithTooltip text={x.tvl.toString()} />,
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
        accessor: (x) => <PoolsTextWithTooltip text={x.fees.toString()} />,
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
            setShowLiquidityModal={props.setShowLiquidityModal}
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
      <div className="pl-0 pr-1 md:pr-0 md:pl-0">
        <div
          className="bg-primary-500/10 font-caption2 md:font-subtitle4  hover:bg-primary-500/20 cursor-pointer  text-primary-500 px-5 md:px-7 py-2 rounded-lg"
          onClick={() => {
            props.setIsGaugeAvailable(props.isGauge);
            if (props.isGauge) {
              props.isLiquidityAvailable
                ? props.isStakeAvailable
                  ? setActiveState(ActiveLiquidity.Rewards)
                  : setActiveState(ActiveLiquidity.Staking)
                : setActiveState(ActiveLiquidity.Liquidity);
            } else {
              setActiveState(ActiveLiquidity.Liquidity);
            }
            setFeeTier(props.feeTier);
            setTokenIn({
              name: props.tokenA,
              image: getImagesPath(props.tokenA?.toString()),
              symbol: props.tokenA,
            });
            dispatch(
              settopLevelSelectedToken({
                name: props.tokenA,
                image: getImagesPath(props.tokenA?.toString()),
                symbol: props.tokenA,
              })
            );
            setTokenOut({
              name: props.tokenB,
              image: getImagesPath(props.tokenB?.toString()),
              symbol: props.tokenB,
            });

            props.setShowLiquidityModal(true);
          }}
        >
          Manage
        </div>
      </div>
    );
  }
  return (
    <>
      {props.showLiquidityModal &&
        (isMobile ? (
          <ManageTabMobile
            tokenIn={tokenChange(topLevelSelectedToken, tokenIn, tokenOut)}
            tokenOut={tokenChangeB(topLevelSelectedToken, tokenIn, tokenOut)}
            tokenA={tokenIn}
            tokenB={tokenOut}
            closeFn={props.setShowLiquidityModal}
            setActiveState={setActiveState}
            activeState={activeState}
            isGaugeAvailable={isGaugeAvailable}
            showLiquidityModal={props.showLiquidityModal}
            setShowLiquidityModalPopup={props.setShowLiquidityModalPopup}
            filter={props.poolsFilter}
            feeTier={feeTier}
          />
        ) : (
          <ManageTabV3
            tokenIn={tokenChange(topLevelSelectedToken, tokenIn, tokenOut)}
            tokenOut={tokenChangeB(topLevelSelectedToken, tokenIn, tokenOut)}
            tokenA={tokenIn}
            tokenB={tokenOut}
            closeFn={props.setShowLiquidityModal}
            setActiveState={setActiveState}
            activeState={activeState}
            isGaugeAvailable={isGaugeAvailable}
            showLiquidityModal={true}
            setShowLiquidityModalPopup={props.setShowLiquidityModalPopup}
            filter={props.poolsFilter}
            feeTier={feeTier}
          />
        ))}
      {!isMobile && (
        <div className={` overflow-x-auto innerPool  ${props.className}`}>
          <Table<any>
            columns={isMobile ? mobilecolumns : desktopcolumns}
            data={poolsTableData}
            shortby="fees"
            TableName="newPools"
            tableType={true}
            isFetched={isFetched}
            isConnectWalletRequired={props.isConnectWalletRequired}
            TableWidth="min-w-[780px]"
            NoData={NoData}
            loading={props.isFetching}
          />
        </div>
      )}
      {isMobile && !props.showLiquidityModal && (
        <div className={` overflow-x-auto innerPool  ${props.className}`}>
          <Table<any>
            columns={isMobile ? mobilecolumns : desktopcolumns}
            data={poolsTableData}
            shortby="fees"
            TableName="newPools"
            tableType={true}
            isFetched={isFetched}
            isConnectWalletRequired={props.isConnectWalletRequired}
            TableWidth="min-w-[800px]"
            NoData={NoData}
            loading={props.isFetching}
          />
        </div>
      )}
    </>
  );
}
