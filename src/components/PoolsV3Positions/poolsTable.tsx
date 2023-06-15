import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useEffect, useState } from "react";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
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
import { AppDispatch, useAppSelector } from "../../redux";

import stake from "../../assets/icon/pools/stakePool.svg";
import newPool from "../../assets/icon/pools/newPool.svg";
import { getTotalVotingPower } from "../../redux/pools";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import clsx from "clsx";
import { tokenIcons } from "../../constants/tokensList";
import { ActiveIncDecState, ActivePopUp, ManageTabV3 } from "../v3/ManageTabV3";
import IncreaseDecreaseLiqMain from "../v3/IncreaseDecreaseliqMain";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import { ManagePoolsV3 } from "./ManagePoolsV3";

export function PoolsV3TablePosition(props: IPoolsTablePosition) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const tokens = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
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
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center overflow-hidden ">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
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
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center overflow-hidden">
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
            <div>
              <div className="font-body2 md:font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenB.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenA.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenA.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenB.toString()
                    )}`}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Your liquidity",
        id: "yourliquidity",
        columnWidth: "w-[80px] pr-2.5",
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
        accessor: (x) => <ManageBtn tokenA={x.tokenA.toString()} tokenB={x.tokenB.toString()} />,
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPositionsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[204px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenA", true),
        accessor: (x: any) => (
          <>
            {!x.isGaugeAvailable ? <Image src={newPool} width={"20px"} height={"20px"} /> : null}
            <div
              className={clsx(
                " flex justify-center items-center",
                !x.isGaugeAvailable ? "ml-[14px]" : ""
              )}
            >
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center overflow-hidden">
                <img
                  alt={"alt"}
                  src={
                    tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
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
              <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center overflow-hidden">
                <img
                  alt={"alt"}
                  src={
                    tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
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
              <div>
                <div className="font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.tokenA.toString()) === "CTEZ"
                    ? ` ${tEZorCTEZtoUppercase(x.tokenB.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenA.toString()
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.tokenA.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenB.toString()
                      )}`}
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
        Header: `Min/Max price`,
        id: "Min/Max price",
        columnWidth: "w-[144px]",
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
        Header: "Fees collected",
        id: "Fees collected",
        columnWidth: "w-[138px]",
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
        Header: "",
        id: "range",
        columnWidth: "w-[148px] ",

        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
        accessor: (x: any) =>
          true ? (
            <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
              <Image src={infoOrange} />
              Out of range
            </span>
          ) : (
            <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
              <Image src={infoGreen} />
              In Range
            </div>
          ),
      },
      {
        Header: "",
        id: "collect fee",
        columnWidth: "w-[185px] ",

        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
        accessor: (x: any) => (
          <div className="bg-primary-500/10 md:w-[151px] w-[100px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center">
            collect fees
          </div>
        ),
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[200px] ",
        accessor: (x) => <ManageBtn tokenA={x.tokenA.toString()} tokenB={x.tokenB.toString()} />,
      },
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    return (
      <div
        className="bg-primary-500/10 md:w-[151px] w-[100px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
        onClick={() => {
          setShowLiquidityModal(true);

          setActiveState(ActiveLiquidity.Liquidity);

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
          TableName="poolsPositionv3"
          TableWidth="md:min-w-[980px] lg:min-w-[980px]"
          NoData={NoData}
        />
      </div>
      {showLiquidityModal && (
        <ManagePoolsV3
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          showLiquidityModal={showLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          setShowLiquidityModalPopup={setShowLiquidityModal}
        />
      )}
    </>
  );
}
