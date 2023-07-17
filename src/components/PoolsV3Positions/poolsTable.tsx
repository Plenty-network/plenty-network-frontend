import * as React from "react";
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
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import clsx from "clsx";
import { tokenIcons } from "../../constants/tokensList";

import { ManagePoolsV3 } from "./ManagePoolsV3";
import { IV3PositionObject } from "../../api/v3/types";
import { setSelectedPosition } from "../../redux/poolsv3";
import { StakePercentage } from "./StakedPercentage";

export function PoolsV3TablePosition(props: IPoolsTablePosition) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const tokens = useAppSelector((state) => state.config.tokens);

  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );

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

  // const mobilecolumns = React.useMemo<Column<IV3PositionObject>[]>(
  //   () => [
  //     {
  //       Header: "Pool",
  //       id: "pools",
  //       columnWidth: "w-[220px]",
  //       showOnMobile: true,
  //       sortType: (a: any, b: any) => compareNumericString(a, b, "tokenX", true),
  //       accessor: (x: any) => (
  //         <div className=" flex justify-center items-center">
  //           <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center overflow-hidden ">
  //             <img
  //               alt={"alt"}
  //               src={
  //                 tEZorCTEZtoUppercase(x.tokenX.toString()) === "CTEZ"
  //                   ? tokenIcons[x.tokenY]
  //                     ? tokenIcons[x.tokenY].src
  //                     : tokens[x.tokenY.toString()]?.iconUrl
  //                     ? tokens[x.tokenY.toString()].iconUrl
  //                     : `/assets/Tokens/fallback.png`
  //                   : tokenIcons[x.tokenX]
  //                   ? tokenIcons[x.tokenX].src
  //                   : tokens[x.tokenX.toString()]?.iconUrl
  //                   ? tokens[x.tokenX.toString()].iconUrl
  //                   : `/assets/Tokens/fallback.png`
  //               }
  //               width={"20px"}
  //               height={"20px"}
  //               onError={changeSource}
  //             />
  //           </div>
  //           <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center overflow-hidden">
  //             <img
  //               alt={"alt"}
  //               src={
  //                 tEZorCTEZtoUppercase(x.tokenX) === "CTEZ"
  //                   ? tokenIcons[x.tokenX]
  //                     ? tokenIcons[x.tokenX].src
  //                     : tokens[x.tokenX.toString()]?.iconUrl
  //                     ? tokens[x.tokenX.toString()].iconUrl
  //                     : `/assets/Tokens/fallback.png`
  //                   : tokenIcons[x.tokenY]
  //                   ? tokenIcons[x.tokenY].src
  //                   : tokens[x.tokenY.toString()]?.iconUrl
  //                   ? tokens[x.tokenY.toString()].iconUrl
  //                   : `/assets/Tokens/fallback.png`
  //               }
  //               width={"20px"}
  //               height={"20px"}
  //               onError={changeSource}
  //             />
  //           </div>
  //           <div>
  //             <div className="font-body2 md:font-body4">
  //               {" "}
  //               {tEZorCTEZtoUppercase(x.tokenX.toString()) === "CTEZ"
  //                 ? ` ${tEZorCTEZtoUppercase(x.tokenY.toString())} / ${tEZorCTEZtoUppercase(
  //                     x.tokenX.toString()
  //                   )}`
  //                 : ` ${tEZorCTEZtoUppercase(x.tokenX.toString())} / ${tEZorCTEZtoUppercase(
  //                     x.tokenY.toString()
  //                   )}`}
  //             </div>
  //             {/* <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div> */}
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       Header: "Your liquidity",
  //       id: "yourliquidity",
  //       columnWidth: "w-[124px]",
  //       tooltipMessage: "Value of tokens supplied to the pair.",
  //       isToolTipEnabled: true,
  //       canShort: true,
  //       showOnMobile: true,
  //       sortType: (a: any, b: any) => compareNumericString(a, b, "liquidityDollar"),
  //       accessor: (x: any) => (
  //         <YourLiquidity
  //           value={x.liquidityDollar}
  //           liquidity={x.liquidity}
  //           tokenA={x.tokenX.toString()}
  //           tokenB={x.tokenY.toString()}
  //         />
  //       ),
  //     },
  //     {
  //       Header: `Min/Max price`,
  //       id: "Min/Max price",
  //       columnWidth: "w-[154px]",
  //       tooltipMessage: "Percentage liquidity staked in the pool’s gauge.",
  //       sortType: (a: any, b: any) => compareNumericString(a, b, "maxPrice"),
  //       canShort: true,
  //       isToolTipEnabled: true,
  //       accessor: (x: any) => (
  //         <div className="text-end">
  //           <div className=" text-text-50 font-subtitle4 ">
  //             {nFormatterWithLesserNumber(x.minPrice)} /{" "}
  //             {x.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber(x.maxPrice)}
  //             {/* <div className="font-body3 text-text-500">
  //               {tEZorCTEZtoUppercase(x.tokenX)} per {tEZorCTEZtoUppercase(x.tokenY)}
  //             </div> */}
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       Header: "Fees collected",
  //       id: "Fees collected",
  //       columnWidth: "w-[138px]",
  //       tooltipMessage: "Annual percentage rate of return on your staked position.",
  //       sortType: (a: any, b: any) => compareNumericString(a, b, "feesDollar"),
  //       isToolTipEnabled: true,
  //       canShort: true,
  //       accessor: (x: any) => <StakePercentage value={x.feesDollar} />,
  //     },
  //     {
  //       Header: "",
  //       id: "range",
  //       columnWidth: "w-[158px] ",

  //       sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
  //       accessor: (x: any) =>
  //         !x.isInRange ? (
  //           <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
  //             <Image src={infoOrange} />
  //             Out of range
  //           </span>
  //         ) : (
  //           <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
  //             <Image src={infoGreen} />
  //             In Range
  //           </div>
  //         ),
  //     },
  //     {
  //       Header: "",
  //       id: "collect fee",
  //       columnWidth: "w-[175px] ",

  //       sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
  //       accessor: (x: any) => (
  //         <div
  //           className={clsx(
  //             x.feesDollar.isEqualTo(0) ? "cursor-not-allowed" : "cursor-pointer",
  //             "bg-primary-500/10 md:w-[151px] w-[100px]   text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
  //           )}
  //           onClick={
  //             x.feesDollar.isEqualTo(0)
  //               ? () => {}
  //               : () => {
  //                   dispatch(setSelectedPosition(x));
  //                   props.handleCollectFeeOperation();
  //                 }
  //           }
  //         >
  //           collect fees
  //         </div>
  //       ),
  //     },
  //     {
  //       Header: "",
  //       id: "manage",
  //       columnWidth: "w-[180px] ",
  //       accessor: (x) => (
  //         <ManageBtn
  //           tokenA={x.tokenX ? x.tokenX.toString() : ""}
  //           tokenB={x.tokenY ? x.tokenY.toString() : ""}
  //           data={x}
  //         />
  //       ),
  //     },
  //   ],
  //   [valueFormat]
  // );

  const desktopcolumns = React.useMemo<Column<IV3PositionObject>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[204px]",
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
                    tEZorCTEZtoUppercase(x.tokenX.toString()).substring(0, 1).toLowerCase() >
                    tEZorCTEZtoUppercase(x.tokenY.toString()).substring(0, 1).toLowerCase()
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
                    tEZorCTEZtoUppercase(x.tokenX.toString()).substring(0, 1).toLowerCase() >
                    tEZorCTEZtoUppercase(x.tokenY.toString()).substring(0, 1).toLowerCase()
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
        tooltipMessage: "Percentage liquidity staked in the pool’s gauge.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "maxPrice"),
        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) => (
          <div className="text-end">
            <div className=" text-text-50 font-subtitle4 ">
              {nFormatterWithLesserNumber(x.minPrice)} /{" "}
              {x.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber(x.maxPrice)}
              {/* <div className="font-body3 text-text-500">
                {tEZorCTEZtoUppercase(x.tokenX)} per {tEZorCTEZtoUppercase(x.tokenY)}
              </div> */}
            </div>
          </div>
        ),
      },
      {
        Header: "Fees collected",
        id: "Fees collected",
        columnWidth: "w-[138px]",
        tooltipMessage: "Annual percentage rate of return on your staked position.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "feesDollar"),
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <StakePercentage value={x.feesDollar} />,
      },
      {
        Header: "",
        id: "range",
        columnWidth: "w-[158px] ",

        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
        accessor: (x: any) =>
          !x.isInRange ? (
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
        columnWidth: "w-[175px] ",

        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
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
            collect fees
          </div>
        ),
      },
      {
        Header: "",
        id: "manage",
        columnWidth: "w-[170px] ",
        accessor: (x) => (
          <ManageBtn
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
        className="bg-primary-500/10 md:w-[130px] w-[100px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle3 rounded-lg flex items-center h-[40px] justify-center"
        onClick={() => {
          setShowLiquidityModal(true);
          dispatch(setSelectedPosition(props.data));
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
          columns={desktopcolumns}
          data={props.poolsPosition ? props.poolsPosition : []}
          shortby="yourliquidity"
          tableType={true}
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsPositionv3"
          TableWidth="min-w-[980px]"
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
