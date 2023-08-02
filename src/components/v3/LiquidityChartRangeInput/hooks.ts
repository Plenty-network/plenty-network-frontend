import JSBI from "jsbi";

import { BigNumber } from "bignumber.js";
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
import { getV3PoolAddressWithFeeTier } from "../../../api/util/fetchConfig";
export interface TickProcessed {
  tick: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
}
export function useDensityChartData({
  currencyA,
  currencyB,
  feeTier,
}: {
  currencyA: tokenParameterLiquidity;
  currencyB: tokenParameterLiquidity;
  feeTier: number;
}) {
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);

  const error = undefined;
  const [data, setData] = useState<any>();
  const [isLoadingData, setisloading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useMemo(() => {
    setData(undefined);
    setisloading(true);
    const poolAddress = getV3PoolAddressWithFeeTier(currencyA?.symbol, currencyB?.symbol, feeTier);
    getTickAndRealPriceFromPool(poolAddress).then((response) => {
      setData(response);
      setisloading(false);
    });
  }, [currencyA, currencyB, feeTier, topLevelSelectedToken]);

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: ChartEntry[] = [];

    let liquidity = new BigNumber(data[0].liquidityNet);

    for (let i = 0; i < data.length - 1; i++) {
      const t: any = data[i];

      const chartEntry = {
        width:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? Number(data[i + 1].realPriceX) - Number(data[i].realPriceX)
            : Number(data[i].realPriceY) - Number(data[i + 1].realPriceY),
        valueX: (Number(data[i + 1].realPriceX) + Number(data[i].realPriceX)) / 2,
        activeLiquidity: liquidity.toNumber(),
        price0:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? (Number(data[i + 1].realPriceX) + Number(data[i].realPriceX)) / 2
            : (Number(data[i + 1].realPriceY) + Number(data[i].realPriceY)) / 2,
        price1:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? Number(data[i].realPriceX)
            : Number(data[i].realPriceY),
        price2:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? Number(data[i + 1].realPriceX)
            : Number(data[i + 1].realPriceY),
      };

      liquidity = liquidity.plus(data[i + 1].liquidityNet);

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    dispatch(setIsLoading(false));
    return newData;
  }, [data, topLevelSelectedToken]);

  return useMemo(() => {
    return {
      isLoadingData,
      error,
      formattedData: !isLoadingData ? formatData() : undefined,
    };
  }, [isLoadingData, error, formatData]);
}
