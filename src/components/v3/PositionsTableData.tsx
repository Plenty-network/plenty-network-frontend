import * as React from "react";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Column } from "react-table";

import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import newPool from "../../../assets/icon/pools/newPool.svg";
import Image from "next/image";
import clsx from "clsx";

import { BigNumber } from "@ethersproject/bignumber";
import { AppDispatch, useAppSelector } from "../../redux";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActivePopUp } from "./ManageTabV3";
import { IV3PositionObject } from "../../api/v3/types";
import { getPositions } from "../../api/v3/positions";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import {
  nFormatterWithLesserNumber,
  nFormatterWithLesserNumber5digit,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { compareNumericString } from "../../utils/commonUtils";
import { setSelectedPosition } from "../../redux/poolsv3";
import Table from "../Table/Table";

export interface IShortCardProps {
  tokenIn: tokenParameterLiquidity;
  handleCollectFeeOperation: () => void;
  tokenOut: tokenParameterLiquidity;
  feeTier: string;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
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
export function PositionDataTable(props: IShortCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const operationSuccesful = useAppSelector((state) => state.walletLoading.operationSuccesful);
  const [isLoading, setIsLoading] = useState(true);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [data, setData] = useState<IV3PositionObject[] | undefined>([]);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const NoData = React.useMemo(() => {
    if (walletAddress === null && data && data?.length === 0) {
      return (
        <span className="fade-in-light flex items-center justify-start md:justify-center pl-5 md:pl-0 h-[245px] text-border-600 font-title3">
          please connect your wallet
        </span>
      );
    } else if (!isLoading && data && data?.length === 0) {
      return (
        <span className="fade-in-light flex items-center justify-start md:justify-center h-[245px]  pl-5 md:pl-0 text-border-600 font-title3">
          No positions
        </span>
      );
    }
  }, [walletAddress, isLoading, data]);
  useEffect(() => {
    if (
      Object.keys(tokenPrice).length !== 0 &&
      Object.prototype.hasOwnProperty.call(props.tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(props.tokenOut, "symbol") &&
      walletAddress
    ) {
      setIsLoading(true);
      getPositions(
        props.tokenIn.symbol,
        props.tokenOut.symbol,
        props.feeTier,
        walletAddress,
        tokenPrice
      ).then((res) => {
        setData(res);
        setIsLoading(false);
      });
      if (walletAddress === null) {
        setIsLoading(false);
      }
    }
  }, [
    props.tokenIn.symbol,
    props.tokenOut.symbol,
    Object.keys(tokenPrice).length,
    walletAddress,
    operationSuccesful,
  ]);

  const desktopcolumns = React.useMemo<Column<IV3PositionObject>[]>(
    () => [
      {
        Header: "Liquidity",
        id: "Liquidity",
        columnWidth: "w-[130px]",

        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "liquidityDollar"),
        accessor: (x) => (
          <>
            <div className="w-[125px] text-white font-subtitle3 flex">
              {" "}
              <ToolTip
                id="tooltipj"
                position={Position.top}
                toolTipChild={
                  <>
                    {" "}
                    <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end ">
                      <div className={`text-white font-medium pr-1 `}>
                        {nFormatterWithLesserNumber(x.liquidity.x)}
                      </div>
                      <div className="">{props.tokenIn.name}</div>
                    </div>
                    <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-end ">
                      <div className={`text-white font-medium pr-1 `}>
                        {nFormatterWithLesserNumber(x.liquidity.y)}
                      </div>
                      <div className="">{props.tokenOut.name}</div>
                    </div>
                  </>
                }
              >
                ${nFormatterWithLesserNumber(x.liquidityDollar)}{" "}
              </ToolTip>
            </div>
          </>
        ),
      },
      {
        Header: "Min/Max price",
        id: "min/max price",
        columnWidth: "lg:w-[176px] w-[155px]",

        tooltipMessage: "Lower and upper price boundaries.",
        isToolTipEnabled: true,

        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "minPrice"),
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
                      {nFormatterWithLesserNumber5digit(x.minPrice)}
                    </span>
                  </div>
                </div>
                <div className="text-text-500 text-f14 font-normal flex gap-1 mt-1 justify-start ">
                  <div className={` font-medium  `}>
                    Max price:{" "}
                    <span className="text-white">
                      {x.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber5digit(x.maxPrice)}
                    </span>
                  </div>
                </div>
              </>
            }
          >
            <div className="lg:w-[176px] w-[155px] text-text-50 font-subtitle4 ">
              {nFormatterWithLesserNumber(x.minPrice)} /{" "}
              {x.isMaxPriceInfinity ? "∞" : nFormatterWithLesserNumber(x.maxPrice)}
              <div className="font-body3 text-text-500">
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
              </div>
            </div>
          </ToolTip>
        ),
      },

      {
        Header: "Fees collected",
        id: "Fees collected",

        columnWidth: "w-[132px]",
        isToolTipEnabled: true,
        tooltipMessage: "Fees collected by the position.",

        sortType: (a: any, b: any) => compareNumericString(a, b, "feesDollar"),
        accessor: (x: any) => (
          <div className="w-[122px] text-white font-subtitle3 flex">
            ${nFormatterWithLesserNumber(x.feesDollar)}
          </div>
        ),
      },
      {
        Header: "",
        id: "range",
        columnWidth: "lg:w-[160px] w-[135px]",

        accessor: (x) => (
          <div className="lg:w-[180px] w-[135px]">
            {!x.isInRange ? (
              <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
                <Image src={infoOrange} />
                Out of range
              </span>
            ) : (
              <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
                <Image src={infoGreen} />
                In Range
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "",
        id: "feescollect",
        columnWidth: "w-[120px]",

        accessor: (x) => (
          <div
            className={clsx(
              x.feesDollar.isEqualTo(0)
                ? "cursor-not-allowed text-primary-500/[0.6]"
                : "cursor-pointer text-primary-500",
              "w-[120px] flex items-center font-subtitle4  "
            )}
            onClick={x.feesDollar.isEqualTo(0) ? () => {} : props.handleCollectFeeOperation}
          >
            Collect fees
            <span className=" h-[28px] border-r border-card-700 ml-auto"></span>
          </div>
        ),
      },

      {
        Header: "",
        id: "manage",
        sticky: "right",
        columnWidth: "w-[100px] ml-auto",
        minWidth: 151,
        accessor: (x) => (
          <div
            className=" font-subtitle4 text-primary-500 text-right pr-2 w-[110px] cursor-pointer"
            onClick={() => {
              dispatch(setSelectedPosition(x));
              props.setScreen(ActivePopUp.ManageExisting);
            }}
          >
            Manage
          </div>
        ),
      },
    ],
    [valueFormat]
  );

  return (
    <>
      {
        <div className={` overflow-x-auto innerPool  `}>
          <Table<any>
            columns={desktopcolumns}
            data={data ? data : []}
            TableName="positionsv3"
            tableType={true}
            isFetched={true}
            TableWidth="min-w-[792px]"
            NoData={NoData}
            loading={isLoading}
          />
        </div>
      }
    </>
  );
}
