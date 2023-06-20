import BigNumber from "bignumber.js";
import { Tick, Pool, Price, Liquidity, Fee, MAX_TICK, PositionManager } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { ContractStorage, getOutsideFeeGrowth, getRealPriceFromTick } from "./helper";

import axios from "axios";
import { BalanceNat, IV3Position, IV3PositionObject } from "./types";
import { getV3DexAddress } from "../util/fetchConfig";

import { ITokenPriceList } from "../util/types";

export const connectedNetwork = Config.NETWORK;

export const getPositons = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
  feeTier: string,
  userAddress: string,
  tokenPrices: ITokenPriceList
): Promise<IV3PositionObject[] | undefined> => {
  if (!userAddress || Object.keys(tokenPrices).length === 0) {
    throw new Error("Invalid or empty arguments.");
  }
  try {
    console.log("price X", tokenPrices[tokenXSymbol]);
    console.log("price Y", tokenPrices[tokenYSymbol]);
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    const positions: IV3Position[] = (
      await axios.get(
        `${Config.VE_INDEXER[connectedNetwork]}/v3-positions?pool=${v3ContractAddress}&address=${userAddress}`
      )
    ).data;

    const finalPositionPromise = positions.map(async (position) => {
      const liquidity = Liquidity.computeAmountFromLiquidity(
        BigNumber(position.liquidity),
        contractStorageParameters.sqrtPriceValue,
        Tick.computeSqrtPriceFromTick(parseInt(position.lower_tick_index)),
        Tick.computeSqrtPriceFromTick(parseInt(position.upper_tick_index))
      );

      const minPrice = Price.computeRealPriceFromSqrtPrice(
        Tick.computeSqrtPriceFromTick(parseInt(position.lower_tick_index)),
        contractStorageParameters.tokenX.decimals,
        contractStorageParameters.tokenY.decimals
      );

      console.log(
        "max",
        parseInt(position.upper_tick_index) ==
          Tick.nearestUsableTick(MAX_TICK, contractStorageParameters.tickSpacing),
        position.upper_tick_index
      );

      const maxPrice =
        parseInt(position.upper_tick_index) == MAX_TICK
          ? BigNumber(Infinity)
          : Price.computeRealPriceFromSqrtPrice(
              Tick.computeSqrtPriceFromTick(parseInt(position.upper_tick_index)),
              contractStorageParameters.tokenX.decimals,
              contractStorageParameters.tokenY.decimals
            );

      const lowerTickOutsideLast = await getOutsideFeeGrowth(
        contractStorageParameters.ticksBigMap,
        parseInt(position.lower_tick_index)
      );
      const upperTickOutsideLast = await getOutsideFeeGrowth(
        contractStorageParameters.ticksBigMap,
        parseInt(position.upper_tick_index)
      );

      const feeParam = {
        global: contractStorageParameters.feeGrowth,
        lowerTickOutsideLast: lowerTickOutsideLast,

        upperTickOutsideLast: upperTickOutsideLast,

        positionInsideLast: {
          x: new BigNumber(position.fee_growth_inside_last_x),
          y: new BigNumber(position.fee_growth_inside_last_y),
        },

        currentTickIndex: contractStorageParameters.currTickIndex,

        lowerTickIndex: parseInt(position.lower_tick_index),

        upperTickIndex: parseInt(position.upper_tick_index),

        liquidity: new BigNumber(position.liquidity),
      };

      const fees = Fee.computePositionFee(feeParam);

      const isInRange =
        parseInt(position.lower_tick_index) <= contractStorageParameters.currTickIndex &&
        contractStorageParameters.currTickIndex <= parseInt(position.upper_tick_index);

      /*       console.log("positions", {
        liquidity: {
          x: new BigNumber(
            liquidity.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
          ).toString(),
          y: new BigNumber(
            liquidity.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
          ).toString(),
        },
        liquidityDollar: new BigNumber(
          liquidity.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
        )
          .multipliedBy(tokenPrices[tokenXSymbol])
          .plus(
            BigNumber(
              liquidity.y.dividedBy(
                new BigNumber(10).pow(contractStorageParameters.tokenY.decimals)
              )
            ).multipliedBy(tokenPrices[tokenYSymbol])
          )
          .toString(),
        minPrice: minPrice, // min price (Y/X)
        maxPrice: maxPrice, // max price (Y/X)
        fees: {
          x: new BigNumber(
            fees.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
          ).toString(),
          y: new BigNumber(
            fees.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
          ).toString(),
        },
        feesDollar: new BigNumber(
          fees.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
        )
          .multipliedBy(tokenPrices[tokenXSymbol])
          .plus(
            BigNumber(
              fees.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
            ).multipliedBy(tokenPrices[tokenYSymbol])
          )
          .toString(),
        isInRange: isInRange,
      }); */
      return {
        position: position,
        liquidity: {
          x: new BigNumber(
            liquidity.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
          ),
          y: new BigNumber(
            liquidity.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
          ),
        },
        liquidityDollar: new BigNumber(
          liquidity.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
        )
          .multipliedBy(tokenPrices[tokenXSymbol])
          .plus(
            BigNumber(
              liquidity.y.dividedBy(
                new BigNumber(10).pow(contractStorageParameters.tokenY.decimals)
              )
            ).multipliedBy(tokenPrices[tokenYSymbol])
          ),
        minPrice: minPrice, // min price (Y/X)
        maxPrice: maxPrice, // max price (Y/X)
        fees: {
          x: new BigNumber(
            fees.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
          ),
          y: new BigNumber(
            fees.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
          ),
        },
        feesDollar: new BigNumber(
          fees.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
        )
          .multipliedBy(tokenPrices[tokenXSymbol])
          .plus(
            BigNumber(
              fees.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
            ).multipliedBy(tokenPrices[tokenYSymbol])
          ),
        isInRange: isInRange,
        isMaxPriceInfinity:
          parseInt(position.upper_tick_index) ==
          Tick.nearestUsableTick(MAX_TICK, contractStorageParameters.tickSpacing),
      };
    });

    return await Promise.all(finalPositionPromise);
  } catch (error) {
    console.log("v3 position error: ", error);
  }
};

