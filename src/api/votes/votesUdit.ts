import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { getStorage, getTzktBigMapData } from "../util/storageProvider";
import { voteEscrowStorageType } from "./data";
import { MAX_TIME, PLY_DECIMAL_MULTIPLIER, WEEK } from "../../constants/global";
import {
  IBribesResponse,
  IVotePageData,
  IVotePageDataResponse,
  IVotePageRewardData,
  IVotePageRewardDataResponse,
} from "./types";
import { VolumeV1Data, VolumeVeData } from "../pools/types";
import { fetchEpochData } from "../util/epoch";
import { IEpochData, IEpochResponse } from "../util/types";
import { getAllVotesData } from "./votesKiran";
import { pools } from "../../redux/pools";
import { IAmmContracts } from "../../config/types";

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

const mainPageRewardData = async (epoch: number): Promise<IVotePageRewardDataResponse> => {
  try {
    const bribes = await axios.get(`${Config.VE_INDEXER}bribes?epoch=${epoch}`);
    const bribesData: IBribesResponse[] = bribes.data;

    // call check if current
    const res: IEpochResponse = await fetchEpochData(epoch);
    let feesData;

    if (res.success) {
      const epochData = res.epochData as IEpochData;

      const feesResponse = await axios.get(
        `${Config.PLY_INDEXER}ve/pools?ts=${epochData.epochEndTimestamp - 1}`
      );
      feesData = feesResponse.data;
    } else {
      throw new Error(res.error as string);
    }

    const finalData: IVotePageRewardData = {};

    for (var x of bribesData) {
      let bribe: BigNumber = new BigNumber(0);
      if (!x.bribes || x.bribes.length === 0) {
        bribe = new BigNumber(0);
      } else {
        for (var y of x.bribes) {
          bribe = bribe.plus(new BigNumber(new BigNumber(y.value).multipliedBy(y.price)));
        }
      }
      let fee = new BigNumber(0);
      for (var i of feesData) {
        if (i.pool === x.pool) fee = new BigNumber(i.feesEpoch.value);
      }

      finalData[x.pool] = { fees: fee, bribes: bribe };
    }

    console.log(finalData);

    return {
      success: true,
      allData: finalData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allData: { false: { fees: new BigNumber(0), bribes: new BigNumber(0) } },
      error: error.message,
    };
  }
};

export const votesPageDataWrapper = async (
  epoch: number,
  tokenId: number | undefined
): Promise<IVotePageDataResponse> => {
  try {
    // TODO : UnComment when launching
    // const state = store.getState();
    // const AMMS = state.config.AMMs;

    // TODO: Remove this get call
    const AMMResponse = await axios.get("https://config.plentydefi.com/v1/config/amm");
    const AMMS: IAmmContracts = AMMResponse.data;

    const rewardData = await mainPageRewardData(epoch);
    
    const votesData = await getAllVotesData(epoch, tokenId);
    
    const poolsResponse = await axios.get(`${Config.VE_INDEXER}pools`);
    const poolsData: VolumeV1Data[] = poolsResponse.data;
    if (poolsData.length === 0) {
      throw new Error("No pools data found");
    }
    const allData: { [id: string]: IVotePageData } = {};

    for (var poolData of poolsData) {
      const AMM = AMMS[poolData.pool];

      allData[poolData.pool] = {
        tokenA: AMM.token1.symbol,
        tokenB: AMM.token2.symbol,
        poolType: AMM.type,

        bribes:
          Object.keys(rewardData.allData).length === 0
            ? new BigNumber(0)
            : rewardData.allData[poolData.pool]
            ? rewardData.allData[poolData.pool].bribes
            : new BigNumber(0),
        fees:
          Object.keys(rewardData.allData).length === 0
            ? new BigNumber(0)
            : rewardData.allData[poolData.pool]
            ? rewardData.allData[poolData.pool].fees
            : new BigNumber(0),

        totalVotes:
          Object.keys(votesData.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesData.totalVotesData[poolData.pool]
            ? votesData.totalVotesData[poolData.pool].votes
            : new BigNumber(0),
        totalVotesPercentage:
          Object.keys(votesData.totalVotesData).length === 0
            ? new BigNumber(0)
            : votesData.totalVotesData[poolData.pool]
            ? votesData.totalVotesData[poolData.pool].votePercentage
            : new BigNumber(0),

        myVotes:
          Object.keys(votesData.myVotesData).length === 0
            ? new BigNumber(0)
            : votesData.myVotesData[poolData.pool]
            ? votesData.myVotesData[poolData.pool].votes
            : new BigNumber(0),
        myVotesPercentage:
          Object.keys(votesData.myVotesData).length === 0
            ? new BigNumber(0)
            : votesData.myVotesData[poolData.pool]
            ? votesData.myVotesData[poolData.pool].votePercentage
            : new BigNumber(0),
      };
    }

    console.log(allData);

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
