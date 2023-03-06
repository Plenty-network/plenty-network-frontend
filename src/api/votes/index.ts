import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { connectedNetwork, voterAddress as voterContractAddress } from "../../common/walletconnect";
import { getStorage, getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { voteEscrowStorageType, voterStorageType } from "./data";
import { MAX_TIME, PLY_DECIMAL_MULTIPLIER, VOTES_CHART_LIMIT, WEEK } from "../../constants/global";
import {
  ELocksState,
  IAllVotesData,
  IAllVotesResponse,
  IBribesResponse,
  IFeesDataObject,
  IMyAmmVotesBigMap,
  ITotalAmmVotesBigMap,
  IVeNFTData,
  IVeNFTListResponse,
  IVotePageData,
  IVotePageDataResponse,
  IVotePageRewardData,
  IVotePageRewardDataResponse,
  IVotesData,
  IVotesResponse,
} from "./types";
import { Bribes, VolumeV1Data, VolumeVeData } from "../pools/types";
import { fetchEpochData } from "../util/epoch";
import { IEpochData, IEpochResponse, ITokenPriceList } from "../util/types";
import { pools } from "../../redux/pools";
import { getDexAddress } from "../util/fetchConfig";
import { store } from "../../redux";
import { IVotes } from "../../operations/types";

export const estimateVotingPower = (value: BigNumber, end: number): number => {
  try {
    value = value.multipliedBy(PLY_DECIMAL_MULTIPLIER);
    const now = Math.floor(new Date().getTime() / 1000);
    //const ts = end; //Math.floor(end/WEEK)*WEEK;
    const dTs = end - now;

    if (dTs < 0 || dTs < WEEK || dTs > MAX_TIME) {
      throw new Error("Invalid Timestamp");
    }

    const bias = value.multipliedBy(dTs).dividedToIntegerBy(MAX_TIME);

    return bias.dividedBy(PLY_DECIMAL_MULTIPLIER).toNumber();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const votingPower = async (tokenId: number, ts2: number, time: number): Promise<number> => {
  // Try remove numbers

  try {
    let factor: number = WEEK;
    if (time === 0) {
      factor = 1;
    }
    // Must round down to nearest whole week
    ts2 = Math.floor(ts2 / factor) * factor;
    const ts = new BigNumber(ts2);

    const veStorage = await getStorage(Config.VOTE_ESCROW[connectedNetwork], voteEscrowStorageType);
    const tzktProvider = Config.TZKT_NODES[connectedNetwork];

    const allTokenCheckpointsCall = await getTzktBigMapData(
      veStorage.token_checkpoints,
      `key.nat_0="${tokenId}"&select=key,value`
    );
    const allTokenCheckpoints = allTokenCheckpointsCall.data;

    const map1 = new Map();
    for (var x in allTokenCheckpoints) {
      map1.set(allTokenCheckpoints[x].key.nat_1, allTokenCheckpoints[x].value);
    }

    if (ts.isLessThan(map1.get("1").ts)) {
      throw "Too early timestamp";
    }

    const secCall = await axios.get(
      `${tzktProvider}/v1/bigmaps/${veStorage.num_token_checkpoints}/keys/${tokenId}`
    );
    const sec = secCall.data.value;
    const lastCheckpoint = map1.get(sec);

    // Check calculations

    if (ts >= lastCheckpoint.ts) {
      const iBias = new BigNumber(lastCheckpoint.bias);
      const slope = new BigNumber(lastCheckpoint.slope);
      const fBias = iBias.minus(
        ts
          .minus(lastCheckpoint.ts)
          .multipliedBy(slope)
          .dividedBy(10 ** 18)
      );
      if (fBias < new BigNumber(0)) {
        return 0;
      } else {
        return fBias.toNumber();
      }
    } else {
      let high = Number(sec) - 2;
      let low = 0;
      let mid = 0;

      while (low < high && map1.get(mid + 1).ts != ts) {
        mid = Math.floor((low + high + 1) / 2);
        if (map1.get(mid + 1).ts < ts) {
          low = mid;
        } else {
          high = mid - 1;
        }
      }
      if (map1.get(`${mid + 1}`).ts === ts) {
        return map1.get(mid + 1).bias;
      } else {
        const ob = map1.get(`${low + 1}`);
        const bias = new BigNumber(ob.bias);
        const slope = new BigNumber(ob.slope);
        const d_ts = ts.minus(ob.ts);
        return bias.minus(d_ts.multipliedBy(slope).dividedBy(10 ** 18)).toNumber();
      }
    }
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const mainPageRewardData = async (
  epoch: number,
  tokenPrices: ITokenPriceList
): Promise<IVotePageRewardDataResponse> => {
  try {
    const state = store.getState();
    const TOKENS = state.config.tokens;
    const bribes = await axios.get(`${Config.VE_INDEXER[connectedNetwork]}bribes?epoch=${epoch}`);
    const bribesData: IBribesResponse[] = bribes.data;

    const res: IEpochResponse = await fetchEpochData(epoch);
    let feesData: VolumeVeData[];
    let isCurrentEpoch = false;

    if (res.success) {
      const epochData = res.epochData as IEpochData;
      isCurrentEpoch = epochData.isCurrent;

      const feesResponse = await axios.get(
        `${Config.ANALYTICS_INDEXER[connectedNetwork]}ve/pools?ts=${epochData.epochEndTimestamp - 1}`
      );
      feesData = feesResponse.data;
    } else {
      throw new Error(res.error as string);
    }

    const feesDataObject: IFeesDataObject = feesData.reduce(
      (finalFeesObject: IFeesDataObject, feeData) => (
        (finalFeesObject[feeData.pool] = feeData), finalFeesObject
      ),
      {}
    );

    const finalData: IVotePageRewardData = {};

    for (var x of bribesData) {
      let bribe: BigNumber = new BigNumber(0);
      let bribes: Bribes[] = [];
      const bribesObj: { [key: string] : Bribes} = {};

      if (!x.bribes || x.bribes.length === 0) {
        bribe = new BigNumber(0);
      } else {
        for (var y of x.bribes) {
          bribe = bribe.plus(
            new BigNumber(y.value)
              .dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
              .multipliedBy(isCurrentEpoch ? tokenPrices[y.name] || 0 : y.price)
          );
          if(bribesObj[y.name]) {
            const prevBribeObj = bribesObj[y.name];
            bribesObj[y.name] = {
              ...prevBribeObj,
              value: prevBribeObj.value.plus(
                new BigNumber(y.value).dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
              ),
              price: prevBribeObj.price.plus(
                new BigNumber(y.value)
                  .dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
                  .multipliedBy(isCurrentEpoch ? tokenPrices[y.name] || 0 : y.price)
              ),
            };
          } else {
            bribesObj[y.name] = {
              name: y.name,
              value: new BigNumber(y.value).dividedBy(
                new BigNumber(10).pow(TOKENS[y.name].decimals)
              ),
              price: new BigNumber(y.value)
                .dividedBy(new BigNumber(10).pow(TOKENS[y.name].decimals))
                .multipliedBy(isCurrentEpoch ? tokenPrices[y.name] || 0 : y.price),
            };
          }
        }
        bribes = Object.values(bribesObj);
      }
      const fee = feesDataObject[x.pool]
        ? new BigNumber(feesDataObject[x.pool].feesEpoch.value)
        : new BigNumber(0);
      const feeTokenA = feesDataObject[x.pool]
        ? new BigNumber(feesDataObject[x.pool].feesEpoch.token1)
        : new BigNumber(0);
      const feeTokenB = feesDataObject[x.pool]
        ? new BigNumber(feesDataObject[x.pool].feesEpoch.token2)
        : new BigNumber(0);

      if(bribes.length > 0) {
        bribes.sort((a,b) => b.price.minus(a.price).toNumber());
      }

      finalData[x.pool] = {
        fees: fee,
        bribes: bribe,
        bribesData: bribes,
        feesTokenA: feeTokenA,
        feesTokenB: feeTokenB,
      };
    }

    return {
      success: true,
      allData: finalData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: {
        false: {
          fees: new BigNumber(0),
          bribes: new BigNumber(0),
          bribesData: [],
          feesTokenA: new BigNumber(0),
          feesTokenB: new BigNumber(0),
        },
      },
      error: error.message,
    };
  }
};

export const votesPageDataWrapper = async (
  epoch: number,
  tokenId: number | undefined,
  tokenPrices: ITokenPriceList
): Promise<IVotePageDataResponse> => {
  try {
    const state = store.getState();
    const AMMS = state.config.AMMs;
 
    const [rewardData, votesData] = await Promise.all([
      mainPageRewardData(epoch, tokenPrices),
      getAllVotesData(epoch, tokenId),
    ]);

    /* const rewardData = await mainPageRewardData(epoch);

    const votesData = await getAllVotesData(epoch, tokenId); */

    // const poolsResponse = await axios.get(`${Config.VE_INDEXER}pools`);
    // const poolsData: VolumeV1Data[] = poolsResponse.data;
    if (!rewardData.success || Object.keys(rewardData.allData).length === 0) {
      throw new Error("No pools data found");
    }
    const allData: { [id: string]: IVotePageData } = {};

    for (let poolData of Object.keys(rewardData.allData)) {
      const AMM = AMMS[poolData];

      if(AMM && AMM.gauge) {
        allData[poolData] = {
          tokenA: AMM.token1.symbol,
          tokenB: AMM.token2.symbol,
          poolType: AMM.type,
  
          bribes: rewardData.allData[poolData]
            ? rewardData.allData[poolData].bribes
            : new BigNumber(0),
  
          bribesData : rewardData.allData[poolData]
          ? rewardData.allData[poolData].bribesData
          : [],
            
          fees: rewardData.allData[poolData] ? rewardData.allData[poolData].fees : new BigNumber(0),
  
          feesTokenA: rewardData.allData[poolData] ? rewardData.allData[poolData].feesTokenA : new BigNumber(0),
  
          feesTokenB: rewardData.allData[poolData] ? rewardData.allData[poolData].feesTokenB : new BigNumber(0),
  
          totalVotes:
            Object.keys(votesData.totalVotesData).length === 0
              ? new BigNumber(0)
              : votesData.totalVotesData[poolData]
              ? votesData.totalVotesData[poolData].votes
              : new BigNumber(0),
          totalVotesPercentage:
            Object.keys(votesData.totalVotesData).length === 0
              ? new BigNumber(0)
              : votesData.totalVotesData[poolData]
              ? votesData.totalVotesData[poolData].votePercentage
              : new BigNumber(0),
  
          myVotes:
            Object.keys(votesData.myVotesData).length === 0
              ? new BigNumber(0)
              : votesData.myVotesData[poolData]
              ? votesData.myVotesData[poolData].votes
              : new BigNumber(0),
          myVotesPercentage:
            Object.keys(votesData.myVotesData).length === 0
              ? new BigNumber(0)
              : votesData.myVotesData[poolData]
              ? votesData.myVotesData[poolData].votePercentage
              : new BigNumber(0), 
  
        };
      }
    }

    return {
      success: true,
      allData: allData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: {},
      error: error.message,
    };
  }
};


/**
 * Returns the list of veNFT tokens for a particular user address.
 * @param userTezosAddress - Tezos wallet address of the user
 */
 export const getVeNFTsList = async (
  userTezosAddress: string,
  epochNumber: number
): Promise<IVeNFTListResponse> => {
  try {
    if (!userTezosAddress || !epochNumber) {
      throw new Error("Invalid or empty arguments.");
    }
    const epochDataResponse = await fetchEpochData(epochNumber);
    if (!epochDataResponse.success) {
      throw new Error(epochDataResponse.error as string);
    }
    const epochData = epochDataResponse.epochData as IEpochData;
    const epochTimestamp = epochData.epochEndTimestamp - 10; // Timestamp within the epoch.

    const locksResponse = await axios.get(
      `${Config.VE_INDEXER[connectedNetwork]}locks?address=${userTezosAddress}&epoch=${epochNumber}&timestamp=${epochTimestamp}`
    );
    const locksData = locksResponse.data.result;

    const finalVeNFTData: IVeNFTData[] = [];
    const currentTimestamp: BigNumber = new BigNumber(Date.now())
      .dividedBy(1000)
      .decimalPlaces(0, 1);
    
    locksData.forEach((lock: any) => {
      const epochVotingPower = new BigNumber(lock.epochtVotingPower);
      const availableVotingPower = new BigNumber(lock.availableVotingPower);
      const consumedVotingPower = epochVotingPower.minus(availableVotingPower);
      const currentVotingPower = new BigNumber(lock.currentVotingPower).dividedBy(
        PLY_DECIMAL_MULTIPLIER
      );
      const nextEpochVotingPower = new BigNumber(lock.nextEpochVotingPower).dividedBy(
        PLY_DECIMAL_MULTIPLIER
      );
      const lockEndTimestamp = new BigNumber(lock.endTs);
      const finalLock: IVeNFTData = {
        tokenId: new BigNumber(lock.id),
        baseValue: new BigNumber(lock.baseValue).dividedBy(PLY_DECIMAL_MULTIPLIER),
        votingPower: availableVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        epochVotingPower: epochVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        consumedVotingPower: consumedVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        currentVotingPower,
        nextEpochVotingPower,
        locksState: ELocksState.DISABLED,
      };

      if (epochVotingPower.isFinite() && epochVotingPower.isGreaterThan(0)) {
        if (availableVotingPower.isGreaterThan(0)) {
          // finalLock.votingPower = availableVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER);
          finalLock.locksState = ELocksState.AVAILABLE;
        } else {
          finalLock.locksState = ELocksState.CONSUMED;
        }
      } else {
        if (currentTimestamp.isGreaterThan(lockEndTimestamp)) {
          finalLock.locksState = ELocksState.EXPIRED;
        } else {
          finalLock.locksState = ELocksState.DISABLED;
        }
      }
      finalVeNFTData.push(finalLock);
    });
    finalVeNFTData.sort(
      (a, b) => a.locksState - b.locksState || b.votingPower.minus(a.votingPower).toNumber()
    );

    return {
      success: true,
      veNFTData: finalVeNFTData,
    };
  } catch (error: any) {
    return {
      success: false,
      veNFTData: [],
      error: error.message,
    };
  }
};

/**
 * Returns the total AMM votes allocation chart data in selected epoch.
 * @param epochNumber - Numeric value of the epoch for which the data is to be fetched
 */
export const getTotalAmmVotes = async (epochNumber: number): Promise<IVotesResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const voterContractAddress: string = Config.VOTER[connectedNetwork];
    // const voterContractAddress: string = "KT1PexY3Jn8BCJmVpVLNN944YpVLM2LWTMMV";
    const voterStorageResponse = await getStorage(voterContractAddress, voterStorageType);
    const totalAmmVotesBigMapId: string = voterStorageResponse.total_amm_votes;
    const totalEpochVotesBigMapId: string = voterStorageResponse.total_epoch_votes;
    const totalEpochVotesResponse = await getTzktBigMapData(
      totalEpochVotesBigMapId,
      `key=${epochNumber}&select=key,value`
    );
    if (totalEpochVotesResponse.data.length === 0) {
      throw new Error("No votes in this epoch yet");
    }
    const totalEpochVotes: BigNumber = new BigNumber(totalEpochVotesResponse.data[0].value);

    const totalAmmVotesResponse = await getTzktBigMapData(
      totalAmmVotesBigMapId,
      `key.epoch=${epochNumber}&select=key,value&limit=1000`
    );
    const totalAmmVotesBigMapData: ITotalAmmVotesBigMap[] = totalAmmVotesResponse.data;
    if (totalAmmVotesBigMapData.length === 0) {
      throw new Error("No votes data for AMMS in this epoch yet");
    }
    // Sort the list to get top votes with highest first.
    totalAmmVotesBigMapData.sort(compareBigMapData);

    const totalAmmVotesData: IVotesData[] = totalAmmVotesBigMapData.map(
      (voteData): IVotesData => ({
        dexContractAddress: voteData.key.amm,
        votePercentage: new BigNumber(voteData.value).multipliedBy(100).dividedBy(totalEpochVotes),
        votes: new BigNumber(voteData.value).dividedBy(PLY_DECIMAL_MULTIPLIER),
        tokenOneSymbol: AMM[voteData.key.amm].token1.symbol,
        tokenTwoSymbol: AMM[voteData.key.amm].token2.symbol,
      })
    );
    // Return the existing list if the gauges count is 9 or less.
    if (totalAmmVotesData.length <= VOTES_CHART_LIMIT) {
      return {
        success: true,
        isOtherDataAvailable: false,
        allData: totalAmmVotesData,
        topAmmData: totalAmmVotesData,
        otherData: {},
      };
    }
    // Create a list of top 9 gauges and sum up the remaining others from the main list.
    const [topAmmData, summedData] = createOtherAmmsData(totalAmmVotesData);

    return {
      success: true,
      isOtherDataAvailable: true,
      allData: totalAmmVotesData,
      topAmmData,
      otherData: summedData,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      success: false,
      isOtherDataAvailable: false,
      allData: [],
      topAmmData: [],
      otherData: {},
      error: error.message,
    };
  }
};

/**
 * Returns the total AMM votes allocation chart data for a particular veNFT in selected epoch
 * @param epochNumber - Numeric value of the epoch for which the data is to be fetched
 * @param tokenId - veNFT token ID for which the data is to be fetched
 */
export const getMyAmmVotes = async (
  epochNumber: number,
  tokenId: number
): Promise<IVotesResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const voterContractAddress: string = Config.VOTER[connectedNetwork];
    // const voterContractAddress: string = "KT1PexY3Jn8BCJmVpVLNN944YpVLM2LWTMMV";
    const voterStorageResponse = await getStorage(voterContractAddress, voterStorageType);
    const tokenAmmVotesBigMapId: string = voterStorageResponse.token_amm_votes;
    const totalTokenVotesBigMapId: string = voterStorageResponse.total_token_votes;
    const totalTokenVotesResponse = await getTzktBigMapData(
      totalTokenVotesBigMapId,
      `key.epoch=${epochNumber}&key.token_id=${tokenId}&select=key,value`
    );
    if (totalTokenVotesResponse.data.length === 0) {
      throw new Error("No votes in this epoch yet");
    }
    const totalTokenVotes: BigNumber = new BigNumber(totalTokenVotesResponse.data[0].value);
    
    const tokenAmmVotesResponse = await getTzktBigMapData(
      tokenAmmVotesBigMapId,
      `key.epoch=${epochNumber}&key.token_id=${tokenId}&select=key,value&limit=1000`
    );
    const tokenAmmVotesBigMapData: IMyAmmVotesBigMap[] = tokenAmmVotesResponse.data;
    if (tokenAmmVotesBigMapData.length === 0) {
      throw new Error("No votes data for AMMS in this epoch yet");
    }
    // Sort the list to get top votes with highest first.
    tokenAmmVotesBigMapData.sort(compareBigMapData);
    
    const myAmmVotesData: IVotesData[] = tokenAmmVotesBigMapData.map(
      (voteData): IVotesData => ({
        dexContractAddress: voteData.key.amm,
        votePercentage: new BigNumber(voteData.value).multipliedBy(100).dividedBy(totalTokenVotes),
        votes: new BigNumber(voteData.value).dividedBy(PLY_DECIMAL_MULTIPLIER),
        tokenOneSymbol: AMM[voteData.key.amm].token1.symbol,
        tokenTwoSymbol: AMM[voteData.key.amm].token2.symbol,
      })
    );
    // Return the existing list if the gauges count is 9 or less.
    if (myAmmVotesData.length <= VOTES_CHART_LIMIT) {
      return {
        success: true,
        isOtherDataAvailable: false,
        allData: myAmmVotesData,
        topAmmData: myAmmVotesData,
        otherData: {},
      };
    }
    // Create a list of top 9 gauges and sum up the remaining others from the main list.
    const [topAmmData, summedData] = createOtherAmmsData(myAmmVotesData);

    return {
      success: true,
      isOtherDataAvailable: true,
      allData: myAmmVotesData,
      topAmmData,
      otherData: summedData,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      success: false,
      isOtherDataAvailable: false,
      allData: [],
      topAmmData: [],
      otherData: {},
      error: error.message,
    };
  }
};

/**
 * Returns votes data array with the remianing voting power dust added to the votes of last pool in the input votes array.
 * @param votingPower - Total available voting power for the selected veNFT
 * @param totalVotesPercentage - Percentage of votes selected by the user across all pools
 * @param votesData - The votes data array formed after voting for all pools is done
 */
export const addRemainingVotesDust = (
  votingPower: string | BigNumber,
  totalVotesPercentage: number,
  votesData: IVotes[]
): IVotes[] => {
  try {
    const finalVotesData = [...votesData];
    const availableVotingPower = new BigNumber(votingPower).multipliedBy(PLY_DECIMAL_MULTIPLIER);
    
    const currentVotesSum = finalVotesData.reduce((sum, vote) => {
      sum = sum.plus(vote.votes);
      return sum;
    }, new BigNumber(0));
    const remainingVotesDust = availableVotingPower.minus(currentVotesSum);
    
    if (remainingVotesDust.isGreaterThan(0) && new BigNumber(totalVotesPercentage).isEqualTo(100)) {
      finalVotesData[finalVotesData.length - 1].votes =
        finalVotesData[finalVotesData.length - 1].votes.plus(remainingVotesDust);
    }
    return finalVotesData;
  } catch (error: any) {
    return [...votesData];
  }
};


/**
 * Fetch all votes data in an epoch for a particular veNFT or for all.
 * @param epochNumber - Numeric value of the epoch for which the data is to be fetched
 * @param tokenId - veNFT token ID for which the data is to be fetched
 */
 export const getAllVotesData = async (
  epochNumber: number,
  tokenId: number | undefined
): Promise<IAllVotesResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    // const voterContractAddress: string = "KT1PexY3Jn8BCJmVpVLNN944YpVLM2LWTMMV";
    // const voterStorageResponse = await getStorage(voterContractAddress, voterStorageType);
    // const tokenAmmVotesBigMapId: string = voterStorageResponse.token_amm_votes;
    // const totalTokenVotesBigMapId: string = voterStorageResponse.total_token_votes;
    // const totalAmmVotesBigMapId: string = voterStorageResponse.total_amm_votes;
    // const totalEpochVotesBigMapId: string = voterStorageResponse.total_epoch_votes;
    const voterStorageResponse = await getTzktStorageData(voterContractAddress);
    const tokenAmmVotesBigMapId: string = Number(voterStorageResponse.data.token_amm_votes).toString();
    const totalTokenVotesBigMapId: string = Number(voterStorageResponse.data.total_token_votes).toString();
    const totalAmmVotesBigMapId: string = Number(voterStorageResponse.data.total_amm_votes).toString();
    const totalEpochVotesBigMapId: string = Number(voterStorageResponse.data.total_epoch_votes).toString();

    const totalVotesData: IAllVotesData = {};
    const myVotesData: IAllVotesData = {};

    const [totalEpochVotesResponse, totalAmmVotesResponse] = await Promise.all([
      getTzktBigMapData(totalEpochVotesBigMapId, `key=${epochNumber}&select=key,value`),
      getTzktBigMapData(totalAmmVotesBigMapId, `key.epoch=${epochNumber}&select=key,value&limit=1000`),
    ]);
    if (totalEpochVotesResponse.data.length === 0) {
      throw new Error("No votes in this epoch yet");
    }
    if (totalAmmVotesResponse.data.length === 0) {
      throw new Error("No votes data for AMMS in this epoch yet");
    }
    const totalEpochVotes: BigNumber = new BigNumber(totalEpochVotesResponse.data[0].value);
    const totalAmmVotesBigMapData: ITotalAmmVotesBigMap[] = totalAmmVotesResponse.data;

    totalAmmVotesBigMapData.forEach((voteData) => {
      totalVotesData[voteData.key.amm] = {
        dexContractAddress: voteData.key.amm,
        votePercentage: new BigNumber(voteData.value).multipliedBy(100).dividedBy(totalEpochVotes),
        votes: new BigNumber(voteData.value).dividedBy(PLY_DECIMAL_MULTIPLIER),
        tokenOneSymbol: AMM[voteData.key.amm].token1.symbol,
        tokenTwoSymbol: AMM[voteData.key.amm].token2.symbol,
      };
    });

    if (tokenId !== undefined) {
      const [totalTokenVotesResponse, tokenAmmVotesResponse] = await Promise.all([
        getTzktBigMapData(
          totalTokenVotesBigMapId,
          `key.epoch=${epochNumber}&key.token_id=${tokenId}&select=key,value`
        ),
        getTzktBigMapData(
          tokenAmmVotesBigMapId,
          `key.epoch=${epochNumber}&key.token_id=${tokenId}&select=key,value&limit=1000`
        ),
      ]);
      if (totalTokenVotesResponse.data.length > 0 && tokenAmmVotesResponse.data.length > 0) {
        const totalTokenVotes: BigNumber = new BigNumber(totalTokenVotesResponse.data[0].value);
        const tokenAmmVotesBigMapData: IMyAmmVotesBigMap[] = tokenAmmVotesResponse.data;
        tokenAmmVotesBigMapData.forEach((voteData) => {
          myVotesData[voteData.key.amm] = {
            dexContractAddress: voteData.key.amm,
            votePercentage: new BigNumber(voteData.value)
              .multipliedBy(100)
              .dividedBy(totalTokenVotes),
            votes: new BigNumber(voteData.value).dividedBy(PLY_DECIMAL_MULTIPLIER),
            tokenOneSymbol: AMM[voteData.key.amm].token1.symbol,
            tokenTwoSymbol: AMM[voteData.key.amm].token2.symbol,
          };
        });
      }
    }

    return {
      success: true,
      totalVotesData,
      myVotesData,
    };
  } catch (error: any) {
    return {
      success: false,
      totalVotesData: {},
      myVotesData: {},
      error: error.message,
    };
  }
};

