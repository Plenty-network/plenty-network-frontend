//TODO: Merge this file's functions to index.ts under votes when all developers have finished with their respective api development.
import { BigNumber } from "bignumber.js";
import axios from "axios";
import { connectedNetwork } from "../../common/walletconnect";
import Config from "../../config/config";
import { getStorage, getTzktBigMapData } from "../util/storageProvider";
import { voterStorageType } from "./data";
import { IEpochDataResponse, IEpochListObject, ITotalAmmVotesBigMap, IVeNFTData, IVeNFTListResponse } from "./types";
import { EPOCH_DURATION_MAINNET, EPOCH_DURATION_TESTNET } from "../../constants/global";

/**
 * Returns the list of epoch data including the current one.
 * @param previousEpochsRequired - Count of previous epoch's data required(optional). Default is 5.
 */
export const getListOfEpochs = async (
  previousEpochsRequired: number = 5
): Promise<IEpochDataResponse> => {
  try {
    const listOfEpochs: IEpochListObject[] = [];
    const epochDuration: number =
      connectedNetwork === "testnet"
        ? EPOCH_DURATION_TESTNET
        : EPOCH_DURATION_MAINNET;
    const voterContractAddress: string = Config.VOTER[connectedNetwork];
    const voterStorageResponse = await getStorage(
      voterContractAddress,
      voterStorageType
    );
    const currentEpochNumber: number = voterStorageResponse.epoch.toNumber(); // Voter storage response for epoch is BigNumber
    const currentTimestamp = new Date().getTime();
    const currentEpochStart =
      Math.floor(currentTimestamp / epochDuration) * epochDuration;
    const currentEpochEnd = currentEpochStart + epochDuration;

    listOfEpochs.push({
      epochNumber: currentEpochNumber,
      isCurrent: true,
      startTimestamp: currentEpochStart,
      endTimestamp: currentEpochEnd,
    });

    let previousEpochEnd = currentEpochStart;
    for (let i: number = 1; i <= previousEpochsRequired; i++) {
      const epochEnd = previousEpochEnd;
      const epochStart = epochEnd - epochDuration;
      listOfEpochs.push({
        epochNumber: currentEpochNumber - i,
        isCurrent: false,
        startTimestamp: epochStart,
        endTimestamp: epochEnd,
      });
      previousEpochEnd = epochStart;
    }

    return {
      success: true,
      epochData: listOfEpochs,
    };
  } catch (error: any) {
    return {
      success: false,
      epochData: [],
      error: error.message,
    };
  }
};

/**
 * Returns the list of veNFT tokens for a particular user address.
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getVeNFTsList = async (
  userTezosAddress: string
): Promise<IVeNFTListResponse> => {
  try {
    const locksResponse = await axios.get(
      `${Config.VE_INDEXER}locks?address=${userTezosAddress}`
    );
    const locksData = locksResponse.data.result;

    const finalVeNFTData = locksData.map((lock: any): IVeNFTData => {
      return {
        tokenId: new BigNumber(lock.id),
        baseValue: new BigNumber(lock.base_value).dividedBy(
          new BigNumber(10).pow(18)
        ),
        votingPower: new BigNumber(lock.voting_power).dividedBy(
          new BigNumber(10).pow(18)
        ),
      };
    });

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


/* export const getTotalAmmVotes = async (epochNumber: number) => {
  try {
    const voterContractAddress: string = Config.VOTER[connectedNetwork];
    const voterStorageResponse = await getStorage(
      voterContractAddress,
      voterStorageType
    );
    const totalAmmVotesBigMapId: string = voterStorageResponse.total_amm_votes;
    const totalAmmVotesResponse = await getTzktBigMapData(totalAmmVotesBigMapId, `key.epoch=${epochNumber}&select=key,value`);
    const totalAmmVotesData: ITotalAmmVotesBigMap[] = totalAmmVotesResponse.data;
    console.log(totalAmmVotesData.sort(compareBigMapData));
  } catch (error: any) {
    console.log(error.message);
  }
};


const compareBigMapData = (valueOne: ITotalAmmVotesBigMap, valueTwo: ITotalAmmVotesBigMap): number => {
  if(new BigNumber(valueOne.value).isGreaterThan(new BigNumber(valueTwo.value))) {
    return -1;
  } else if(new BigNumber(valueOne.value).isLessThan(new BigNumber(valueTwo.value))) {
    return 1;
  } else {
    return 0;
  }
}; */