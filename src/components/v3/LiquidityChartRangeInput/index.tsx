import { format } from "d3";
import { saturate } from "polished";
import React, { useCallback, useMemo } from "react";
import { batch, useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "../../../redux";
import { setIsLeftDiff, setIsRightDiff } from "../../../redux/poolsv3";
import { tokenParameterLiquidity } from "../../Liquidity/types";

import { Chart } from "./Chart";
import { useDensityChartData } from "./hooks";
import { ZoomLevels } from "./types";
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
    initialMin: 0.999,
    initialMax: 1.001,
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
  price: number | undefined;
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
  const isLoadingData = useAppSelector((state) => state.poolsv3.isLoading);
  const { isLoading, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
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
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
            mode === "handle" ||
            mode === "reset") &&
          leftRangeValue > 0
        ) {
          onLeftRangeInput(leftRangeValue.toFixed(6));
        }

        if (
          (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === "reset") &&
          rightRangeValue > 0
        ) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit]
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
  }, [isSorted, leftbrush, rightbrush, Bleftbrush, Brightbrush, topLevelSelectedToken, isFull]);
  const dispatch = useDispatch<AppDispatch>();
  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) {
        dispatch(setIsLeftDiff({ Rightdiff: "0" }));
        return "0";
      }
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) {
        dispatch(setIsRightDiff({ LeftDiff: "∞" }));
        return "∞";
      }
      if (isFull) {
        if (d === "e") {
          return "-100%";
        } else return "100%";
      }
      const percent =
        (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100;
      d === "e"
        ? dispatch(
            setIsRightDiff({
              Rightdiff: price
                ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%`
                : "",
            })
          )
        : dispatch(
            setIsLeftDiff({
              LeftDiff: price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "",
            })
          );
      return price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "";
    },
    [isSorted, price, ticksAtLimit, isFull]
  );

  if (error) {
    // Sentry.captureMessage(error.toString(), "log");
  }

  const isUninitialized = !currencyA || !currencyB || (formattedData === undefined && !isLoading);
  return (
    // useMemo(
    //   () => (
    <div style={{ minHeight: "200px" }}>
      {isUninitialized ? (
        "Your position will appear here."
      ) : isLoadingData ? (
        <div className="justify-center items-center  flex h-[180px]">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        "Liquidity data not available."
      ) : !formattedData || formattedData.length === 0 || !price ? (
        "There is no liquidity data."
      ) : (
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
    //   ),
    //   [leftbrush, rightbrush, onLeftRangeInput, onRightRangeInput]
  );
}
