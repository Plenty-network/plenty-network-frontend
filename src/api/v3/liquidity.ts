import BigNumber from "bignumber.js";
import { Tick, Pool, Price } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { contractStorage, getRealPriceFromTick } from "./helper";
import { store } from "../../redux";

export const connectedNetwork = Config.NETWORK;

export const calculateCurrentPrice = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
  refernceToken: String,
  feeTier: number
): Promise<any> => {
  try {
    let currentPrice;

    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);

    if (refernceToken === tokenYSymbol) {
      currentPrice = BigNumber(1).dividedBy(
        Price.computeRealPriceFromSqrtPrice(
          contractStorageParameters.sqrtPriceValue,
          contractStorageParameters.tokenX,
          contractStorageParameters.tokenY
        )
      );
    } else {
      currentPrice = Price.computeRealPriceFromSqrtPrice(
        contractStorageParameters.sqrtPriceValue,
        contractStorageParameters.tokenX,
        contractStorageParameters.tokenY
      );
    }
    
    return currentPrice;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const calculateFullRange = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
  feeTier: number
): Promise<any> => {
  try {
    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);
    let PoolObject = new Pool(
      contractStorageParameters.currTickIndex,
      contractStorageParameters.currentTickWitness,
      contractStorageParameters.tickSpacing,
      contractStorageParameters.sqrtPriceValue,
      contractStorageParameters.feeBps,
      contractStorageParameters.liquidity
    );
    let tickFullRange = PoolObject.getFullRangeBoundaries();

    let minTickPrice = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(tickFullRange[0]),
      contractStorageParameters.tokenX,
      contractStorageParameters.tokenY
    );
    let maxTickPrice = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(tickFullRange[1]),
      contractStorageParameters.tokenX,
      contractStorageParameters.tokenY
    );

    return {
      minTick: tickFullRange[0],
      maxTick: tickFullRange[1],
      minTickPrice: minTickPrice,
      maxTickPrice: maxTickPrice,
    };
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getInitialBoundaries = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
  feeTier: number
): Promise<any> => {
  try {
    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);
    let PoolObject = new Pool(
      contractStorageParameters.currTickIndex,
      contractStorageParameters.currentTickWitness,
      contractStorageParameters.tickSpacing,
      contractStorageParameters.sqrtPriceValue,
      contractStorageParameters.feeBps,
      contractStorageParameters.liquidity
    );

    let initialBoundaries = PoolObject.getInitialBoundaries();
    let minTick = initialBoundaries[0];
    let maxTick = initialBoundaries[1];

    let minPriceValue = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(minTick),
      contractStorageParameters.tokenX,
      contractStorageParameters.tokenY
    );

    let maxPriceValue = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(maxTick),
      contractStorageParameters.tokenX,
      contractStorageParameters.tokenY
    );

    return {
      minTick: minTick,
      maxTick: maxTick,
      minValue: minPriceValue,
      maxValue: maxPriceValue,
    };
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const estimateTokenXFromTokenY = async (
  amount: BigNumber,
  tokenXSymbol: string,
  tokenYSymbol: string,
  lowerTickIndex: number,
  upperTickIndex: number,
  feeTier: number
): Promise<any> => {
  try {
    let estimatedAmount;
    const state = store.getState();
    const TOKENS = state.config.tokens;

    amount = amount.multipliedBy(new BigNumber(10).pow(TOKENS[tokenYSymbol].decimals));

    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);
    lowerTickIndex = Tick.nearestUsableTick(lowerTickIndex, contractStorageParameters.tickSpacing);
    upperTickIndex = Tick.nearestUsableTick(upperTickIndex, contractStorageParameters.tickSpacing);
    let PoolObject = new Pool(
      contractStorageParameters.currTickIndex,
      contractStorageParameters.currentTickWitness,
      contractStorageParameters.tickSpacing,
      contractStorageParameters.sqrtPriceValue,
      contractStorageParameters.feeBps,
      contractStorageParameters.liquidity
    );
    let estimatedAmountCalc = PoolObject.estimateAmountXFromY(
      amount,
      lowerTickIndex,
      upperTickIndex
    );

    estimatedAmount = estimatedAmountCalc.dividedBy(
      new BigNumber(10).pow(TOKENS[tokenXSymbol].decimals)
    );

    return estimatedAmount;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const estimateTokenYFromTokenX = async (
  amount: BigNumber,
  tokenXSymbol: string,
  tokenYSymbol: string,
  lowerTickIndex: number,
  upperTickIndex: number,
  feeTier: number
): Promise<any> => {
  try {
    let estimatedAmount;
    const state = store.getState();
    const TOKENS = state.config.tokens;

    amount = amount.multipliedBy(new BigNumber(10).pow(TOKENS[tokenXSymbol].decimals));

    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol, feeTier);
    lowerTickIndex = Tick.nearestUsableTick(lowerTickIndex, contractStorageParameters.tickSpacing);
    upperTickIndex = Tick.nearestUsableTick(upperTickIndex, contractStorageParameters.tickSpacing);
    let PoolObject = new Pool(
      contractStorageParameters.currTickIndex,
      contractStorageParameters.currentTickWitness,
      contractStorageParameters.tickSpacing,
      contractStorageParameters.sqrtPriceValue,
      contractStorageParameters.feeBps,
      contractStorageParameters.liquidity
    );

    let estimatedAmountCalc = PoolObject.estimateAmountYFromX(
      amount,
      lowerTickIndex,
      upperTickIndex
    );

    estimatedAmount = estimatedAmountCalc.dividedBy(
      new BigNumber(10).pow(TOKENS[tokenYSymbol].decimals)
    );

    return estimatedAmount;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};
