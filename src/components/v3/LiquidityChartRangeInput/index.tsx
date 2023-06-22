import { format } from "d3";
import { saturate } from "polished";
import React, { useCallback, useMemo } from "react";
import { batch, useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import { AppDispatch, useAppSelector } from "../../../redux";

import { tokenParameterLiquidity } from "../../Liquidity/types";

import { Chart } from "./Chart";
import { useDensityChartData } from "./hooks";
import { ZoomLevels } from "./types";
import { calcTick } from "../../../utils/outSideClickHook";
export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.9,
    initialMax: 1.1,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
  isFull,
}: {
  currencyA: tokenParameterLiquidity | undefined;
  currencyB: tokenParameterLiquidity | undefined;
  feeAmount?: FeeAmount;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price: number;
  priceLower?: number;
  priceUpper?: number;
  onLeftRangeInput: (value: string) => void;
  onRightRangeInput: (value: string) => void;
  interactive: boolean;
  isFull: boolean;
}) {
  const tokenAColor = "#1570F1";
  const tokenBColor = "#1570F1";
  const leftbrush = useAppSelector((state) => state.poolsv3.leftbrush);
  const rightbrush = useAppSelector((state) => state.poolsv3.rightbrush);
  const isSorted = true;
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const tokenoutorg = useAppSelector((state) => state.poolsv3.tokenOutOrg);

  const Bleftbrush = useAppSelector((state) => state.poolsv3.Bleftbrush);
  const Brightbrush = useAppSelector((state) => state.poolsv3.Brightbrush);

  const { isLoadingData, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if ((mode === "handle" || mode === "reset") && leftRangeValue > 0) {
          onLeftRangeInput(leftRangeValue.toFixed(6));
        }

        if ((mode === "handle" || mode === "reset") && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [onLeftRangeInput, onRightRangeInput]
  );

  interactive = interactive && Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    let leftPrice, rightPrice;

    if (!isFull) {
      if (topLevelSelectedToken.symbol === tokeninorg.symbol && rightbrush && leftbrush) {
        leftPrice = isSorted ? Number(leftbrush) : priceUpper;
        rightPrice = isSorted ? Number(rightbrush) : priceLower;
      } else if (Brightbrush && Bleftbrush) {
        leftPrice = isSorted ? Number(Bleftbrush) : priceUpper;
        rightPrice = isSorted ? Number(Brightbrush) : priceLower;
      } else {
        leftPrice = isSorted ? priceLower : priceUpper;
        rightPrice = isSorted ? priceUpper : priceLower;
      }
      return leftPrice && rightPrice
        ? [parseFloat(leftPrice?.toFixed(6)), parseFloat(rightPrice?.toFixed(6))]
        : undefined;
    }
    return leftPrice && rightPrice ? [parseFloat(leftPrice), parseFloat(rightPrice)] : undefined;
  }, [priceLower, priceUpper, topLevelSelectedToken, isFull]);
  const dispatch = useDispatch<AppDispatch>();
  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) {
        return "0";
      }
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) {
        return "∞";
      }
      if (isFull) {
        if (d === "e") {
          return "-100%";
        } else return "100%";
      }
      const percent =
        (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100;

      return price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "";
    },
    [isSorted, price, ticksAtLimit, isFull]
  );

  if (error) {
    // Sentry.captureMessage(error.toString(), "log");
  }

  const isUninitialized = !currencyA || !currencyB || formattedData === undefined;
  return (
    <div style={{ minHeight: "200px" }}>
      {isUninitialized ? (
        <div className="flex items-center pt-[100px]  justify-center">
          Your position will appear here.
        </div>
      ) : isLoadingData ? (
        <div className="justify-center items-center  flex h-[180px]">
          <div className="spinner"></div>
        </div>
      ) : (
        // : error ? (
        //   <div className="flex items-center pt-[100px]  justify-center">
        //     Liquidity data not available.
        //   </div>
        // ) : !isLoadingData && (!formattedData || formattedData.length === 0 || !price) ? (
        //   <div className="flex items-center pt-[100px] justify-center">
        //     There is no liquidity data.
        //   </div>
        // )
        <div className="relative justify-center items-center">
          <Chart
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: "rgba(21,112,241,0.2)",
              },
              brush: {
                handle: {
                  west: saturate(0.1, tokenAColor) ?? "FF0000",
                  east: saturate(0.1, tokenBColor) ?? "#AA4A44",
                },
              },
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </div>
      )}
    </div>
  );
}
