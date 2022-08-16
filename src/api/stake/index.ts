import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import { connectedNetwork, dappClient } from '../../common/walletconnect';
import Config from '../../config/config';
import { store } from '../../redux';
import { gaugeStorageType } from '../rewards/data';
import { getStakedBalance } from '../util/balance';
import { getDexAddress } from '../util/fetchConfig';
import { getStorage } from '../util/storageProvider';
import { IVePLYData, IVePLYListResponse } from './types';

/**
 * Returns the list of veNFTs with boost value for a user, for a particular gauge.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param userStakeInput - Amount of PNLP token the user wants to stake(input)
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getVePLYListForUser = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userStakeInput: string | undefined,
  userTezosAddress: string
): Promise<IVePLYListResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;

    // const locksResponse = await axios.get(
    //   `${Config.VE_INDEXER}locks?address=${userTezosAddress}`
    // );

    // if (locksResponse.data.result.length === 0) {
    //   return {
    //     success: true,
    //     vePLYData: [],
    //   };
    // }

    // const locksData = locksResponse.data.result.filter(
    //   (lock: any) => !lock.attached
    // ); // Filter the tokens for not attached ones.
    const locksResponse = await axios.get(
      'https://62d80fa990883139358a3999.mockapi.io/api/v1/locks'
    );

    if (locksResponse.data[0].result.length === 0) {
      return {
        success: true,
        vePLYData: [],
      };
    }

    const locksData = locksResponse.data[0].result.filter(
      (lock: any) => !lock.attached
    ); // Filter the tokens for not attached ones.

    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('AMM does not exist for the selected pair.');
    }
    const pnlpTokenDecimals = AMM[dexContractAddress].lpToken.decimals;
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gaugeAddress;
    if (gaugeAddress === undefined) {
      throw new Error('Gauge does not exist for the selected pair.');
    }
    const gaugeStorage = await getStorage(gaugeAddress, gaugeStorageType);

    const totalSupply = new BigNumber(gaugeStorage.total_supply).dividedBy(
      new BigNumber(10).pow(pnlpTokenDecimals)
    );
    const userStakedBalance = new BigNumber(
      (
        await getStakedBalance(tokenOneSymbol, tokenTwoSymbol, userTezosAddress)
      ).balance
    ).dividedBy(new BigNumber(10).pow(pnlpTokenDecimals));
    const finalUserStakedBalance = new BigNumber(userStakeInput || 0).plus(
      userStakedBalance
    );
    const finalTotalSupply = new BigNumber(userStakeInput || 0).plus(
      totalSupply
    );

    const totalVotingPower = state.pools.totalVotingPower; // Fetch the total voting power stored in redux store

    const finalVePLYData: IVePLYData[] = [];

    locksData.forEach((lock: any) => {
      const votingPower = new BigNumber(lock.voting_power).dividedBy(
        new BigNumber(10).pow(18)
      );
      const updatedLockData = {
        tokenId: lock.id,
        boostValue: getBoostValue(
          finalUserStakedBalance,
          finalTotalSupply,
          votingPower,
          totalVotingPower
        ),
        votingPower: votingPower.toString(),
      };
      finalVePLYData.push(updatedLockData);
    });

    return {
      success: true,
      vePLYData: finalVePLYData,
    };
  } catch (error: any) {
    return {
      success: false,
      vePLYData: [],
      error: error.message,
    };
  }
};

/**
 * Fetch the total voting power for the current timestamp.
 */
export const fetchTotalVotingPower = async (): Promise<BigNumber> => {
  try {
    const voteEscrowAddress = Config.VOTE_ESCROW[connectedNetwork];
    const { CheckIfWalletConnected } = dappClient();
    const walletResponse = await CheckIfWalletConnected();
    if (!walletResponse.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = await dappClient().tezos();
    const voteEscrowInstance = await Tezos.contract.at(voteEscrowAddress);
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    const totalVotingPower = await voteEscrowInstance.contractViews
      .get_total_voting_power({ time: 1, ts: currentTimestamp })
      .executeView({ viewCaller: voteEscrowAddress });
    return totalVotingPower.dividedBy(new BigNumber(10).pow(18));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Calulate the boost value for the selected veNFT.
 * @param userStakedBalance - The final balance calculated by adding the user input to staked balance in storage
 * @param totalSupply - The final total supply calculated by adding the user input to the total supply in storage
 * @param tokenVotingPower - Voting power of selected veNFT received from indexer api
 * @param totalVotingPower - Total voting power for the current timestamp
 */
const getBoostValue = (
  userStakedBalance: BigNumber,
  totalSupply: BigNumber,
  tokenVotingPower: BigNumber,
  totalVotingPower: BigNumber
): string => {
  try {
    const markUp = totalSupply
      .multipliedBy(tokenVotingPower)
      .dividedBy(totalVotingPower)
      .multipliedBy(60)
      .dividedBy(100);
    const baseBalance = userStakedBalance.multipliedBy(40).dividedBy(100);
    const derivedBalance = BigNumber.minimum(
      baseBalance.plus(markUp),
      userStakedBalance
    );
    if (baseBalance.isEqualTo(0)) {
      return '0.0';
    }
    const boostValue = derivedBalance.dividedBy(baseBalance).toFixed(1);
    return boostValue;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
