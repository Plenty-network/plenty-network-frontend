import * as React from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { AMM_TYPE } from "../../../pages/pools";
import { IPoolsDataWrapperResponse } from "../../api/pools/types";
import { usePoolsTableFilter } from "../../hooks/usePoolsTableFilter";
import { usePoolsTableSearch } from "../../hooks/usePoolsTableSearch";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import { AppDispatch, store } from "../../redux";
import { getTotalVotingPower } from "../../redux/pools";
import { compareNumericString } from "../../utils/commonUtils";
import { BribesPool } from "../Bribes/BribesPools";
import { tokenParameterLiquidity } from "../Liquidity/types";
import Table from "../Table/Table";
import { AprInfoFuture } from "./Component/AprFuture";
import { AprInfo } from "./Component/AprInfo";
import { CircularOverLappingImage } from "./Component/CircularImageInfo";
import { NoContentAvailable } from "./Component/ConnectWalletOrNoToken";
import { PoolsText, PoolsTextWithTooltip } from "./Component/PoolsText";
import { ManageLiquidity } from "./ManageLiquidity";
import { ActiveLiquidity } from "./ManageLiquidityHeader";

export interface IShortCardProps {
  className?: string;
  poolsFilter?: AMM_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
  setActiveStateTab: React.Dispatch<React.SetStateAction<string>>;
}
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
}
export function ShortCard(props: IShortCardProps) {
  const userAddress = store.getState().wallet.address;
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const { data: poolTableData = [], isFetched: isFetch = false } = usePoolsTableFilter(
    props.poolsFilter,
    ""
  );
  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch
  );
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const NoData = React.useMemo(() => {
    if (userAddress) {
      return <NoContentAvailable setActiveStateTab={props.setActiveStateTab} />;
    } else {
      <></>;
    }
  }, [userAddress]);
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
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

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
        accessor: (x) => <AprInfo currentApr={x.apr} boostedApr={x.boostedApr} isMobile={true} />,
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => <AprInfoFuture futureApr={x.futureApr} />,
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[150px] ml-auto",
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
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
        columnWidth: "w-[160px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x) => (
          <div className="flex gap-2 items-center max-w-[153px]">
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
        ),
      },
      {
        Header: "APR",
        id: "apr",
        columnWidth: "w-[177px]",
        subText: "current epoch",
        tooltipMessage: "Annual percentage rate of return on your staked liquidity position.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => <AprInfo currentApr={x.apr} boostedApr={x.boostedApr} />,
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "apr"),
        accessor: (x: any) => <AprInfoFuture futureApr={x.futureApr} />,
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
        accessor: (x) => <BribesPool value={x.bribeUSD} bribesData={x.bribes} />,
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[180px] ml-auto",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
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
            props.isLiquidityAvailable
              ? props.isStakeAvailable
                ? setActiveState(ActiveLiquidity.Rewards)
                : setActiveState(ActiveLiquidity.Staking)
              : setActiveState(ActiveLiquidity.Liquidity);
            setShowLiquidityModal(true);
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
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
        />
      )}
      <div className={` overflow-x-auto inner  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={poolsTableData}
          shortby="fees"
          tableType="pool"
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableWidth="min-w-[535px] lg:min-w-[1140px]"
          NoData={NoData}
        />
      </div>
    </>
  );
}
