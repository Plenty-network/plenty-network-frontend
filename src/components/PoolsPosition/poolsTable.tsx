import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IManageBtnProps, IPoolsTablePosition } from "./types";
import { ManageLiquidity } from "../Pools/ManageLiquidity";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { IPositionsData } from "../../api/portfolio/types";
import { YourLiquidity } from "./YourLiquidity";
import { StakePercentage } from "./StakedPercentage";
import { BoostValue } from "./BoostValue";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";

import stake from "../../assets/icon/pools/stakePool.svg";
import newPool from "../../assets/icon/pools/newPool.svg";
import { getTotalVotingPower } from "../../redux/pools";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import clsx from "clsx";

export function PoolsTablePosition(props: IPoolsTablePosition) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);

  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [noSearchResult, setNoSearchResult] = React.useState(false);

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
  const [isGaugeAvailable, setIsGaugeAvailable] = React.useState(false);
  const NoData = React.useMemo(() => {
    return <NoPoolsPosition h1={"No active liquidity positions"} cta={"View Pools"} />;
  }, []);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const mobilecolumns = React.useMemo<Column<IPositionsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        columnWidth: "w-[150px]",
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center ">
              <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"20px"} height={"20px"} />
            </div>
            <div>
              <div className="font-body2 md:font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Your liquidity",
        id: "yourliquidity",
        columnWidth: "w-[80px]",
        isToolTipEnabled: true,
        tooltipMessage: "Value of tokens supplied to the pair.",
        canShort: true,
        accessorFn: (x: any) => x.totalLiquidityAmount,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalLiquidityAmount"),
        accessor: (x: any) => <YourLiquidity value={x.totalLiquidityAmount} />,
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[120px] flex-1",
        accessor: (x) => (
          <ManageBtn
            isManage={Number(x.stakedPercentage) > 0}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
            isGauge={x.isGaugeAvailable}
            setIsGaugeAvailable={setIsGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPositionsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[220px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x: any) => (
          <>
            {!x.isGaugeAvailable ? <Image src={newPool} width={"20px"} height={"20px"} /> : null}
            <div
              className={clsx(
                " flex justify-center items-center",
                !x.isGaugeAvailable ? "ml-[14px]" : "ml-[34px]"
              )}
            >
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"24px"} height={"24px"} />
              </div>
              <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"24px"} height={"24px"} />
              </div>
              <div>
                <div className="font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                  {tEZorCTEZtoUppercase(x.tokenB.toString())}
                </div>
                <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Your liquidity",
        id: "yourliquidity",
        columnWidth: "w-[124px]",
        tooltipMessage: "Value of tokens supplied to the pair.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "totalLiquidityAmount"),
        accessor: (x: any) => <YourLiquidity value={x.totalLiquidityAmount} />,
      },
      {
        Header: `Staked percentage`,
        id: "Staked percentage",
        columnWidth: "w-[124px]",
        tooltipMessage: "Percentage liquidity staked in the pool’s gauge.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "stakedPercentage"),
        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <StakePercentage value={x.stakedPercentage} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "Your APR",
        id: "your APR",
        columnWidth: "w-[124px]",
        tooltipMessage: "Annual percentage rate of return on your staked position.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "userAPR"),
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <StakePercentage value={x.userAPR} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "Boost",
        id: "Boost",
        columnWidth: "w-[124px]",
        isToolTipEnabled: true,
        tooltipMessage: "Boost received on the gauge APR by attaching a veNFT.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
        accessor: (x: any) =>
          x.isGaugeAvailable ? (
            <BoostValue value={x.boostValue} />
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              -
            </div>
          ),
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[200px] ml-auto",
        accessor: (x) => (
          <ManageBtn
            isManage={Number(x.stakedPercentage) > 0}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
            isGauge={x.isGaugeAvailable}
            setIsGaugeAvailable={setIsGaugeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    if (props.isManage || !props.isGauge) {
      return (
        <div
          className="bg-primary-500/10 md:w-[151px] w-[100px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
          onClick={() => {
            setShowLiquidityModal(true);
            dispatch(getTotalVotingPower());
            props.setIsGaugeAvailable(props.isGauge);
            if (props.isGauge) {
              props.isManage
                ? setActiveState(ActiveLiquidity.Liquidity)
                : setActiveState(ActiveLiquidity.Staking);
            } else {
              setActiveState(ActiveLiquidity.Liquidity);
            }

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
      );
    } else {
      return (
        <div
          className="bg-primary-500 md:w-[151px] w-[100px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
          onClick={() => {
            setShowLiquidityModal(true);
            dispatch(getTotalVotingPower());
            props.isManage
              ? setActiveState(ActiveLiquidity.Liquidity)
              : setActiveState(ActiveLiquidity.Staking);

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
          Stake
        </div>
      );
    }
  }
  return (
    <>
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.poolsPosition}
          noSearchResult={noSearchResult}
          shortby="yourliquidity"
          tableType={true}
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsPosition"
          TableWidth="md:min-w-[787px] lg:min-w-[950px]"
          NoData={NoData}
        />
      </div>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          isGaugeAvailable={isGaugeAvailable}
        />
      )}
    </>
  );
}
