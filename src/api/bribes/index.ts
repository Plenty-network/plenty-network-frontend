import { store } from "../../redux";
import axios from "axios";
import Config from "../../config/config";
import {
  IUserBribeIndexerData,
  IUserBribeDataResponse,
  IUserBribeData,
  IPoolsForBribesResponse,
  IPoolsBribeLiquidityData,
  IPoolsDataObject,
  IPoolsForBribesData,
  IGroupedData,
  IPreProcessedMap,
} from "./types";
import { BigNumber } from "bignumber.js";
import { IEpochData, IEpochResponse, ITokenPriceList } from "../util/types";
import { IBribesResponse } from "../votes/types";
import { Bribes, VolumeVeData } from "../pools/types";
import { fetchEpochData, getNextListOfEpochsMODIFY } from "../util/epoch";
import { IAmmContracts } from "../../config/types";
import { getAllVotesData } from "../votes";
import { getDexAddress } from "../util/fetchConfig";
import { connectedNetwork } from "../../common/walletconnect";
import { EPOCH_DURATION_MAINNET, EPOCH_DURATION_TESTNET } from "../../constants/global";

/**
 * Returns all the bribes created by a provider(user).
 * @param address - Provider wallet address
 * @param tokenPrice - List of all tokens price
 */
export const getUserBribeData = async (
  address: string,
  tokenPrice: ITokenPriceList
): Promise<IUserBribeDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    const TOKEN = state.config.tokens;

    const userBribeResponse = await axios.get(
      `${Config.VE_INDEXER}bribes-provider?address=${address}`
    );
    const myBribesData: IUserBribeIndexerData[] = userBribeResponse.data;
    const allData: IUserBribeData[] = [];

    let preProcessedDataMap : Map<string , IPreProcessedMap> = new Map();
    
    for(const bribe of myBribesData){
      const key = bribe.amm+'_'+bribe.epoch+'_'+bribe.name;

      if(preProcessedDataMap.has(key)){
        const value = preProcessedDataMap.get(key) as IPreProcessedMap;
        const newVal = value.value.plus(new BigNumber(bribe.value));

        preProcessedDataMap.set(key , {value : newVal , price : value.price} );
      }
      else{
        preProcessedDataMap.set(key , {value : new BigNumber(bribe.value) , price : Number(bribe.price)} );
      }

    }
    const preProcessedData : IUserBribeIndexerData[] = [];
    for(let entry of preProcessedDataMap.entries()){
      const key = entry[0].split("_");
      preProcessedData.push({value: entry[1].value.toString() , name :key[2] , amm : key[0] , epoch: key[1] , price: entry[1].price.toString()});
    }

    let groupedData : Map<string , number[]> = new Map();
    for(const bribe of preProcessedData){
      const key = bribe.value+'_'+bribe.name+'_'+bribe.amm+'_'+bribe.price;

      if(groupedData.has(key)){
        const epochs = groupedData.get(key) as number[];
        epochs.push(Number(bribe.epoch));
        epochs.sort(function(a, b){return a - b});
        groupedData.set(key , epochs);   // might not be reqd if arrays are stored in memory
      }
      else{
        groupedData.set(key , [Number(bribe.epoch)]);
      }
    }
    
    let groupedConsecData : IGroupedData[] = [];

    // USE RANGE CODE 
    // if same val , token , amm  with diff epochs , there exist a case they may not be continuous 
    // each discontinuous range is a seperate entry 
    for(let entry of groupedData.entries()){
      const consec = consecutiveRanges(entry[1]);
      for(const group of consec){
        groupedConsecData.push({key : entry[0] , value : group});
      }
    }

    const epochDataResponse = await getNextListOfEpochsMODIFY(10);
    const epochData = epochDataResponse.epochData;

    for (let entry of groupedConsecData) {
      const splitKey = entry.key.split("_");
      //0 : value , 1 : name , 2 : amm  , 3 : price

      const AMM = AMMS[splitKey[2]];
      let bribeValuePerEpoch = new BigNumber(splitKey[0]).dividedBy(new BigNumber(10).pow(TOKEN[splitKey[1]].decimals)).multipliedBy(tokenPrice[splitKey[1]]);

      const epochs = entry.value;

      const epochStart = epochs[0];
      const epochEnd = epochs[epochs.length-1];

      const pastEpochDataResponse = await fetchEpochData(epochStart);  // div by 1000 ho rkha hai
      const pastEpochData = pastEpochDataResponse.epochData as IEpochData;

      let startDate;
      if(epochData[epochStart]){
        startDate = epochData[epochStart].epochStartTimestamp / 1000;
        bribeValuePerEpoch = new BigNumber(splitKey[0]).dividedBy(new BigNumber(10).pow(TOKEN[splitKey[1]].decimals)).multipliedBy(tokenPrice[splitKey[1]]);
      }
      else {
        startDate =  pastEpochData.epochStartTimestamp;
        bribeValuePerEpoch = new BigNumber(splitKey[0]).dividedBy(new BigNumber(10).pow(TOKEN[splitKey[1]].decimals)).multipliedBy(Number(splitKey[3]));
      }

      const epochDuration: number = connectedNetwork === "testnet" ? EPOCH_DURATION_TESTNET/1000 : EPOCH_DURATION_MAINNET/1000;
      const endDate = startDate + (epochDuration * epochs.length);

      const bribeValue = bribeValuePerEpoch.multipliedBy(entry.value.length);

      allData.push({
        ammAddress: AMM.address,
        tokenA: AMM.token1.symbol,
        tokenB: AMM.token2.symbol,
        poolType: AMM.type,
        bribeValue: bribeValue,
        bribeValuePerEpoch : bribeValuePerEpoch,
        bribeToken: splitKey[1],
        epochStart : epochStart ,
        epochEnd : epochEnd ,
        epochStartDate : startDate,
        epochEndDate : endDate
      });
 
  }

    return {
      success: true,
      userBribesData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      userBribesData: [],
      error: error.message,
    };
  }
};

