import { connectedNetwork, voterAddress as voterContractAddress } from "../../common/walletconnect";
import { EPOCH_DURATION_MAINNET, EPOCH_DURATION_TESTNET, MAX_TIME } from "../../constants/global";
import { voterStorageType } from "../votes/data";
import { getStorage, getTzktBigMapData, getTzktStorageData } from "./storageProvider";
import {
  IDatesEnabledRangeData,
  IEpochDataResponse,
  IEpochListObject,
  IEpochResponse,
} from "./types";
import { BigNumber } from "bignumber.js";

/**
 * Returns the list of epoch data including the current one.
 * @param previousEpochsRequired - Count of previous epoch's data required(optional). Default is 4.
 */
export const getListOfEpochs = async (
  previousEpochsRequired: number = 4
): Promise<IEpochDataResponse> => {
  try {
    const listOfEpochs: IEpochListObject[] = [];
    const epochDuration: number =
      connectedNetwork === "testnet" ? EPOCH_DURATION_TESTNET : EPOCH_DURATION_MAINNET;
    const voterStorageResponse = await getTzktStorageData(voterContractAddress);
    const currentEpochNumber: number = new BigNumber(voterStorageResponse.data.epoch).toNumber();
    const epochEndBigMapId: number = voterStorageResponse.data.epoch_end;
    const voterEpochResponse = await getTzktBigMapData(`${epochEndBigMapId}`,`key=${currentEpochNumber}`);
    if(voterEpochResponse.data.length === 0) {
      throw new Error("Error fetching epoch data");
    }
    const currentEpochEnd = new Date(voterEpochResponse.data[0].value).getTime();
    const currentEpochStart = currentEpochEnd - epochDuration;

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
 * Returns the list of epoch data including the current one using RPC.
 * @param previousEpochsRequired - Count of previous epoch's data required(optional). Default is 4.
 */
export const getListOfEpochsViaRpc = async (
  previousEpochsRequired: number = 4
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

    const voterStorageResponse = await getTzktStorageData(voterContractAddress);
    const currentEpochNumber: number = new BigNumber(voterStorageResponse.data.epoch).toNumber();
    const epochEndBigMapId: number = voterStorageResponse.data.epoch_end;
    const isCurrent: boolean = epochNumber === currentEpochNumber;

    const epochDataResponse = await getTzktBigMapData(`${epochEndBigMapId}`, `key=${epochNumber}`);
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

/**
 * Fetch data for a selected epoch number. Data includes if it is current epoch,
 * start timestamp in seconds and end timestamp in seconds via RPC.
 * @param epochNumber - Numeric value of the epoch for which the data is to be fetched
 */
 export const fetchEpochDataViaRpc = async (epochNumber: number): Promise<IEpochResponse> => {
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

/**
 * Returns the range of timestamp allowed in calendar for selection in milliseconds
 * along with number of days, list of years and list of thursdays allowed to select.
 */
export const getCalendarRangeToEnable = (): IDatesEnabledRangeData => {
  const dayInMilliSeconds: number = 86400000;
  const yearsToEnable: number[] = [];
  const thursdaysToEnable: number[] = [];
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const startTimestamp = start.getTime();
  const endTimestamp = startTimestamp + MAX_TIME * 1000;
  const days = Math.floor((endTimestamp - startTimestamp) / dayInMilliSeconds);
  // Create the list of years to enable on calendar
  const yearBegin = new Date(startTimestamp).getFullYear();
  const yearEnd = new Date(endTimestamp).getFullYear();
  for (let i = yearBegin; i <= yearEnd; i++) {
    yearsToEnable.push(i);
  }
  // Create the list of thursdays to enable on calendar
  for (let i = startTimestamp; i < endTimestamp; i += dayInMilliSeconds) {
    if (new Date(i).getDay() === 4) {
      thursdaysToEnable.push(i);
    }
  }
  return {
    startTimestamp,
    endTimestamp,
    days,
    yearsToEnable,
    thursdaysToEnable,
  };
};
