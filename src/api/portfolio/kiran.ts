import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import {
  IPositionsData,
  IPositionsIndexerData,
  IPositionsResponse,
  IPositionStatsResponse,
  IVotesStatsDataResponse,
} from "./types";
import { store } from "../../redux";
import { ILpTokenPriceList, ITokenPriceList } from "../util/types";

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
    if (!votesStatsData.success && !positionsData.success) {
      throw new Error(`${votesStatsData.error as string}, ${positionsData.error as string}`);
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
const getVotesStatsData = async (
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

/**
 * Returns the pools data for a user (positions).
 * @param userTezosAddress - Tezos wallet address of the user
 * @param lPTokenPrices - Object of prices of all LP tokens
 */
export const getPositionsData = async (
  userTezosAddress: string,
  lPTokenPrices: ILpTokenPriceList
): Promise<IPositionsResponse> => {
  try {
    if (!userTezosAddress || Object.keys(lPTokenPrices).length === 0) {
      throw new Error("Invalid or empty arguments.");
    }

    const state = store.getState();
    const AMM = state.config.AMMs;
    // const lPTokenPrices = state.tokenPrice.lpTokenPrices;
    let liquidityAmountSum = new BigNumber(0);

    const positionsResponse = await axios.get(
      `${Config.VE_INDEXER}positions?address=${userTezosAddress}`
    );
    const positionsResponseData: IPositionsIndexerData[] = positionsResponse.data;

    const positionsData: IPositionsData[] = positionsResponseData.map(
      (pool: IPositionsIndexerData): IPositionsData => {
        const lpTokenDecimalMultplier = new BigNumber(10).pow(AMM[pool.amm].lpToken.decimals);
        const lpTokenPrice = lPTokenPrices[AMM[pool.amm].lpToken.symbol] ?? new BigNumber(0);
        const lpBalance = new BigNumber(pool.lqtBalance);
        const staked = new BigNumber(pool.stakedBalance);
        const totalLiquidity = lpBalance.plus(staked);
        const derived = new BigNumber(pool.derivedBalance);
        const poolApr = new BigNumber(pool.poolAPR);
        const stakedPercentage = staked.multipliedBy(100).dividedBy(totalLiquidity);
        const boostValue = derived.dividedBy(staked);
        const userAPR = poolApr.multipliedBy(boostValue);
        const totalLiquidityAmount = totalLiquidity
          .dividedBy(lpTokenDecimalMultplier)
          .multipliedBy(lpTokenPrice);
        liquidityAmountSum = liquidityAmountSum.plus(totalLiquidityAmount);

        return {
          ammAddress: pool.amm,
          tokenA: AMM[pool.amm].token1.symbol,
          tokenB: AMM[pool.amm].token2.symbol,
          ammType: AMM[pool.amm].type,
          totalLiquidityAmount,
          stakedPercentage,
          userAPR,
          boostValue: boostValue.isFinite() ? boostValue : new BigNumber(0),
        };
      }
    );

    return {
      success: true,
      liquidityAmountSum,
      positionPoolsData: positionsData,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      success: false,
      liquidityAmountSum: new BigNumber(0),
      positionPoolsData: [],
      error: error.message,
    };
  }
};