/**
 * Get the pools and bribes data from respective indexers and
 * return a list if all pools and their current bribe data and liquidity.
 * @param epoch - Epoch number
 */
 const getPoolsBribeLiquidityData = async (
   epoch: number,
   tokenPrices: ITokenPriceList
 ): Promise<IPoolsBribeLiquidityData> => {
   try {
     const state = store.getState();
     const TOKENS = state.config.tokens;
     const bribes = await axios.get(`${Config.VE_INDEXER}bribes?epoch=${epoch}`);
     const bribesData: IBribesResponse[] = bribes.data;

     const res: IEpochResponse = await fetchEpochData(epoch);
     let poolsData: VolumeVeData[];

     if (res.success) {
       const epochData = res.epochData as IEpochData;

       const poolssResponse = await axios.get(
         `${Config.PLY_INDEXER}ve/pools?ts=${epochData.epochEndTimestamp - 1}`
       );
       poolsData = poolssResponse.data;
     } else {
       throw new Error(res.error as string);
     }

     const poolsDataObject: IPoolsDataObject = poolsData.reduce(
       (finalPoolsObject: IPoolsDataObject, poolData) => (
         (finalPoolsObject[poolData.pool] = poolData), finalPoolsObject
       ),
       {}
     );

     const finalData: IPoolsBribeLiquidityData = {};

     for (const x of bribesData) {
       let bribe: BigNumber = new BigNumber(0);
       let bribes: Bribes[] = [];
       if (!x.bribes || x.bribes.length === 0) {
         bribe = new BigNumber(0);
       } else {
         for (const y of x.bribes) {
           bribe = bribe.plus(
             new BigNumber(y.value)
               .dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
               .multipliedBy(tokenPrices[y.name])
           );
           bribes.push({
             name: y.name,
             value: new BigNumber(y.value).dividedBy(
               new BigNumber(10).pow(TOKENS[y.name].decimals)
             ),
             price: new BigNumber(tokenPrices[y.name]),
           });
         }
       }
       const liquidity = poolsDataObject[x.pool]
         ? new BigNumber(poolsDataObject[x.pool].tvl.value)
         : new BigNumber(0);
       const liquidityTokenA = poolsDataObject[x.pool]
         ? new BigNumber(poolsDataObject[x.pool].tvl.token1)
         : new BigNumber(0);
       const liquidityTokenB = poolsDataObject[x.pool]
         ? new BigNumber(poolsDataObject[x.pool].tvl.token2)
         : new BigNumber(0);

       finalData[x.pool] = {
         liquidity,
         bribes: bribe,
         bribesData: bribes,
         liquidityTokenA,
         liquidityTokenB,
       };
     }

     return finalData;
   } catch (error: any) {
     console.log(error);
     throw new Error(error.message);
   }
 };

