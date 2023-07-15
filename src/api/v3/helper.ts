import axios from "axios";
import Config from "../../config/config";
import BigNumber from "bignumber.js";
import { Token, BalanceNat, IV3ContractStorageParams } from "./types";
import { IConfigToken } from "../../config/types";
import { Tick, Liquidity, PositionManager, Price } from "@plenty-labs/v3-sdk";
import { getV3DexAddress } from "../../api/util/fetchConfig";
import { connectedNetwork, dappClient } from "../../common/walletconnect";
import { store } from "../../redux";


const tokenDetail = async (tokenSymbol: String): Promise<Token> => {
  let configResponse: any = await axios.get(Config.CONFIG_LINKS[connectedNetwork].TOKEN);
  configResponse = configResponse.data[`${tokenSymbol}`];

  let tokenAddress = configResponse.address;
  let tokenStandard = configResponse.standard;
  let tokenDecimals = configResponse.decimals;
  let tokenId = configResponse.tokenId;

  return {
    address: tokenAddress,
    tokenId: tokenId,
    standard: tokenStandard,
    decimals: tokenDecimals,
  };
};

export const contractStorage = async (
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<IV3ContractStorageParams> => {
  let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
  const v3ContractStorage = await axios.get(
    `${Config.TZKT_NODES[connectedNetwork]}v1/contracts/${v3ContractAddress}/storage`
  );

  let sqrtPriceValue = BigNumber(v3ContractStorage.data.sqrt_price);
  let currTickIndex = parseInt(v3ContractStorage.data.cur_tick_index);
  let tickSpacing = parseInt(v3ContractStorage.data.constants.tick_spacing);
  let feeBps = parseInt(v3ContractStorage.data.constants.fee_bps);
  let currentTickWitness = parseInt(v3ContractStorage.data.cur_tick_witness);
  let liquidity = BigNumber(v3ContractStorage.data.liquidity);
  let tokenX = await tokenDetail(tokenXSymbol);
  let tokenY = await tokenDetail(tokenYSymbol);
  const fee_growth = {
    x: BigNumber(v3ContractStorage.data.fee_growth.x),
    y: BigNumber(v3ContractStorage.data.fee_growth.y),
  };
  let ticksBigMap = parseInt(v3ContractStorage.data.ticks);

  return {
    currTickIndex: currTickIndex,
    currentTickWitness: currentTickWitness,
    tickSpacing: tickSpacing,
    sqrtPriceValue: sqrtPriceValue,
    liquidity: liquidity,
    feeBps: feeBps,
    tokenX: tokenX,
    tokenY: tokenY,
    feeGrowth: fee_growth,
    ticksBigMap: ticksBigMap,
    poolAddress: v3ContractAddress,
  };
};

export const getV3PoolAddressWithFeeTier = (tokenIn: string, tokenOut: string, feeTier: number): string => {
  const state = store.getState();
  const AMM = state.config.AMMs;
  const feeBPS = feeTier * 100;

  const address = Object.keys(AMM).find(
    (key) =>
      // @ts-ignore
      (AMM[key].tokenX.symbol === tokenIn && AMM[key].tokenY.symbol === tokenOut && feeBPS.toString() === AMM[key].feeBps) ||
      // @ts-ignore
      (AMM[key].tokenY.symbol === tokenIn && AMM[key].tokenX.symbol === tokenOut && feeBPS.toString() === AMM[key].feeBps)
  );
  return address ?? "false";
};

export const calculateWitnessValue = async (
  witnessFrom: number,
  poolAddress: string
): Promise<any> => {
  let rpcResponse = await axios.get(
    `${Config.V3_CONFIG_URL.testnet}/ticks?pool=${poolAddress}&witnessOf=${witnessFrom}`
  );

  let witnessValue = rpcResponse.data.witness;

  return witnessValue;
};

export const calculateNearTickSpacing = async (tick: number, space: number): Promise<any> => {
  try {
    let nearestTick = Tick.nearestUsableTick(tick, space);

    return nearestTick;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getOutsideFeeGrowth = async (
  ticksBigmap: number,
  tick: number
): Promise<BalanceNat> => {
  try {
    const feeGrowthOutside = await axios.get(
      `${Config.TZKT_NODES.testnet}v1/bigmaps/${ticksBigmap}/keys/${tick}`
    );

    return {
      x: new BigNumber(feeGrowthOutside.data.value.fee_growth_outside.x),
      y: new BigNumber(feeGrowthOutside.data.value.fee_growth_outside.y),
    };
  } catch (error) {
    console.log("v3 error: ", error);
    return {
      x: BigNumber("0"),
      y: BigNumber("0"),
    };
  }
};

export const getTickAndRealPriceFromPool = async (contractAddress: string): Promise<any> => {
  try {
    let rpcResponse: any = await axios.get(
      `${Config.V3_CONFIG_URL[connectedNetwork]}/ticks?pool=${contractAddress}`
    );

    return rpcResponse.data;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getRealPriceFromTick = async (
  tick: number,
  tokenXSymbol: IConfigToken,
  tokenYSymbol: IConfigToken
): Promise<any> => {
  try {
    let priceValue = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(tick),
      tokenXSymbol.decimals,
      tokenYSymbol.decimals
    );

    return priceValue;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getTickFromRealPrice = async (
  realPrice: BigNumber,
  tokenXSymbol: IConfigToken,
  tokenYSymbol: IConfigToken,
  tickspacing: number
): Promise<any> => {
  try {
    let tick = Tick.computeTickFromSqrtPrice(
      Price.computeSqrtPriceFromRealPrice(
        realPrice,
        tokenXSymbol.decimals,
        tokenYSymbol.decimals
      ),
      tickspacing
    );

    return tick;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const calculateliquidity = async (
  amount: BalanceNat,
  lowerTick: number,
  upperTick: number,

  contractStorageParameters: IV3ContractStorageParams
): Promise<any> => {
  try {
    let sqrtPriceFromLowerTick = Tick.computeSqrtPriceFromTick(lowerTick);
    let sqrtPriceFromUpperTick = Tick.computeSqrtPriceFromTick(upperTick);

    let liquidity = Liquidity.computeLiquidityFromAmount(
      amount,
      contractStorageParameters.sqrtPriceValue,
      sqrtPriceFromLowerTick,
      sqrtPriceFromUpperTick
    );
    return liquidity;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const createPositionInstance = async (
  lowerTick: number,
  upperTick: number,
  tokenXSymbol: string,
  tokenYSymbol: string,
  deadline: number,
  maximumTokensContributed: BalanceNat,
  contractAddress: string
): Promise<any> => {
  try {
    const Tezos = await dappClient().tezos();

    let contractStorageParameters = await contractStorage(tokenXSymbol, tokenYSymbol);

    const contractInstance = await Tezos.wallet.at(contractAddress);

    let liquidity = await calculateliquidity(
      maximumTokensContributed,
      lowerTick,
      upperTick,
      contractStorageParameters
    );

    const maxTokenFinal = Liquidity.computeAmountFromLiquidity(
      liquidity,
      contractStorageParameters.sqrtPriceValue,
      Tick.computeSqrtPriceFromTick(lowerTick),
      Tick.computeSqrtPriceFromTick(upperTick)
    );

    let lowerTickWitness = await calculateWitnessValue(lowerTick, contractAddress);
    let upperTickWitness = await calculateWitnessValue(upperTick, contractAddress);

    let optionSet = {
      lowerTickIndex: lowerTick,
      upperTickIndex: upperTick,
      lowerTickWitness: lowerTickWitness,
      upperTickWitness: upperTickWitness,
      liquidity: liquidity,
      deadline: deadline,
      maximumTokensContributed: maxTokenFinal,
    };

    // @ts-ignore
    let createPosition = PositionManager.setPositionOp(contractInstance, optionSet);

    return createPosition;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};
