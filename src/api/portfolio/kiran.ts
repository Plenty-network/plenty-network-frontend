import { BigNumber } from 'bignumber.js';
import axios from "axios";
import Config from '../../config/config';
import { PLY_DECIMAL_MULTIPLIER } from '../../constants/global';
import { IVotesStatsDataResponse } from './types';

/**
 * Calculates the total epoch voting power and total PLY tokens locked for all locks held by a user.
 * @param userTezosAddress - Tezos wallet address of the user 
 */
export const getVotesStatsData = async (
  userTezosAddress: string
): Promise<IVotesStatsDataResponse> => {
  try {
    // let totalEpochVotingPower = new BigNumber(0),
    //   totalPlyLocked = new BigNumber(0);
    if (!userTezosAddress) {
      throw new Error("Invalid or empty arguments.");
    }
    const locksResponse = await axios.get(`${Config.VE_INDEXER}locks?address=${userTezosAddress}`);
    const locksData = locksResponse.data.result;
    let [totalEpochVotingPower, totalPlyLocked]: [BigNumber, BigNumber] = locksData.reduce(
      ([epochVotingPowerSum, plyLockedSum]: [BigNumber, BigNumber], lock: any) =>
        ([epochVotingPowerSum, plyLockedSum] = [
          epochVotingPowerSum.plus(new BigNumber(lock.epochtVotingPower)),
          plyLockedSum.plus(new BigNumber(lock.baseValue)),
        ]),
      [new BigNumber(0), new BigNumber(0)]
    );
    [totalEpochVotingPower, totalPlyLocked] = [
      totalEpochVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
      totalPlyLocked.dividedBy(PLY_DECIMAL_MULTIPLIER),
    ];
    return {
      success: true,
      totalEpochVotingPower,
      totalPlyLocked,
    };
  } catch (error: any) {
    return {
      success: false,
      totalEpochVotingPower: new BigNumber(0),
      totalPlyLocked: new BigNumber(0),
      error: error.message,
    };
  }
};