const consecutiveRanges = (arr : number[]) => {
  let len = 1;
  let list = []; 

   for(let i = 1 ; i<=arr.length ; i++){
     if( i === arr.length || arr[i] - arr[i-1] != 1){
       if(len === 1){
        list.push([arr[i - len]]);
       }
       else{
        const temp : number[] = [];

        for(let j = arr[i-len] ; j<= arr[i-1] ; j++)
        temp.push(j);

        list.push(temp);
       }
       len = 1;
     }
     else{
       len++;
     }
   }
   return list;
  
}

/**
 * Returns the list of pools with their bribes, liquidity and votes data(current and previous).
 * @param epoch - Epoch number for which the pools data is required
 */
export const getPoolsDataForBribes = async (
  epoch: number,
  tokenPrices: ITokenPriceList
): Promise<IPoolsForBribesResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
    // console.log(`epoch:${epoch}, tokenId:${tokenId}`);
    // TODO: Remove this get call
   

    const [poolsData, votesDataCurrent, votesDataPrevious] = await Promise.all([
      getPoolsBribeLiquidityData(epoch, tokenPrices),
      getAllVotesData(epoch, undefined),
      getAllVotesData(epoch - 1, undefined),
    ]);

    if (Object.keys(poolsData).length === 0) {
      throw new Error("No pools data found");
    }
    const allDataForPools: IPoolsForBribesData[] = [];

    for (const poolData of Object.keys(poolsData)) {
      const AMM = AMMS[poolData];

      allDataForPools.push({
        amm: AMM.address,
        tokenA: AMM.token1.symbol,
        tokenB: AMM.token2.symbol,
        poolType: AMM.type,
        bribes: poolsData[poolData] ? poolsData[poolData].bribes : new BigNumber(0),
        bribesData: poolsData[poolData] ? poolsData[poolData].bribesData : [],
        liquidity: poolsData[poolData] ? poolsData[poolData].liquidity : new BigNumber(0),
        liquidityTokenA: poolsData[poolData]
          ? poolsData[poolData].liquidityTokenA
          : new BigNumber(0),
        liquidityTokenB: poolsData[poolData]
          ? poolsData[poolData].liquidityTokenB
          : new BigNumber(0),
      
         totalVotesCurrent:
          Object.keys(votesDataCurrent.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataCurrent.totalVotesData[poolData]
            ? votesDataCurrent.totalVotesData[poolData].votes
            : new BigNumber(0),
        totalVotesPercentageCurrent:
          Object.keys(votesDataCurrent.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataCurrent.totalVotesData[poolData]
            ? votesDataCurrent.totalVotesData[poolData].votePercentage
            : new BigNumber(0),
        totalVotesPrevious:
          Object.keys(votesDataPrevious.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataPrevious.totalVotesData[poolData]
            ? votesDataPrevious.totalVotesData[poolData].votes
            : new BigNumber(0),
        totalVotesPercentagePrevious:
          Object.keys(votesDataPrevious.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataPrevious.totalVotesData[poolData]
            ? votesDataPrevious.totalVotesData[poolData].votePercentage
            : new BigNumber(0),
         
      });
    }

    //TODO: Remove next line in mainnet
    const finalData = allDataForPools.filter((data) => data.amm !== "false");

    return {
      success: true,
      poolsData: finalData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      poolsData: [],
      error: error.message,
    };
  }
};