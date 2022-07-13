import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';
import axios from 'axios';
import Config from '../../config/config';
import {
  type1MapIds,
  type2MapIds,
  type3MapIds,
  type4MapIds,
  type5MapIds,
} from '../../constants/global';
import BigNumber from 'bignumber.js';
import { TokenType } from '../../config/types';
import { packDataBytes, unpackDataBytes } from '@taquito/michel-codec';
import { CheckIfWalletConnected , wallet , rpcNode , tezos } from '../../common/wallet';



/**
 * Returns packed key (expr...) which will help to fetch user specific data from bigmap directly using rpc.
 * @param tokenId - Id of map from where you want to fetch data
 * @param address - address of the user for whom you want to fetch the data
 * @param type - FA1.2 OR FA2
 */
export const getPackedKey = (
  tokenId: string,
  address: string,
  type: TokenType
): string => {
  const accountHex: string = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if (type === TokenType.FA2) {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `(Pair ${accountHex} ${tokenId})`,
          '',
          TezosParameterFormat.Michelson
        ),
        'hex'
      )
    );
  } else {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `${accountHex}`,
          '',
          TezosParameterFormat.Michelson
        ),
        'hex'
      )
    );
  }
  return packedKey;
};

/**
 * Gets balance of user of a particular token using RPC
 * @param identifier - Name of token, case-sensitive to CONFIG
 * @param address - tz1 address of user
 */
export const getUserBalanceByRpc = async (
  identifier: string,
  address: string,
  TOKEN: {
    [x: string]: any;
  }
): Promise<{
  success: boolean;
  balance: BigNumber;
  identifier: string;
  error?: any;
}> => {
  try {
    if (identifier === 'tzBTC') {
      try {
        const tokenContractAddress: string =
          'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';
        const contract = await tezos.contract.at(tokenContractAddress);
        const storage: any = await contract.storage();
        let userBalance = 0;
        const packedAddress = packDataBytes(
          { string: address },
          { prim: 'address' }
        );
        const ledgerKey: any = {
          prim: 'Pair',
          args: [
            { string: 'ledger' },
            { bytes: packedAddress.bytes.slice(12) },
          ],
        };
        const ledgerKeyBytes = packDataBytes(ledgerKey);
        const ledgerInstance = storage[Object.keys(storage)[0]];
        const bigmapVal = await ledgerInstance.get(ledgerKeyBytes.bytes);
        if (bigmapVal) {
          const bigmapValData: any = unpackDataBytes({ bytes: bigmapVal });
          if (
            Object.prototype.hasOwnProperty.call(bigmapValData, 'prim') &&
            bigmapValData.prim === 'Pair'
          ) {
            userBalance = +bigmapValData.args[0].int / Math.pow(10, 8);
          }
        }
        const userBal = new BigNumber(userBalance);
        return {
          success: true,
          balance: userBal,
          identifier: 'tzBTC',
        };
      } catch (e) {
        return {
          success: false,
          balance: new BigNumber(0),
          identifier: 'tzBTC',
        };
      }
    } else if (identifier === 'tez') {
      const WALLET_RESP = await CheckIfWalletConnected(wallet);
      if (!WALLET_RESP.success) {
        throw new Error('Wallet connection failed');
      }
      const _balance = await tezos.tz.getBalance(address);
      const balance = _balance.dividedBy(Math.pow(10, 6));
      return {
        success: true,
        balance,
        identifier,
      };
    } else {
      const token = TOKEN[`${identifier}`];
      const mapId = token.mapId;
      const type = token.type;
      const decimal: number = token.decimals;
      const tokenId: string = token.tokenId ?? '0';
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
        _balance = _balance.dividedBy(Math.pow(10, decimal));
        return _balance;
      })();
      return {
        success: true,
        balance,
        identifier,
      };
    }
  } catch (error) {
    return {
      success: false,
      balance: new BigNumber(0),
      identifier,
      error: error,
    };
  }
};
