import axios from "axios";
import Config from "../../config/config";
import BigNumber from "bignumber.js";
import { Token, BalanceNat } from "./types";
import { Tick, Liquidity, PositionManager, Price } from "@plenty-labs/v3-sdk";
import { getV3DexAddress } from "../../api/util/fetchConfig";
import { dappClient } from "../../common/walletconnect";

const TokenDetail = async (tokenSymbol: String): Promise<Token> => {
  let configResponse: any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
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

export const ContractStorage = async (
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<{
  currTickIndex: number;
  currentTickWitness: number;
  tickSpacing: number;
  sqrtPriceValue: BigNumber;
  liquidity: BigNumber;
  feeBps: number;
  tokenX: Token;
  tokenY: Token;
  feeGrowth: {
    x: BigNumber;
    y: BigNumber;
  };
  poolAddress: string;
  ticksBigMap: number;
}> => {
  let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
  const v3ContractStorage = await axios.get(
    `${Config.TZKT_NODES.testnet}v1/contracts/${v3ContractAddress}/storage`
  );

  // https://rpc.tzkt.io/ghostnet/chains/main/blocks/head/context/contracts/KT1M5yHd85ikngHm5YCu9gkfM2oqtbsKak8Y/storage
  let sqrtPriceValue = BigNumber(v3ContractStorage.data.sqrt_price);
  let currTickIndex = parseInt(v3ContractStorage.data.cur_tick_index);
  let tickSpacing = parseInt(v3ContractStorage.data.constants.tick_spacing);
  let feeBps = parseInt(v3ContractStorage.data.constants.fee_bps);
  let currentTickWitness = parseInt(v3ContractStorage.data.cur_tick_witness);
  let liquidity = BigNumber(v3ContractStorage.data.liquidity);
  let tokenX = await TokenDetail(tokenXSymbol);
  let tokenY = await TokenDetail(tokenYSymbol);
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

export const calculateWitnessValue = async (
  witnessFrom: number,
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<any> => {
  let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
  let rpcResponse = await axios.get(
    `${Config.V3_CONFIG_URL.testnet}/ticks?pool=${v3ContractAddress}&witnessOf=${witnessFrom}`
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

export const nearestTickIndex = async (): Promise<any> => {
  try {
    let nearestTick = Tick;

    return nearestTick;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getTickAndRealPriceFromPool = async (contractAddress: string): Promise<any> => {
  try {
    let rpcResponse: any = await axios.get(
      `${Config.V3_CONFIG_URL.testnet}/ticks?pool=${contractAddress}`
    );

    return rpcResponse.data;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getRealPriceFromTick = async (
  tick: number,
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<any> => {
  try {
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    let priceValue = Price.computeRealPriceFromSqrtPrice(
      Tick.computeSqrtPriceFromTick(tick),
      contractStorageParameters.tokenX.decimals,
      contractStorageParameters.tokenY.decimals
    );

    return priceValue;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

export const getTickFromRealPrice = async (
  realPrice: BigNumber,
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<any> => {
  try {
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    let tick = Tick.computeTickFromSqrtPrice(
      Price.computeSqrtPriceFromRealPrice(
        realPrice,
        contractStorageParameters.tokenX.decimals,
        contractStorageParameters.tokenY.decimals
      ),
      contractStorageParameters.tickSpacing
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
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<any> => {
  try {
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);
    let sqrtPriceFromLowerTick = Tick.computeSqrtPriceFromTick(lowerTick);
    let sqrtPriceFromUpperTick = Tick.computeSqrtPriceFromTick(upperTick);

    let liquidity = Liquidity.computeLiquidityFromAmount(
      amount,
      contractStorageParameters.sqrtPriceValue,
      sqrtPriceFromLowerTick,
      sqrtPriceFromUpperTick
    );
    console.log("---v3----", liquidity);
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
  maximumTokensContributed: BalanceNat
): Promise<any> => {
  try {
    const Tezos = await dappClient().tezos();

    const contractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol);

    const contractInstance = await Tezos.wallet.at(contractAddress);
    console.log(
      "data createPositionInstance: ",
      maximumTokensContributed,
      lowerTick,
      upperTick,
      tokenXSymbol,
      tokenYSymbol
    );
    let liquidity = await calculateliquidity(
      maximumTokensContributed,
      lowerTick,
      upperTick,
      tokenXSymbol,
      tokenYSymbol
    );

    /*     console.log(
      "testssss",
      liquidity.toString(),
      contractStorageParameters.sqrtPriceValue.toString(),
      Tick.computeSqrtPriceFromTick(lowerTick).toString(),
      Tick.computeSqrtPriceFromTick(upperTick).toString()
    ); */

    const maxTokenFinal = Liquidity.computeAmountFromLiquidity(
      liquidity,
      contractStorageParameters.sqrtPriceValue,
      Tick.computeSqrtPriceFromTick(lowerTick),
      Tick.computeSqrtPriceFromTick(upperTick)
    );

    let lowerTickWitness = await calculateWitnessValue(lowerTick, tokenXSymbol, tokenYSymbol);
    let upperTickWitness = await calculateWitnessValue(upperTick, tokenXSymbol, tokenYSymbol);

    let optionSet = {
      lowerTickIndex: lowerTick,
      upperTickIndex: upperTick,
      lowerTickWitness: lowerTickWitness,
      upperTickWitness: upperTickWitness,
      liquidity: liquidity,
      deadline: deadline,
      maximumTokensContributed: maxTokenFinal,
    };

    let optionSet2 = {
      lowerTickIndex: lowerTick,
      upperTickIndex: upperTick,
      lowerTickWitness: lowerTickWitness,
      upperTickWitness: upperTickWitness,
      liquidity: liquidity.toString(),
      deadline: deadline,
      maximumTokensContributedX: maxTokenFinal.x.toString(),
      maximumTokensContributedY: maxTokenFinal.y.toString(),
      priceLowerTick: Price.computeRealPriceFromSqrtPrice(
        Tick.computeSqrtPriceFromTick(lowerTick),
        contractStorageParameters.tokenX.decimals,
        contractStorageParameters.tokenY.decimals
      ).toString(),
      priceUpperTick: Price.computeRealPriceFromSqrtPrice(
        Tick.computeSqrtPriceFromTick(upperTick),
        contractStorageParameters.tokenX.decimals,
        contractStorageParameters.tokenY.decimals
      ).toString(),
    };

    console.log("optionSet: ", optionSet2);
    // @ts-ignore
    let createPosition = PositionManager.setPositionOp(contractInstance, optionSet);

    return createPosition;
  } catch (error) {
    console.log("v3 error: ", error);
  }
};
