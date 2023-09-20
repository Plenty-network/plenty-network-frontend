import * as React from "react";
import { BigNumber } from "bignumber.js";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IManageBtnProps, IPoolsTablePosition } from "./types";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { YourLiquidity } from "./YourLiquidity";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux";

import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import {
  changeSource,
  nFormatterWithLesserNumber,
  nFormatterWithLesserNumber5digit,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import clsx from "clsx";
import { tokenIcons } from "../../constants/tokensList";

import { ManagePoolsV3 } from "./ManagePoolsV3";
import { IV3PositionObject } from "../../api/v3/types";
import { setSelectedPosition, setcurrentPrice } from "../../redux/poolsv3";
import { StakePercentage } from "./StakedPercentage";
import { calculateCurrentPrice } from "../../api/v3/liquidity";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

export function PoolsV3TablePosition(props: IPoolsTablePosition) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const tokens = useAppSelector((state) => state.config.tokens);

  const NoData = React.useMemo(() => {
    return <NoPoolsPosition h1={"No active liquidity positions"} cta={"View Pools"} />;
  }, []);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const [isFlip, setFlip] = React.useState(false);
  React.useEffect(() => {
    props.poolsPosition?.map((positions) => {
      if (positions.minPrice.isLessThan(0.01) || positions.maxPrice.isLessThan(0.01)) {
        setFlip(true);
      }
    });
  }, [props.poolsPosition]);
  const desktopcolumns = React.useMemo<Column<IV3PositionObject>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[250px]",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenX", true),
        accessor: (x: any) => (
          <>
            <div className={clsx(" flex justify-center items-center")}>
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center overflow-hidden">
                <img
                  alt={"alt"}
                  src={
                    tEZorCTEZtoUppercase(x.tokenX.toString()) === "CTEZ"
                      ? tokenIcons[x.tokenY]
                        ? tokenIcons[x.tokenY].src
                        : tokens[x.tokenY.toString()]?.iconUrl
                        ? tokens[x.tokenY.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                      : tokenIcons[x.tokenX]
                      ? tokenIcons[x.tokenX].src
                      : tokens[x.tokenX.toString()]?.iconUrl
                      ? tokens[x.tokenX.toString()].iconUrl
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
                    tEZorCTEZtoUppercase(x.tokenX.toString()) === "CTEZ"
                      ? tokenIcons[x.tokenX]
                        ? tokenIcons[x.tokenX].src
                        : tokens[x.tokenX.toString()]?.iconUrl
                        ? tokens[x.tokenX.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                      : tokenIcons[x.tokenY]
                      ? tokenIcons[x.tokenY].src
                      : tokens[x.tokenY.toString()]?.iconUrl
                      ? tokens[x.tokenY.toString()].iconUrl
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
                  {tEZorCTEZtoUppercase(x.tokenX.toString()).substring(0, 1).toLowerCase() >
                  tEZorCTEZtoUppercase(x.tokenY.toString()).substring(0, 1).toLowerCase()
                    ? ` ${tEZorCTEZtoUppercase(x.tokenY.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenX.toString()
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.tokenX.toString())} / ${tEZorCTEZtoUppercase(
                        x.tokenY.toString()
                      )}`}
                </div>
              </div>
              <span className="bg-primary-500/[0.2] rounded-lg  px-2  text-white md:font-body2 font-caption1-small  text-center	py-1.5 px-2   w-fit  ml-2 md:ml-3">
                {x.feeTier}%
              </span>
            </div>
          </>
        ),
      },
      {
        Header: "Your liquidity",
        id: "yourliquidity",
        columnWidth: "w-[124px]",

        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "liquidityDollar"),
        accessor: (x: any) => (
          <YourLiquidity
            value={x.liquidityDollar}
            liquidity={x.liquidity}
            tokenA={x.tokenX.toString()}
            tokenB={x.tokenY.toString()}
          />
        ),
      },
      {
        Header: `Min/Max price`,
        id: "Min/Max price",
        columnWidth: "w-[154px]",
        tooltipMessage: "Lower and upper price boundaries.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "maxPrice"),
        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) => (
          <ToolTip
            id="tooltipj"
            position={Position.top}
            toolTipChild={
              <>
                {" "}
                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-start ">
                  <div className={` font-medium `}>
                    Min price:{" "}
                    <span className="text-white">
                      {isFlip
                        ? nFormatterWithLesserNumber5digit(new BigNumber(1).dividedBy(x.maxPrice))
                        : nFormatterWithLesserNumber5digit(x.minPrice)}
                    </span>
                  </div>
                </div>
                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-start ">
                  <div className={` font-medium  `}>
                    Max price:{" "}
                    <span className="text-white">
                      {x.isMaxPriceInfinity
                        ? "∞"
                        : isFlip
                        ? nFormatterWithLesserNumber5digit(new BigNumber(1).dividedBy(x.minPrice))
                        : nFormatterWithLesserNumber5digit(x.maxPrice)}
                    </span>
                  </div>
                </div>
              </>
            }
          >
            <div className="text-end font-body4 cursor-pointer text-white">
              <div className="Total value locked up in the pool.">
                {isFlip
                  ? nFormatterWithLesserNumber(new BigNumber(1).dividedBy(x.maxPrice))
                  : nFormatterWithLesserNumber(x.minPrice)}{" "}
                /{" "}
                {x.isMaxPriceInfinity
                  ? "∞"
                  : isFlip
                  ? nFormatterWithLesserNumber(new BigNumber(1).dividedBy(x.minPrice))
                  : nFormatterWithLesserNumber(x.maxPrice)}
                {/* {nFormatterWithLesserNumber(x.minPrice)} /{" "}
              {x.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber(x.maxPrice)} */}
                {/* <div className="font-body3 text-text-500">
                {tEZorCTEZtoUppercase(x.tokenX)} per {tEZorCTEZtoUppercase(x.tokenY)}
              </div> */}
                <div className="font-body3 text-text-500">
                  {isFlip
                    ? tEZorCTEZtoUppercase(x.tokenX.toString())
                    : tEZorCTEZtoUppercase(x.tokenY.toString())}{" "}
                  per{" "}
                  {isFlip
                    ? tEZorCTEZtoUppercase(x.tokenY.toString())
                    : tEZorCTEZtoUppercase(x.tokenX.toString())}
                </div>
              </div>
            </div>
          </ToolTip>
        ),
      },
      {
        Header: "Fees collected",
        id: "Fees collected",
        columnWidth: "w-[138px]",
        tooltipMessage: "Fees collected by the position.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "feesDollar"),
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <StakePercentage value={x.feesDollar} />,
      },
      {
        Header: "",
        id: "range",
        columnWidth: "w-[158px] ",

        accessor: (x: any) =>
          !x.isInRange ? (
            <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
              {/* <Image src={infoOrange} /> */}
              Out of range
            </span>
          ) : (
            <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
              {/* <Image src={infoGreen} /> */}
              In Range
            </div>
          ),
      },
      {
        Header: "",
        id: "collect fee",
        columnWidth: "w-[175px] ",

        accessor: (x: any) => (
          <div
            className={clsx(
              x.feesDollar.isEqualTo(0) ? "cursor-not-allowed" : "cursor-pointer",
              "bg-primary-500/10 md:w-[140px] w-[100px]   text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
            )}
            onClick={
              x.feesDollar.isEqualTo(0)
                ? () => {}
                : () => {
                    dispatch(setSelectedPosition(x));
                    props.handleCollectFeeOperation();
                  }
            }
          >
            Collect fees
          </div>
        ),
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "ml-auto w-[170px] ",
        accessor: (x) => (
          <ManageBtn
            feeTier={x.feeTier}
            setShowLiquidityModal={props.setShowLiquidityModalPopup}
            setTokenIn={props.setTokenIn}
            setTokenOut={props.setTokenOut}
            setFeeTier={props.setFeeTier}
            setActiveState={props.setActiveState}
            tokenA={x.tokenX ? x.tokenX.toString() : "DAI.e"}
            tokenB={x.tokenY ? x.tokenY.toString() : "USDC.e"}
            data={x}
          />
        ),
      },
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    return (
      <div
        className="ml-auto bg-primary-500/10 md:w-[130px] w-[100px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
        onClick={() => {
          calculateCurrentPrice(
            props.tokenA,
            props.tokenB,
            props.tokenA,
            Number(props.feeTier)
          ).then((response) => {
            dispatch(setcurrentPrice(response?.toFixed(6)));
          });
          props.setShowLiquidityModal(true);
          dispatch(setSelectedPosition(props.data));
          props.setActiveState(ActiveLiquidity.Liquidity);
          props.setFeeTier(props.feeTier);
          props.setTokenIn({
            name: props.tokenA,
            image: getImagesPath(props.tokenA.toString()),
            symbol: props.tokenA,
          });
          props.setTokenOut({
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
          columns={desktopcolumns}
          data={props.poolsPosition ? props.poolsPosition : []}
          shortby="yourliquidity"
          tableType={true}
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsPositionv3"
          TableWidth="min-w-[1200px]"
          NoData={NoData}
        />
      </div>
      {/* {showLiquidityModal && (
        <ManagePoolsV3
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          showLiquidityModal={showLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          feeTier={feeTier}
          setShowLiquidityModalPopup={setShowLiquidityModal}
        />
      )} */}
    </>
  );
}
