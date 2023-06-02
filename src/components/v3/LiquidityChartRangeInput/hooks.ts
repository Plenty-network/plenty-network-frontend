import JSBI from "jsbi";

import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getTickAndRealPriceFromPool } from "../../../api/v3/helper";
import { AppDispatch, useAppSelector } from "../../../redux";
import { setIsLoading } from "../../../redux/poolsv3";
import { tokenParameterLiquidity } from "../../Liquidity/types";
export declare enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

import { ChartEntry } from "./types";
export interface TickProcessed {
  tick: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
}
export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA: tokenParameterLiquidity | undefined;
  currencyB: tokenParameterLiquidity | undefined;
  feeAmount: FeeAmount | undefined;
}) {
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const isLoading = false;
  const error = undefined;
  const [data, setData] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();
  useMemo(() => {
    dispatch(setIsLoading(true));
    getTickAndRealPriceFromPool("KT1AmeUTxh28afcKVgD6mJEzoSo95NThe3TW").then((response) => {
      setData(response);
    });
  }, [currencyA, currencyB]);

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: ChartEntry[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      const t: any = data[i];

      const chartEntry = {
        Tick: t.tick,
        activeLiquidity: parseFloat(t.liquidityNet.toString()),
        price0:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? parseFloat(t.realPriceX)
            : parseFloat(t.realPriceY),
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }
    dispatch(setIsLoading(false));
    return newData;
  }, [data]);

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: !isLoading ? formatData() : undefined,
    };
  }, [isLoading, error, formatData]);
}
