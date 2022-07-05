import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';
import axios from 'axios';
import Config from '../config/config';
import { TTokenType , IAMM , ITokenInterface } from '../config/types'


export const fetchConfig = async () => {
    
    const token : ITokenInterface[] = await axios.get(Config.TOKEN_CONFIG);
    const amms : IAMM[] = await axios.get(Config.AMM_CONFIG);

    console.log(token);
    console.log(amms);

    // Add to Redux / local storage
}

/**
 * Returns packed key (expr...) which will help to fetch user specific data from bigmap directly using rpc.
 * @param tokenId - Id of map from where you want to fetch data
 * @param address - address of the user for whom you want to fetch the data
 * @param type - FA1.2 OR FA2
 */
 export const getPackedKey = (tokenId : string, address : string, type : TTokenType) => {
    const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`;
    let packedKey = null;
    if (type === 'FA2') {
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
//  export const getUserBalanceByRpc = async (identifier : string, address : string) => {
//     try {
//       const token = Config.AMM[Config.NETWORK][identifier];
//       const mapId = token.mapId;
//       const type = token.READ_TYPE;
//       const decimal = token.TOKEN_DECIMAL;
//       const tokenId = token.TOKEN_ID;
//       // const rpcNode = CONFIG.RPC_NODES[CONFIG.NETWORK];
//       const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
//       const packedKey = getPackedKey(tokenId, address, type);
//       const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
//       const response = await axios.get(url);
  
//       const balance = (() => {
//         // IIFE
//         let _balance;
//         if (type1MapIds.includes(mapId)) {
//           _balance = response.data.args[0].args[1].int;
//         } else if (type2MapIds.includes(mapId)) {
//           _balance = response.data.args[1].int;
//         } else if (type3MapIds.includes(mapId)) {
//           _balance = response.data.args[0].int;
//         } else if (type4MapIds.includes(mapId)) {
//           _balance = response.data.int;
//         } else if (type5MapIds.includes(mapId)) {
//           _balance = response.data.args[0][0].args[1].int;
//         } else {
//           _balance = response.data.args[1].int;
//         }
//         _balance = new BigNumber(_balance);
//         _balance = _balance.dividedBy(10 ** decimal);
//         _balance = _balance.toFixed(decimal);
//         return Number(_balance);
//       })();
//       return {
//         success: true,
//         balance,
//         identifier,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         balance: 0,
//         identifier,
//         error: error,
//       };
//     }
//   };