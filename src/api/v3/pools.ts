import { BigNumber } from "bignumber.js";
import axios from "axios";
import { IAllPoolsDataResponse, IMyPoolsDataResponse, IDataResponse } from "./types";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { store } from "../../redux";
import { POOLS_PAGE_LIMIT } from "../../constants/global";

export const getAllPoolsDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try { 
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const allData: any[] = [];

    const fetchAnalyticsPoolsData = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let analyticsPoolsData: any[] = fetchAnalyticsPoolsData.data;

    analyticsPoolsData.map<any>((datum) => {
      let poolPairs: any[] = Object.values(AMMS).filter((e: any) => e.address === datum.pool);

      if(poolPairs[0]){
          allData.push({
            tokenA: poolPairs[0].tokenX.symbol,
            tokenB: poolPairs[0].tokenY.symbol,
            feeTier: poolPairs[0].feeBps/100,
            apr: Number(datum.tvl.value) === 0 ? 0 : ((datum.fees.value7D*52)/datum.tvl.value)*100,
            volume: BigNumber(datum.volume.value24H),
            tvl: BigNumber(datum.tvl.value),
            fees: BigNumber(datum.fees.value24H),
          })
        }
    });

    return {
      success: true,
      allData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: [],
      error: error.message,
    };
  }
};

export const getMyPoolsDataV3 = async (
  userTezosAddress: string,
  page?: number
): Promise<IMyPoolsDataResponse> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("Invalid or empty arguments.");
    }

    const state = store.getState();
    const AMMS = state.config.AMMs;
    const v3PositionsResponse = await axios.get(`${Config.VE_INDEXER[connectedNetwork]}v3-positions?address=${userTezosAddress}`);
    const v3IndexerPositionsData: any[] = v3PositionsResponse.data;

    const allData: any[] = [];
    const allPositionsLength = v3IndexerPositionsData.length;

    const fetchAnalyticsPoolsData = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let analyticsPoolsData: any[] = fetchAnalyticsPoolsData.data;

    const startIndex = page
      ? (page - 1) * POOLS_PAGE_LIMIT < allPositionsLength
        ? (page - 1) * POOLS_PAGE_LIMIT
        : allPositionsLength
      : 0;
    const endIndex =
      page && startIndex + POOLS_PAGE_LIMIT < allPositionsLength
        ? startIndex + POOLS_PAGE_LIMIT
        : allPositionsLength;

    for (let i = startIndex; i < endIndex; i++) {

      const positonData = v3IndexerPositionsData[i];
      const AMM = AMMS[positonData.amm];

      const tokenA = AMM.tokenX?.symbol;
      const tokenB = AMM.tokenY?.symbol;
      const feeTier = Number(AMM.feeBps) / 100;
      const apr = 0;
      const volume = 0;
      const tvl = 0;
      const fees = 0;
      if (AMM) {
        allData.push({
          tokenA: tokenA,
          tokenB: tokenB,
          feeTier: feeTier,
          apr: apr,
          volume: volume,
          tvl: tvl,
          fees: fees,
        });
      }
    }   
    let uniqueAllData = allData.map(e => {
      return { 
          tokenA: e.tokenA,
          tokenB: e.tokenB,
          feeTier: e.feeTier,
          apr: e.apr,
          volume: e.volume,
          tvl: e.tvl,
          fees: e.fees,
      } 
    }).filter((element, index, array) => {
      return array.findIndex(a => a.tokenA === element.tokenA && a.tokenB === element.tokenB  && a.feeTier === element.feeTier) === index
    })

    return {
      success: true,
      allData: uniqueAllData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: [],
      error: error.message,
    };
  }
};

export const getPoolsShareDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const allData: IDataResponse[] = [];
    const finalData: IDataResponse[] = [];
    let poolShare = 0;
    let count;
    let initialTVL;

    const fetchAnalyticsPoolsData = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let analyticsPoolsData: any[] = fetchAnalyticsPoolsData.data;

    analyticsPoolsData.map<any>((datum) => {
      let poolPairs: any[] = Object.values(AMMS).filter((e: any) => e.address === datum.pool);
      if(poolPairs[0]){
          allData.push({
            symbolX: poolPairs[0].tokenX.symbol,
            symbolY: poolPairs[0].tokenY.symbol,
            address: datum.pool,
            feebps: poolPairs[0].feeBps/100,
            tvl: datum.tvl.value
          })
        }
    });

    for (var i = 0; i < allData.length; i++) {
      count = Number(allData[i].tvl);
      initialTVL = Number(allData[i].tvl);

      for (var j = 0; j < allData.length; j++) {
        if(allData[i].symbolX === allData[j].symbolX && allData[i].symbolY === allData[j].symbolY && allData[i].feebps !== allData[j].feebps) {
          count = count + Number(allData[j].tvl);
        } 
      }

      poolShare = (Number(allData[i].tvl)/count) * 100;

      finalData.push({
        symbolX: allData[i].symbolX,
        symbolY: allData[i].symbolY,
        address: allData[i].address,
        feebps: allData[i].feebps,
        poolShare: Number.isNaN(poolShare) ? 0 : poolShare,
      })
    }

    return {
      success: true,
      allData: finalData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: [],
      error: error.message,
    };
  }
};