import { BigNumber } from "bignumber.js";
import axios from "axios";
import { IAllPoolsDataResponse, IMyPoolsDataResponse, IDataResponse } from "./types";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { store } from "../../redux";
import { POOLS_PAGE_LIMIT } from "../../constants/global";
const state = store.getState();
const AMMS = state.config.V3_AMMs;

export const getAllPoolsDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try {
    const allData: any[] = [];

    const fetchAnalyticsPoolsData = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let analyticsPoolsData: any[] = fetchAnalyticsPoolsData.data;

    const fetchVePoolsData = await axios.get(`${Config.VE_ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let vePoolsData: any[] = fetchVePoolsData.data;

    analyticsPoolsData.map<any>((datum) => {
      let poolPairs: any[] = Object.values(AMMS).filter((e: any) => e.address === datum.pool);
      let vePoolPairs: any[] = Object.values(vePoolsData).filter((e: any) => e.pool === datum.pool);

      if(poolPairs[0]){
          allData.push({
            tokenA: poolPairs[0].tokenX.symbol,
            tokenB: poolPairs[0].tokenY.symbol,
            feeTier: poolPairs[0].feeBps/100,
            apr: Number(vePoolPairs[0].tvl.value) === 0 ? 0 : ((vePoolPairs[0].fees7D.value*52)/vePoolPairs[0].tvl.value)*100,
            volume: {
              value: BigNumber(vePoolPairs[0].volume24H.value),
              token1: BigNumber(vePoolPairs[0].volume24H.token1),
              token2: BigNumber(vePoolPairs[0].volume24H.token2),
            },
            tvl: {
              value: BigNumber(vePoolPairs[0].tvl.value),
              token1: BigNumber(vePoolPairs[0].tvl.token1),
              token2: BigNumber(vePoolPairs[0].tvl.token2),
            },
            fees: {
              value: BigNumber(vePoolPairs[0].fees7D.value),
              token1: BigNumber(vePoolPairs[0].fees7D.token1),
              token2: BigNumber(vePoolPairs[0].fees7D.token2),
            }
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
    const v3PositionsResponse = await axios.get(`${Config.VE_INDEXER[connectedNetwork]}v3-positions?address=${userTezosAddress}`);
    const v3IndexerPositionsData: any[] = v3PositionsResponse.data;

    const fetchAnalyticsPoolsData = await axios.get(`${Config.ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let analyticsPoolsData: any[] = fetchAnalyticsPoolsData.data;

    const fetchVePoolsData = await axios.get(`${Config.VE_ANALYTICS_INDEXER[connectedNetwork]}pools`);
    let vePoolsData: any[] = fetchVePoolsData.data;

    const allData: any[] = [];
    const finalData: any[] = [];
    const allPositionsLength = v3IndexerPositionsData.length;

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
        const address = AMM.address
        if (AMM) {
          allData.push({
            address: address,
            tokenA: tokenA,
            tokenB: tokenB,
            feeTier: feeTier,
          });
        }
    }   

    let uniqueAllData = allData.map(e => {
        return { 
            address: e.address,
            tokenA: e.tokenA,
            tokenB: e.tokenB,
            feeTier: e.feeTier,
        } 
    }).filter((element, index, array) => {
        return array.findIndex(a => a.tokenA === element.tokenA && a.tokenB === element.tokenB  && a.feeTier === element.feeTier) === index
    });

    analyticsPoolsData.map<any>((datum) => {
        let poolPairs: any[] = Object.values(uniqueAllData).filter((e: any) => e.address === datum.pool);
        let vePoolPairs: any[] = Object.values(vePoolsData).filter((e: any) => e.pool === datum.pool);

        if(poolPairs[0]){
            finalData.push({
              tokenA: poolPairs[0].tokenA,
              tokenB: poolPairs[0].tokenB,
              feeTier: poolPairs[0].feeTier,
              apr: Number(datum.tvl.value) === 0 ? 0 : ((datum.fees.value7D*52)/datum.tvl.value)*100,
              volume: {
                value: BigNumber(vePoolPairs[0].volume24H.value),
                token1: BigNumber(vePoolPairs[0].volume24H.token1),
                token2: BigNumber(vePoolPairs[0].volume24H.token2),
              },
              tvl: {
                value: BigNumber(vePoolPairs[0].tvl.value),
                token1: BigNumber(vePoolPairs[0].tvl.token1),
                token2: BigNumber(vePoolPairs[0].tvl.token2),
              },
              fees: {
                value: BigNumber(vePoolPairs[0].fees24H.value),
                token1: BigNumber(vePoolPairs[0].fees24H.token1),
                token2: BigNumber(vePoolPairs[0].fees24H.token2),
              }
            })
        }
    });

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

export const getPoolsShareDataV3 = async (): Promise<IAllPoolsDataResponse> => {
  try {
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