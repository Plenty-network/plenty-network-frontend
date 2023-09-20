import { useQuery } from "react-query";
import { getAllPoolsData, getMyPoolsData, poolsDataWrapper } from "..";
import { store } from "../../../redux";
import { getTokenPrices } from "../../util/price";
import { ITokenPriceList } from "../../util/types";
import { getAllPoolsDataV3, getMyPoolsDataV3 } from "../../v3/pools";
import { IAllPoolsDataResponse } from "../../v3/types";
import { IAllPoolsData, IMyPoolsData, IPoolsDataWrapperResponse } from "../types";
import { useEffect, useMemo, useState } from "react";

export const usePoolsMain = () =>
  useQuery<IPoolsDataWrapperResponse[], Error>(
    "pools-mains",
    async () => {
      const tokenprice = store.getState().tokenPrice.tokenPrice;
      // const tokenprice= await (await getTokenPrices()).tokenPrice
      const walletAddress = store.getState().wallet.address;
      const data1 = (await poolsDataWrapper(walletAddress ? walletAddress : undefined, tokenprice))
        .allData;
      const data: IPoolsDataWrapperResponse[] = Object.values(data1);
      return data;
    },
    { refetchInterval: 60000, cacheTime: 1000 * 30 }
  );

export const useAllPoolsData = (tokenPrice: ITokenPriceList, page: number = 0) =>
  useQuery<IAllPoolsData[], Error>(
    ["all-pools-v2", page],
    async () => {
      const allPoolsResponse = await getAllPoolsData(tokenPrice, page);
      const allPoolsData = allPoolsResponse.allData;
      return allPoolsData;
    },
    { refetchInterval: 30000, cacheTime: 1000 * 30, keepPreviousData: true }
  );

export const useAllPoolsDataV3 = (
  tokenPrice: ITokenPriceList,
  page: number = 0,
  placeholderData: IAllPoolsDataResponse[]
) =>
  useQuery<IAllPoolsDataResponse[], Error>(
    ["all-pools-v3", page],
    async () => {
      const allPoolsResponse = await getAllPoolsDataV3();
      const allPoolsData = allPoolsResponse.allData;
      return allPoolsData;
    },
    {
      refetchInterval: 30000,
      cacheTime: 1000 * 30,
      keepPreviousData: true,
      refetchOnMount: "always",
      placeholderData: placeholderData,
    }
  );
export const useMyPoolsData = (
  userTezosAddress: string,
  tokenPrice: ITokenPriceList,
  page: number = 0
) =>
  useQuery<IMyPoolsData[], Error>(
    ["my-pools-v2", page],
    async () => {
      const myPoolsResponse = await getMyPoolsData(userTezosAddress, tokenPrice, page);
      const myPoolsData = myPoolsResponse.allData;
      return myPoolsData;
    },
    { refetchInterval: 30000, cacheTime: 1000 * 30, keepPreviousData: true }
  );

export const useMyPoolsDatav3 = (userTezosAddress: string, page: number = 0) =>
  useQuery<IMyPoolsData[], Error>(
    ["my-pools-v3", page],
    async () => {
      const myPoolsResponse = await getMyPoolsDataV3(userTezosAddress, page);
      const myPoolsData = myPoolsResponse.allData;
      return myPoolsData;
    },
    { refetchInterval: 30000, cacheTime: 1000 * 30, keepPreviousData: true }
  );