/**
 * Function used as a callback for sorting the AMM votes allocation data in descending order of the votes count.
 */
const compareBigMapData = (
  valueOne: ITotalAmmVotesBigMap | IMyAmmVotesBigMap,
  valueTwo: ITotalAmmVotesBigMap | IMyAmmVotesBigMap
): number => {
  if (new BigNumber(valueOne.value).isGreaterThan(new BigNumber(valueTwo.value))) {
    return -1;
  } else if (new BigNumber(valueOne.value).isLessThan(new BigNumber(valueTwo.value))) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Function to slice the votes allocation data list into 2 lists of TOP 'N' and remaining,
 * and further sum up the remaining data into one object. Returns the TOP 'N' AMM array and 
 * the summed object of other AMM votes.
 * @param allAmmVotesData - Array of vote allocation data for all the AMMs
 */
const createOtherAmmsData = (allAmmVotesData: IVotesData[]): [IVotesData[], IVotesData] => {
  const topAmmData = allAmmVotesData.slice(0, VOTES_CHART_LIMIT);
  const dataToBeSummed = allAmmVotesData.slice(VOTES_CHART_LIMIT);
  const initialSummedObject: IVotesData = {
    dexContractAddress: undefined,
    votePercentage: new BigNumber(0),
    votes: new BigNumber(0),
    tokenOneSymbol: undefined,
    tokenTwoSymbol: undefined,
  };
  const summedData = dataToBeSummed.reduce(
    (summedObject: IVotesData, data: IVotesData): IVotesData => ({
      ...summedObject,
      votePercentage: summedObject.votePercentage.plus(data.votePercentage),
      votes: summedObject.votes.plus(data.votes),
    }),
    initialSummedObject
  );
  return [topAmmData, summedData];
};
