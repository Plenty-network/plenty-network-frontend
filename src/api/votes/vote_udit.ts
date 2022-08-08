import { BigNumber } from 'bignumber.js'
import axios from 'axios'
import Config from '../../config/config';
import { connectedNetwork } from '../../common/walletconnect';
import { getStorage } from '../util/storageProvider';

export const votingPower = async (tokenId: number, ts2: number, time: number) : Promise<number> => {

    // Try remove numbers

    try {
        let factor: number = 7 * 86400;
        if (time === 0) { factor = 1; }
        // Must round down to nearest whole week
        ts2 = Math.floor(ts2 / factor) * factor;
        const ts = new BigNumber(ts2);

        // USE getStorage to make code variable 
        // const veStorage = getStorage(Config.VOTE_ESCROW[connectedNetwork] , );

        const tzktProvider = Config.TZKT_NODES[connectedNetwork];

        // Cosnider using direct rpc calls
        const all_token_checkpoints_call = await axios.get(`${tzktProvider}/v1/bigmaps/160226/keys?key.nat_0="${tokenId}"&select=key,value`);
        const all_token_checkpoints =  all_token_checkpoints_call.data;

        const map1 = new Map();
        for (var x in all_token_checkpoints) {
            map1.set(all_token_checkpoints[x].key.nat_1, all_token_checkpoints[x].value);
        }

        if (ts < map1.get('1').ts) {
            throw "Too early timestamp"
        }

        const sec = await axios.get(`${tzktProvider}/v1/bigmaps/160223/keys/${tokenId}`);
        const last_checkpoint = map1.get(sec);

        // Check calculations

        if (ts >= last_checkpoint.ts) {
            const i_bias = new BigNumber(last_checkpoint.bias);
            const slope = new BigNumber(last_checkpoint.slope);
            const f_bias = i_bias.minus((ts.minus(last_checkpoint.ts)).multipliedBy(slope).dividedBy(10 ** 18));
            if (f_bias < new BigNumber(0)) { return 0; }
            else { return f_bias.toNumber(); }
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