export const createIncreaseLiquidityOperation = async (
  position: IV3PositionObject,
  maxTokensContributed: BalanceNat,
  userAddress: string,
  contractInstance: any,
  sqrt_price: BigNumber
) => {
  const liquidity = Liquidity.computeLiquidityFromAmount(
    maxTokensContributed,
    sqrt_price,
    Tick.computeSqrtPriceFromTick(parseInt(position.position.lower_tick_index)),
    Tick.computeSqrtPriceFromTick(parseInt(position.position.upper_tick_index))
  );

  const options = {
    liquidityDelta: liquidity,

    maximumTokensContributed: maxTokensContributed,

    positionId: parseInt(position.position.key_id),

    toX: userAddress,

    toY: userAddress,

    deadline: Math.floor(new Date().getTime() / 1000) + 30 * 60, //default 30 min deadline
  };

  // @ts-ignore
  return PositionManager.updatePositionOp(contractInstance, options);
};

export const createRemoveLiquidityOperation = async (
  position: IV3PositionObject,
  percentage: number,
  userAddress: string,
  contractInstance: any
) => {
  const liquidity = new BigNumber(position.position.liquidity)
    .multipliedBy(percentage)
    .dividedBy(100)
    .multipliedBy(-1);

  const options = {
    liquidityDelta: liquidity,

    maximumTokensContributed: {
      x: new BigNumber(0),
      y: new BigNumber(0),
    },

    positionId: parseInt(position.position.key_id),

    toX: userAddress,

    toY: userAddress,

    deadline: Math.floor(new Date().getTime() / 1000) + 30 * 60, //default 30 min deadline
  };

  // @ts-ignore
  return PositionManager.updatePositionOp(contractInstance, options);
};

export const calculateTokensForRemoveLiquidity = async (
  percentage: number,
  tokenXSymbol: string,
  tokenYSymbol: string,
  position: IV3PositionObject
): Promise<any> => {
  try {
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    const newLiquidty = new BigNumber(position.position.liquidity).minus(
      BigNumber(position.position.liquidity).multipliedBy(percentage).dividedBy(100)
    );

    const tokenAmounts = Liquidity.computeAmountFromLiquidity(
      newLiquidty,
      contractStorageParameters.sqrtPriceValue,
      Tick.computeSqrtPriceFromTick(parseInt(position.position.lower_tick_index)),
      Tick.computeSqrtPriceFromTick(parseInt(position.position.upper_tick_index))
    );

    return {
      x: new BigNumber(
        tokenAmounts.x.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenX.decimals))
      ),
      y: new BigNumber(
        tokenAmounts.y.dividedBy(new BigNumber(10).pow(contractStorageParameters.tokenY.decimals))
      ),
    };
  } catch (error) {
    console.log("v3 error: ", error);
  }
};
