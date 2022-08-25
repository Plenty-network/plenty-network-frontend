import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { getStorage, getTzktBigMapData } from "../util/storageProvider";
import { voteEscrowStorageType } from "./data";
import { MAX_TIME, PLY_DECIMAL_MULTIPLIER, WEEK } from "../../constants/global";
import { IBribesResponse } from "./types";
import { VolumeVeData } from "../pools/types";

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

export const mainPageRewardData = async (epoch: number) => {

  const bribes = await axios.get(`https://veplyindexer.plentydefi.com/v1/bribes?epoch=174`);
  const bribesData : IBribesResponse[] = bribes.data;

  const finalData : { [id: string]: {bribes : BigNumber , fees : BigNumber} }= {};

  for(var x of bribesData){
  let bribe: BigNumber = new BigNumber(0);
  if (!x.bribes || x.bribes.length === 0) {
    bribe = new BigNumber(0);
  } else {
    for (var y of x.bribes) {
      bribe = bribe.plus(
        new BigNumber(
          new BigNumber(y.value).multipliedBy(y.price)
        )
      );
    }
  }
  finalData[x.pool] =  {bribes : bribe , fees : new BigNumber(0)};
}

  // call check if current 
  // const res = checkIfCurrent(epoch);


  const feesResponse = await axios.get(`https://networkanalyticsindexer.plentydefi.com/ve/pools?ts=1660030117`);
  const feesData : VolumeVeData[] = feesResponse.data;

  for(var i of feesData){
    finalData[i.pool].fees = new BigNumber(i.feesEpoch.value);
  }

  console.log(finalData);

};

export const votesPageDataWrapper = async (epoch: number) => {
  // Get pools from ve indexer
  // For each pool calculate rewards  , total votes , my votes at specific epoch
  // rewards : same file
  // total votes: kiran's file
  //  my votes : kirans's file
  // Combine data and give in object form ammAddy : {data}
};
