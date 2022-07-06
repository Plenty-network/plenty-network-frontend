import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';
import axios from 'axios';
import Config from '../config/config';
import { RPC_NODE , TOKEN_CONFIG , AMM_CONFIG, type1MapIds , type2MapIds,type3MapIds,type4MapIds,type5MapIds} from '../constants/global';
import BigNumber from 'bignumber.js';

let TOKEN: { [x: string]: any; };
let AMM : { [x: string]: any; };


export const fetchConfig = async () => {
    
    const token_response  = await axios.get(Config.TOKEN_CONFIG);
    const amms_response = await axios.get(Config.AMM_CONFIG);

    const tokens =token_response.data; 
    const amms = amms_response.data;


    // localStorage.setItem(TOKEN_CONFIG, JSON.stringify(tokens));
    // localStorage.setItem(AMM_CONFIG ,JSON.stringify(amms));

    // for dev purpose only
    TOKEN = tokens;
    AMM = amms;

    // console.log(TOKEN['XTZ']);
    // console.log(localStorage.getItem(TOKEN_CONFIG));

    // Add to Redux / local storage
}

fetchConfig();

enum TokenType{
    FA12 = 'FA1.2',
    FA2 = 'FA2',
    XTZ = 'XTZ'
}


/**
 * Returns packed key (expr...) which will help to fetch user specific data from bigmap directly using rpc.
 * @param tokenId - Id of map from where you want to fetch data
 * @param address - address of the user for whom you want to fetch the data
 * @param type - FA1.2 OR FA2
 */
 export const getPackedKey = (tokenId : string, address : string, type : TokenType) : string => {
    const accountHex : string = `0x${TezosMessageUtils.writeAddress(address)}`;
    let packedKey = null;
    if (type === TokenType.FA2) {
      packedKey = TezosMessageUtils.encodeBigMapKey(
        // eslint-disable-next-line no-undef
        Buffer.from(
          TezosMessageUtils.writePackedData(
            `(Pair ${accountHex} ${tokenId})`,
            '',
            TezosParameterFormat.Michelson,
          ),
          'hex',
        ),
      );
    } else {
      packedKey = TezosMessageUtils.encodeBigMapKey(
        // eslint-disable-next-line no-undef
        Buffer.from(
          TezosMessageUtils.writePackedData(`${accountHex}`, '', TezosParameterFormat.Michelson),
          'hex',
        ),
      );
    }
    return packedKey;
  };


/**
 * Gets balance of user of a particular token using RPC
 * @param identifier - Name of token, case-sensitive to CONFIG
 * @param address - tz1 address of user
 */
 export const getUserBalanceByRpc = async (identifier : string, address : string) => {
    try {
    // Update to use local storage config & local storage RPC_Node
      const token = TOKEN[`${identifier}`];

      const mapId = token.mapId;
      const type = token.type;
      const decimal = token.decimals;
      const tokenId = token.tokenId ?? '0';

      const connectedNetwork = Config.NETWORK;
    //   const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
      const rpcNode = Config.RPC_NODES[connectedNetwork];
      const packedKey = getPackedKey(tokenId, address, type as TokenType);
      const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);
        
      const balance = (() => {
        // IIFE
        let _balance;
        if (type1MapIds.includes(mapId)) {
          _balance = response.data.args[0].args[1].int;
        } else if (type2MapIds.includes(mapId)) {
          _balance = response.data.args[1].int;
        } else if (type3MapIds.includes(mapId)) {
          _balance = response.data.args[0].int;
        } else if (type4MapIds.includes(mapId)) {
          _balance = response.data.int;
        } else if (type5MapIds.includes(mapId)) {
          _balance = response.data.args[0][0].args[1].int;
        } else {
          _balance = response.data.args[1].int;
        }

        _balance = new BigNumber(_balance);
        _balance = _balance.dividedBy(10 ** decimal);
        return _balance;
      })();
      return {
        success: true,
        balance,
        identifier,
      };
    } catch (error) {
      return {
        success: false,
        balance: new BigNumber(0),
        identifier,
        error: error,
      };
    }
  };

  export const tester = async () => {
    
    await fetchConfig();
    await getUserBalanceByRpc('ctez' , 'tz1NaGu7EisUCyfJpB16ktNxgSqpuMo8aSEk');
  }

  tester();

  