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
import { ILpTokenPriceList, ITokenPriceList } from "../util/types";
import { getRewards } from "../rewards";


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
        const lpTokenPrice = new BigNumber(lPTokenPrices[AMM[pool.amm].lpToken.symbol]) ?? new BigNumber(0);
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
      `${Config.VE_INDEXER}positions?address=${userTezosAddress}`
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
      const gaugeAddress = AMM[ammAddress].gaugeAddress;
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
