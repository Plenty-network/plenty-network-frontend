import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import {
  IPositionStatsResponse,
  IVotesStatsDataResponse,
  ITvlStatsResponse,
  IUnclaimedInflationIndexer,
  IClaimInflationOperationData,
  IUnclaimedInflationData,
  IUnclaimedInflationResponse,
  IAllLocksInflationData,
  ILockInflationData,
} from "./types";
import { ILpTokenPriceList, ITokenPriceList } from "../util/types";
import { getPositionsData } from "./pools";

/**
 * Returns the statistical data of TVL for positions of my porfolio.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenPrices - Object of prices of all standard tokens
 * @param lPTokenPrices - Object of prices of all LP tokens
 */
export const getTvlStatsData = async (
  userTezosAddress: string,
  tokenPrices: ITokenPriceList,
  lPTokenPrices: ILpTokenPriceList
): Promise<BigNumber> => {
  try {
    if (
      !userTezosAddress ||
      Object.keys(tokenPrices).length === 0 ||
      Object.keys(lPTokenPrices).length === 0
    ) {
      throw new Error("Invalid or empty arguments.");
    }
    // const state = store.getState();
    // const tokenPrices = state.tokenPrice.tokenPrice;
    const PLYPrice = new BigNumber(tokenPrices["PLY"] ?? 0);

    const [votesStatsData, positionsData] = await Promise.all([
      getVotesStatsData(userTezosAddress),
      getPositionsData(userTezosAddress, lPTokenPrices),
    ]);
    if (!positionsData.success) {
      throw new Error(positionsData.error as string);
    }

    const liquidityAmountSum = positionsData.liquidityAmountSum;
    const totalPLYAmount = votesStatsData.totalPlyLocked.multipliedBy(PLYPrice);
    const tvl = liquidityAmountSum.plus(totalPLYAmount);

    // return {
    //   success: true,
    //   tvl,
    // };
    return tvl;
  } catch (error: any) {
    throw new Error(error.message);
    // return {
    //   success: false,
    //   tvl: new BigNumber(0),
    //   error: error.message,
    // };
  }
};

/**
 * Returns the statistical data (tvl, total epoch power and total PLY locked) for positions of my porfolio.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenPrices - Object of prices of all standard tokens
 * @param lPTokenPrices - Object of prices of all LP tokens
 */
export const getPositionStatsData = async (
  userTezosAddress: string,
  tokenPrices: ITokenPriceList,
  lPTokenPrices: ILpTokenPriceList
): Promise<IPositionStatsResponse> => {
  try {
    if (
      !userTezosAddress ||
      Object.keys(tokenPrices).length === 0 ||
      Object.keys(lPTokenPrices).length === 0
    ) {
      throw new Error("Invalid or empty arguments.");
    }
    // const state = store.getState();
    // const tokenPrices = state.tokenPrice.tokenPrice;
    const PLYPrice = new BigNumber(tokenPrices["PLY"] ?? 0);

    const [votesStatsData, positionsData] = await Promise.all([
      getVotesStatsData(userTezosAddress),
      getPositionsData(userTezosAddress, lPTokenPrices),
    ]);
    if (!positionsData.success) {
      throw new Error(positionsData.error as string);
    }

    const liquidityAmountSum = positionsData.liquidityAmountSum;
    const totalPLYAmount = votesStatsData.totalPlyLocked.multipliedBy(PLYPrice);
    const tvl = liquidityAmountSum.plus(totalPLYAmount);

    return {
      success: true,
      tvl,
      totalEpochVotingPower: votesStatsData.totalEpochVotingPower,
      totalPLYLocked: votesStatsData.totalPlyLocked,
    };
  } catch (error: any) {
    return {
      success: false,
      tvl: new BigNumber(0),
      totalEpochVotingPower: new BigNumber(0),
      totalPLYLocked: new BigNumber(0),
      error: error.message,
    };
  }
};

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
      //success: true,
      totalEpochVotingPower,
      totalPlyLocked,
    };
  } catch (error: any) {
    // return {
    //   success: false,
    //   totalEpochVotingPower: new BigNumber(0),
    //   totalPlyLocked: new BigNumber(0),
    //   error: error.message,
    // };
    throw new Error(error.message);
  }
};

/**
 * Returns the unclaimed inflation data for a user.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenPrices - Object of prices of all standard tokens
 */
export const getUnclaimedInflationData = async (
  userTezosAddress: string,
  tokenPrices: ITokenPriceList
): Promise<IUnclaimedInflationResponse> => {
  try {
    if (!userTezosAddress || Object.keys(tokenPrices).length === 0) {
      throw new Error("Invalid or empty arguments.");
    }

    let totalUnclaimedPLYValue: BigNumber = new BigNumber(0);
    const inflationOpertionData: IClaimInflationOperationData[] = [];
    const allLocksInflationData: IAllLocksInflationData = {};

    const inflationIndexerResponse = await axios.get(
      `${Config.VE_INDEXER}inflation?address=${userTezosAddress}`
    );
    const inflationIndexerData: IUnclaimedInflationIndexer[] = inflationIndexerResponse.data;

    for (const lockData of inflationIndexerData) {
      let epochsList: number[] = [];
      const lockInflationData: ILockInflationData[] = [];
      for (const inflationData of lockData.unclaimedInflation) {
        const inflation = new BigNumber(inflationData.inflationShare);
        totalUnclaimedPLYValue = totalUnclaimedPLYValue.plus(inflation.isFinite() ? inflation : 0);
        if (inflation.isFinite() && inflation.isGreaterThan(0)) {
          const inflationWithDecimals = inflation.dividedBy(PLY_DECIMAL_MULTIPLIER);
          epochsList.push(Number(inflationData.epoch));
          lockInflationData.push({
            epoch: Number(inflationData.epoch),
            inflationInPly: inflationWithDecimals,
            inflationValue: inflationWithDecimals.multipliedBy(
              new BigNumber(tokenPrices["PLY"] || 0)
            ),
          });
        }
        // Create chunks of epoch data for a token
        if (epochsList.length === 5) {
          inflationOpertionData.push({ tokenId: Number(lockData.id), epochs: epochsList });
          epochsList = [];
        }
      }
      // Add remaining epoch data for a token
      if (epochsList.length > 0) {
        inflationOpertionData.push({ tokenId: Number(lockData.id), epochs: epochsList });
      }
      allLocksInflationData[lockData.id] = lockInflationData;
      // console.log(lockData);
      
    }
    
    totalUnclaimedPLYValue = totalUnclaimedPLYValue.dividedBy(PLY_DECIMAL_MULTIPLIER);
    const unclaimedInflationData: IUnclaimedInflationData = {
      unclaimedInflationValue: totalUnclaimedPLYValue.multipliedBy(
        new BigNumber(tokenPrices["PLY"] || 0)
      ),
      unclaimedInflationAmount: totalUnclaimedPLYValue,
    };
    console.log(
      unclaimedInflationData.unclaimedInflationAmount.toString(),
      unclaimedInflationData.unclaimedInflationValue.toString()
    );
    inflationOpertionData.sort((a, b) => a.tokenId - b.tokenId);
    return {
      unclaimedInflationData,
      claimAllInflationData: inflationOpertionData,
      allLocksInflationData,
    };
    // console.log(inflationIndexerData);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
