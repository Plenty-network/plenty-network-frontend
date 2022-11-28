import * as React from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { AMM_TYPE } from "../../../pages/pools";
import { IPoolsDataWrapperResponse } from "../../api/pools/types";
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
import { NoContentAvailable } from "./Component/ConnectWalletOrNoToken";
import { PoolsText, PoolsTextWithTooltip } from "./Component/PoolsText";
import { ManageLiquidity } from "./ManageLiquidity";
import { ActiveLiquidity } from "./ManageLiquidityHeader";
import stake from "../../assets/icon/pools/stakePool.svg";
import newPool from "../../assets/icon/pools/newPool.svg";
import Image from "next/image";
import clsx from "clsx";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

export interface IShortCardProps {
  className?: string;
  poolsFilter?: AMM_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
  activeStateTab: PoolsCardHeader;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLiquidityModal: boolean;
  reFetchPool: boolean;
}
export interface IManageBtnProps {
  setIsGaugeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isLiquidityAvailable: boolean;
  setShowLiquidityModal: React.Dispatch<React.SetStateAction<boolean>>;
  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
  isGauge: boolean;
}
export function ShortCard(props: IShortCardProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const { data: poolTableData = [], isFetched: isFetch = false } = usePoolsTableFilter(
    props.poolsFilter,
    "",
    props.reFetchPool
  );
  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch
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
    if (userAddress && props.activeStateTab === PoolsCardHeader.Mypools) {
      return <NoContentAvailable setActiveStateTab={props.setActiveStateTab} />;
    } else if (poolsTableData.length === 0 && props.searchValue !== "") {
      return <NoSearchResult />;
    }
  }, [userAddress, poolsTableData]);
  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>({
    name: "USDC.e",
    image: `/assets/tokens/USDC.e.png`,
    symbol: "USDC.e",
  });
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>({
    name: "USDT.e",
    image: `/assets/tokens/USDT.e.png`,
    symbol: "USDT.e",
  });

  const mobilecolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[130px]",
        showOnMobile: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <div className="flex gap-1 items-center max-w-[153px]">
            <CircularOverLappingImage
              src1={getImagesPath(x.tokenA.toString())}
              src2={getImagesPath(x.tokenB.toString())}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="md:text-f14 text-f12 text-white ">
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
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
        columnWidth: "w-[90px]",
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
        Header: "",
        id: "manage",
        columnWidth: "w-[115px] ml-auto",
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
            setShowLiquidityModal={props.setShowLiquidityModal}
            isGauge={x.isGaugeAvailable}
            setIsGaugeAvailable={setIsGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );
  const desktopcolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
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
            {x.isStakeAvailable ? (
              <Image src={stake} width={"20px"} height={"20px"} />
            ) : !x.isGaugeAvailable ? (
              <Image src={newPool} width={"20px"} height={"20px"} />
            ) : null}
            <div
              className={clsx(
                "flex gap-1 items-center max-w-[153px]",
                x.isStakeAvailable || !x.isGaugeAvailable ? "ml-[14px]" : "ml-[34px]"
              )}
            >
              <CircularOverLappingImage
                src1={getImagesPath(x.tokenA.toString())}
                src2={getImagesPath(x.tokenB.toString())}
              />
              <div className="flex flex-col gap-[2px]">
                <span className="md:text-f14 text-f12 text-white ">
                  {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                  {tEZorCTEZtoUppercase(x.tokenB.toString())}
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
        columnWidth: "w-[110px]",
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
        subText: "current epoch",
        columnWidth: "w-[123px]",
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
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
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
          className="bg-primary-500/10 text-f12 md:text-f14 hover:bg-primary-500/20 cursor-pointer  text-primary-500 px-5 md:px-7 py-2 rounded-lg"
          onClick={() => {
            dispatch(getTotalVotingPower());
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

            props.setShowLiquidityModal(true);
            setTokenIn({
              name: props.tokenA,
              image: getImagesPath(props.tokenA.toString()),
              symbol: props.tokenA,
            });
            setTokenOut({
              name: props.tokenB,
              image: getImagesPath(props.tokenB.toString()),
              symbol: props.tokenB,
            });
          }}
        >
          Manage
        </div>
      </div>
    );
  }
  return (
    <>
      {props.showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={props.setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          isGaugeAvailable={isGaugeAvailable}
        />
      )}
      <div className={` overflow-x-auto inner  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={poolsTableData}
          shortby="fees"
          TableName="newPools"
          tableType={true}
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableWidth="min-w-[535px] lg:min-w-[1140px]"
          NoData={NoData}
        />
      </div>
    </>
  );
}
