//TODO: Merge this file's functions to index.ts under votes when all developers have finished with their respective api development.
import { connectedNetwork } from "../../common/walletconnect";
import Config from "../../config/config";
import { getStorage } from "../util/storageProvider";
import { voterStorageType } from "./data";
import { IEpochDataResponse, IEpochListObject } from "./types";
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