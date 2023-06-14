import BigNumber from "bignumber.js";
import { Tick, Pool, Price, Liquidity, Fee } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { ContractStorage, getOutsideFeeGrowth, getRealPriceFromTick } from "./helper";
import { store } from "../../redux";
import axios from "axios";
import { BalanceNat, IV3Position } from "./types";
import { getV3DexAddress } from "../util/fetchConfig";
import { parse } from "path";

export const connectedNetwork = Config.NETWORK;

export const getPositons = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
  feeTier: string,
  userAddress: string
) => {
  try {
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    const positions: IV3Position[] = (
      await axios.get(
        `${Config.VE_INDEXER[connectedNetwork]}/v3-positions?pool=${v3ContractAddress}&address=${userAddress}`
      )
    ).data;

    const finalPositionPromise = positions.map(async (position) => {
      const liquidity = Liquidity.computeAmountFromLiquidity(
        contractStorageParameters.liquidity,
        contractStorageParameters.sqrtPriceValue,
        Tick.computeSqrtPriceFromTick(parseInt(position.lower_tick_index)),
        Tick.computeSqrtPriceFromTick(parseInt(position.upper_tick_index))
      );

      const minPrice = Price.computeRealPriceFromSqrtPrice(
        Tick.computeSqrtPriceFromTick(parseInt(position.lower_tick_index)),
        contractStorageParameters.tokenX.decimals,
        contractStorageParameters.tokenY.decimals
      );
      const maxPrice = Price.computeRealPriceFromSqrtPrice(
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
          x: new BigNumber(parseInt(position.fee_growth_inside_last_x)),
          y: new BigNumber(parseInt(position.fee_growth_inside_last_y)),
        },

        currentTickIndex: contractStorageParameters.currTickIndex,

        lowerTickIndex: parseInt(position.lower_tick_index),

        upperTickIndex: parseInt(position.upper_tick_index),

        liquidity: new BigNumber(parseInt(position.liquidity)),
      };

      const fees = Fee.computePositionFee(feeParam);

      const isInRange =
        parseInt(position.lower_tick_index) <= contractStorageParameters.currTickIndex &&
        contractStorageParameters.currTickIndex <= parseInt(position.upper_tick_index);
      /*       console.log("positions", {
        liquidityX: liquidity.x.toString(),
        liquidityY: liquidity.y.toString(),
        minPrice: minPrice.toString(), // min price (Y/X)
        maxPrice: maxPrice.toString(), // max price (Y/X)
        feesx: fees.x.toString(),
        feesy: fees.y.toString(),
        isInRange: isInRange,
      }); */
      return {
        liquidity: liquidity,
        minPrice: minPrice, // min price (Y/X)
        maxPrice: maxPrice, // max price (Y/X)
        fees: fees,
        isInRange: isInRange,
      };
    });

    return await Promise.all(finalPositionPromise);
  } catch (error) {
    console.log("v3 position error: ", error);
  }
};
