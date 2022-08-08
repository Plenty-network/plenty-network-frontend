import { BigNumber } from 'bignumber.js'
import axios from 'axios'
import Config from '../../config/config';
import { connectedNetwork } from '../../common/walletconnect';
import { getStorage } from '../util/storageProvider';
import { voteEscrowStorageType } from './data';

export const votingPower = async (tokenId: number, ts2: number, time: number) : Promise<number> => {

    // Try remove numbers

    try {
        let factor: number = 7 * 86400;
        if (time === 0) { factor = 1; }
        // Must round down to nearest whole week
        ts2 = Math.floor(ts2 / factor) * factor;
        const ts = new BigNumber(ts2);

        // Store map ids so that storage is not called everytime voting power is called 
        const veStorage = await getStorage(Config.VOTE_ESCROW[connectedNetwork] , voteEscrowStorageType);
        const tzktProvider = Config.TZKT_NODES[connectedNetwork];

        // Cosnider using direct rpc calls
        const allTokenCheckpointsCall = await axios.get(`${tzktProvider}/v1/bigmaps/${veStorage.token_checkpoints}/keys?key.nat_0="${tokenId}"&select=key,value`);
        const allTokenCheckpoints =  allTokenCheckpointsCall.data;

        const map1 = new Map();
        for (var x in allTokenCheckpoints) {
            map1.set(allTokenCheckpoints[x].key.nat_1, allTokenCheckpoints[x].value);
        }

        if (ts < map1.get('1').ts) {
            throw "Too early timestamp"
        }

        const sec = await axios.get(`${tzktProvider}/v1/bigmaps/${veStorage.num_token_checkpoints}/keys/${tokenId}`);
        const lastCheckpoint = map1.get(sec);

        // Check calculations

        if (ts >= lastCheckpoint.ts) {
            const iBias = new BigNumber(lastCheckpoint.bias);
            const slope = new BigNumber(lastCheckpoint.slope);
            const fBias = iBias.minus((ts.minus(lastCheckpoint.ts)).multipliedBy(slope).dividedBy(10 ** 18));
            if (fBias < new BigNumber(0)) { return 0; }
            else { return fBias.toNumber(); }
        }
        else {
            let high = Number(sec) - 2;
            let low = 0;
            let mid = 0;

            while ((low < high) && (map1.get(mid + 1).ts != ts)) {
                mid = Math.floor((low + high + 1) / 2);
                if (map1.get(mid + 1).ts < ts) { low = mid; }
                else {
                    high = mid - 1;
                }
            }
            if (map1.get(`${mid + 1}`).ts === ts) {
                return map1.get(mid + 1).bias;
            }
            else {
                const ob = map1.get(`${low + 1}`);
                const bias = new BigNumber(ob.bias);
                const slope = new BigNumber(ob.slope);
                const d_ts = ts.minus(ob.ts);
                return bias.minus((d_ts.multipliedBy(slope)).dividedBy(10 ** 18)).toNumber();
            }

        }
    }
    catch (e) {
        console.log(e);
        return 0;
    }
};