import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import {
  IPoolsRewardsData,
  IPoolsRewardsResponse,
  IPositionsData,
  IPositionsIndexerData,
  IPositionsResponse,
} from "./types";
import { store } from "../../redux";
import { ILpTokenPriceList, IPnlpBalanceResponse, ITokenPriceList } from "../util/types";
import { getRewards } from "../rewards";
import { IConfigPool } from "../../config/types";
import { getPnlpBalance } from "../util/balance";
import { connectedNetwork } from "../../common/walletconnect";
import pLimit from "p-limit";
import { PROMISE_ALL_CONCURRENCY_LIMIT } from "../../constants/global";

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
      `${Config.API_SERVER_URL[connectedNetwork]}ply/positions?address=${userTezosAddress}`
    );
    const positionsResponseData: IPositionsIndexerData[] = positionsResponse.data;

    const positionsData: IPositionsData[] = positionsResponseData.map(
      (pool: IPositionsIndexerData): IPositionsData => {
        const lpTokenDecimalMultplier = new BigNumber(10).pow(AMM[pool.amm].lpToken.decimals);
        const lpTokenPrice =
          new BigNumber(lPTokenPrices[AMM[pool.amm].lpToken.address]) ?? new BigNumber(0);
        const lpBalance = new BigNumber(pool.lqtBalance);
        const staked = new BigNumber(pool.stakedBalance);
        const baseBalance = staked.multipliedBy(40).dividedBy(100);
        const totalLiquidity = lpBalance.plus(staked);
        const derived = new BigNumber(pool.derivedBalance);
        const poolApr = new BigNumber(pool.poolAPR.current);
        const stakedPercentage = staked.multipliedBy(100).dividedBy(totalLiquidity);
        const boostValue = derived.dividedBy(baseBalance);
        const userAPR = poolApr.multipliedBy(boostValue.isFinite() ? boostValue : 0);
        const totalLiquidityAmount = totalLiquidity
          .dividedBy(lpTokenDecimalMultplier)
          .multipliedBy(lpTokenPrice.isFinite() ? lpTokenPrice : 0);
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
          isGaugeAvailable: AMM[pool.amm].gauge ? true : false,
        };
      }
    );

    let poolsWithoutGaugeData: IPositionsData[] = [];
    const poolsWithoutGaugeResponse: IPositionsResponse = await getPositionsFromConfig(
      userTezosAddress,
      lPTokenPrices
    );

    if (poolsWithoutGaugeResponse.success) {
      liquidityAmountSum = liquidityAmountSum.plus(poolsWithoutGaugeResponse.liquidityAmountSum);
      poolsWithoutGaugeData = poolsWithoutGaugeResponse.positionPoolsData;
    }

    return {
      success: true,
      liquidityAmountSum,
      positionPoolsData: positionsData.concat(poolsWithoutGaugeData),
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

/**
 * Returns the list of pools with respective unclaimed emissions.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenPrices - Object of prices of all standard tokens
 */
export const getPoolsRewardsData = async (
  userTezosAddress: string,
  tokenPrices: ITokenPriceList
): Promise<IPoolsRewardsResponse> => {
  try {
    if (!userTezosAddress || Object.keys(tokenPrices).length === 0) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const AMM = state.config.AMMs;

    const positionsResponse = await axios.get(
      `${Config.API_SERVER_URL[connectedNetwork]}ply/positions?address=${userTezosAddress}`
    );
    const positionsResponseData: IPositionsIndexerData[] = positionsResponse.data;

    const poolsData: IPoolsRewardsData[] = [];
    const gaugeAddresses: string[] = [];
    let plyEmmissonsTotal = new BigNumber(0);

    for (const pool of positionsResponseData) {
      const ammAddress = pool.amm;
      const tokenOneSymbol = AMM[ammAddress].token1.symbol;
      const tokenTwoSymbol = AMM[ammAddress].token2.symbol;
      const rewardsResponse = await getRewards(
        tokenOneSymbol,
        tokenTwoSymbol,
        userTezosAddress,
        ammAddress
      );
      const plyEmissions = new BigNumber(rewardsResponse.rewards);
      const gaugeAddress = AMM[ammAddress].gauge;
      if (plyEmissions.isGreaterThan(0)) {
        const staked = new BigNumber(pool.stakedBalance);
        const baseBalance = staked.multipliedBy(40).dividedBy(100);
        const derived = new BigNumber(pool.derivedBalance);
        const boostValue = derived.dividedBy(baseBalance);
        plyEmmissonsTotal = plyEmmissonsTotal.plus(plyEmissions);
        gaugeAddress && gaugeAddresses.push(gaugeAddress as string);
        poolsData.push({
          tokenOneSymbol,
          tokenTwoSymbol,
          ammAddress,
          ammType: AMM[ammAddress].type,
          gaugeAddress: gaugeAddress,
          gaugeEmission: plyEmissions,
          gaugeEmissionValue: plyEmissions.multipliedBy(new BigNumber(tokenPrices["PLY"] || 0)),
          boostValue: boostValue.isFinite() ? boostValue : new BigNumber(0),
        });
      }
    }

    return {
      success: true,
      gaugeEmissionsTotal: plyEmmissonsTotal,
      gaugeEmissionsTotalValue: plyEmmissonsTotal.multipliedBy(
        new BigNumber(tokenPrices["PLY"] || 0)
      ),
      poolsRewardsData: poolsData,
      gaugeAddresses,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      gaugeEmissionsTotal: new BigNumber(0),
      gaugeEmissionsTotalValue: new BigNumber(0),
      poolsRewardsData: [],
      gaugeAddresses: [],
      error: error.message,
    };
  }
};

/**
 * Returns the pools data for a user (positions) from all the pools in config which doesn't have a gauge.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param lPTokenPrices - Object of prices of all LP tokens
 */
const getPositionsFromConfig = async (
  userTezosAddress: string,
  lPTokenPrices: ILpTokenPriceList
): Promise<IPositionsResponse> => {
  try {
    if (!userTezosAddress || Object.keys(lPTokenPrices).length === 0) {
      throw new Error("Invalid or empty arguments.");
    }

    const state = store.getState();
    const AMM = state.config.AMMs;
    // All promises concurrency is set to 8 for now.
    const limit = pLimit(PROMISE_ALL_CONCURRENCY_LIMIT);

    let liquidityAmountSum = new BigNumber(0);
    let positionsData: IPositionsData[] = [];

    // Filter all the pools from config which doesn't have gauge (not part of VE system).
    // Assuming that rest all pools with gauge data is handled by indexer.
    const poolsWithoutGauge: IConfigPool[] = Object.values(AMM).filter(
      (pool: IConfigPool) => pool.gauge === undefined
    );

    const lpBalancesData: IPnlpBalanceResponse[] = await Promise.all(
      poolsWithoutGauge.map((pool: IConfigPool) =>
        limit(() => getPnlpBalance(pool.token1.symbol, pool.token2.symbol, userTezosAddress))
      )
    );

    poolsWithoutGauge.forEach((pool: IConfigPool, index: number) => {
      const pnlpBalanceData: IPnlpBalanceResponse = lpBalancesData[index];
      if (pnlpBalanceData.success && new BigNumber(pnlpBalanceData.balance).isGreaterThan(0)) {
        const lpTokenPrice =
          new BigNumber(lPTokenPrices[AMM[pool.address].lpToken.address]) ?? new BigNumber(0);
        const lpBalance = new BigNumber(pnlpBalanceData.balance);
        const totalLiquidityAmount = lpBalance.multipliedBy(
          lpTokenPrice.isFinite() ? lpTokenPrice : 0
        );
        liquidityAmountSum = liquidityAmountSum.plus(totalLiquidityAmount);
        positionsData.push({
          ammAddress: pool.address,
          tokenA: AMM[pool.address].token1.symbol,
          tokenB: AMM[pool.address].token2.symbol,
          ammType: AMM[pool.address].type,
          totalLiquidityAmount,
          stakedPercentage: new BigNumber(0),
          userAPR: new BigNumber(0),
          boostValue: new BigNumber(0),
          isGaugeAvailable: false,
        });
      }
    });

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
