import { connectedNetwork, voterAddress as voterContractAddress } from "../../common/walletconnect";
import {
    EPOCH_DURATION_MAINNET,
    EPOCH_DURATION_TESTNET,
  } from "../../constants/global";
import { voterStorageType } from "../votes/data";
import { getStorage, getTzktBigMapData } from "./storageProvider";
  import {
    IEpochDataResponse,
    IEpochListObject,
    IEpochResponse,
  } from "./types";

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
        connectedNetwork === "testnet" ? EPOCH_DURATION_TESTNET : EPOCH_DURATION_MAINNET;
      const voterStorageResponse = await getStorage(voterContractAddress, voterStorageType);
      const currentEpochNumber: number = voterStorageResponse.epoch.toNumber(); // Voter storage response for epoch is BigNumber
      const currentTimestamp = new Date().getTime();
      const currentEpochStart = Math.floor(currentTimestamp / epochDuration) * epochDuration;
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
   * Fetch data for a selected epoch number. Data includes if it is current epoch, start timestamp in seconds and end timestamp in seconds.
   * @param epochNumber - Numeric value of the epoch for which the data is to be fetched
   */
  export const fetchEpochData = async (epochNumber: number): Promise<IEpochResponse> => {
    try {
      const epochDuration: number =
        connectedNetwork === "testnet"
          ? Math.floor(EPOCH_DURATION_TESTNET / 1000)
          : Math.floor(EPOCH_DURATION_MAINNET / 1000);

      const voterStorageResponse = await getStorage(voterContractAddress, voterStorageType);
      const currentEpochNumber: number = voterStorageResponse.epoch.toNumber(); // Voter storage response for epoch is BigNumber
      const epochDataMapId: string = voterStorageResponse.epoch_end;
      const isCurrent: boolean = epochNumber === currentEpochNumber;
  
      const epochDataResponse = await getTzktBigMapData(epochDataMapId, `key=${epochNumber}`);
      if (epochDataResponse.data.length === 0) {
        throw new Error("No epoch data found for the selected epoch number.");
      }
      const epochData = epochDataResponse.data[0];
      const epochEndTimestamp = Math.floor(new Date(epochData.value).getTime() / 1000);
      const epochStartTimestamp = epochEndTimestamp - epochDuration;
  
      const finalEpochData = {
        isCurrent,
        epochStartTimestamp,
        epochEndTimestamp,
      };
      return {
        success: true,
        epochData: finalEpochData,
      };
    } catch (error: any) {
      return {
        success: false,
        epochData: {},
        error: error.message,
      };
    }
  };
  