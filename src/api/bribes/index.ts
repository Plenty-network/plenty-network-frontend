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
} from "./types";
import { BigNumber } from "bignumber.js";
import { IEpochData, IEpochResponse, ITokenPriceList } from "../util/types";
import { IBribesResponse } from "../votes/types";
import { Bribes, VolumeVeData } from "../pools/types";
import { fetchEpochData } from "../util/epoch";
import { IAmmContracts } from "../../config/types";
import { getAllVotesData } from "../votes";
import { getDexAddress } from "../util/fetchConfig";

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

    let groupedData : Map<string , number[]> = new Map();
    for(const bribe of myBribesData){
      const key = bribe.value+'_'+bribe.name+'_'+bribe.amm;

      if(groupedData.has(key)){
        const epochs = groupedData.get(key) as number[];
        epochs.push(Number(bribe.epoch));
        epochs.sort();   // might not be reqd if data is given sorted
        groupedData.set(key , epochs);   // might not be reqd if arrays are stored in memory
      }
      else{
        groupedData.set(key , [Number(bribe.epoch)]);
      }
    }

    for (let entry of groupedData.entries()) {
      const splitKey = entry[0].split("_");
      //0 : value , 1 : name , 2 : amm  

      const AMM = AMMS[splitKey[2]];
      const bribeValuePerEpoch = new BigNumber(splitKey[0]).dividedBy(new BigNumber(10).pow(TOKEN[splitKey[1]].decimals)).multipliedBy(tokenPrice[splitKey[1]]);
      const bribeValue = bribeValuePerEpoch.multipliedBy(entry[1].length);

      const epochs = entry[1];
      const epochStart = epochs[0];
      const epochEnd = epochs[epochs.length-1];
      const startDataResponse = await fetchEpochData(epochStart);
      const endDataResponse = await fetchEpochData(epochEnd);
      const startData = startDataResponse.epochData as IEpochData;
      const endData = endDataResponse.epochData as IEpochData;

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
        epochStartDate : startData.epochStartTimestamp,
        epochEndDate : endData.epochEndTimestamp
      });
 
  }

  console.log(allData);

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
 const getPoolsBribeLiquidityData = async (epoch: number): Promise<IPoolsBribeLiquidityData> => {
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
              .multipliedBy(y.price)
          );
          bribes.push({
            name: y.name,
            value: new BigNumber(y.value).dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals)),
            price: new BigNumber(y.price),
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

/**
 * Returns the list of pools with their bribes, liquidity and votes data(current and previous).
 * @param epoch - Epoch number for which the pools data is required
 */
export const getPoolsDataForBribes = async (epoch: number): Promise<IPoolsForBribesResponse> => {
  try {
    // TODO : UnComment when launching
    // const state = store.getState();
    // const AMMS = state.config.AMMs;
    // console.log(`epoch:${epoch}, tokenId:${tokenId}`);
    // TODO: Remove this get call
    const AMMResponse = await axios.get("https://config.plentydefi.com/v1/config/amm");
    const AMMS: IAmmContracts = AMMResponse.data;

    const [poolsData, votesDataCurrent, votesDataPrevious] = await Promise.all([
      getPoolsBribeLiquidityData(epoch),
      getAllVotesData(epoch, undefined),
      getAllVotesData(epoch - 1, undefined),
    ]);

    if (Object.keys(poolsData).length === 0) {
      throw new Error("No pools data found");
    }
    const allDataForPools: IPoolsForBribesData[] = [];

    for (const poolData of Object.keys(poolsData)) {
      const AMM = AMMS[poolData];

      //TODO: Remove next two lines during mainnet launch
      const testnetDex = getDexAddress(AMM.token1.symbol, AMM.token2.symbol);
      const dexForVotes = testnetDex !== "false" ? testnetDex : poolData;

      allDataForPools.push({
        //TODO: Remove next line
        amm: testnetDex,
        // TODO: Uncomment next line
        // amm: AMM.address,
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
        //TODO: Uncomment for mainnet
        /* totalVotesCurrent:
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
         */
        //TODO: Remove for mainnet
        totalVotesCurrent:
          Object.keys(votesDataCurrent.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataCurrent.totalVotesData[dexForVotes]
            ? votesDataCurrent.totalVotesData[dexForVotes].votes
            : new BigNumber(0),
        totalVotesPercentageCurrent:
          Object.keys(votesDataCurrent.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataCurrent.totalVotesData[dexForVotes]
            ? votesDataCurrent.totalVotesData[dexForVotes].votePercentage
            : new BigNumber(0),
        totalVotesPrevious:
          Object.keys(votesDataPrevious.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataPrevious.totalVotesData[dexForVotes]
            ? votesDataPrevious.totalVotesData[dexForVotes].votes
            : new BigNumber(0),
        totalVotesPercentagePrevious:
          Object.keys(votesDataPrevious.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesDataPrevious.totalVotesData[dexForVotes]
            ? votesDataPrevious.totalVotesData[dexForVotes].votePercentage
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