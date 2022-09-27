import { BigNumber } from "bignumber.js";
import axios from "axios";
import Config from "../../config/config";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import {
  EFeesStatus,
  IAllEpochClaimTokenData,
  IAllEpochClaimOperationData,
  IAllLocksPositionData,
  IAllLocksPositionResponse,
  IAllLocksRewardsData,
  IAllLocksRewardsIndexerData,
  IAllLocksRewardsResponse,
  IAttachedData,
  IAttachedTzktResponse,
  IBribeIndexer,
  IBribesValueAndData,
  IFeeIndexer,
  IFeesValueAndData,
  ILockRewardsBribeData,
  ILockRewardsEpochData,
  ILockRewardsFeeData,
  ILocksRewardsTokenData,
  IPoolsRewardsData,
  IPoolsRewardsResponse,
  IPositionsData,
  IPositionsIndexerData,
  IPositionsResponse,
  IPositionStatsResponse,
  IVotesStatsDataResponse,
  IVotesUnclaimedIndexer,
  IAllBribesOperationData,
  IAllFeesOperationData,
  IAllClaimableFeesData,
  IAllRewardsOperationsData,
  ITvlStatsResponse,
} from "./types";
import { store } from "../../redux";
import { ILpTokenPriceList, ITokenPriceList } from "../util/types";
import { ELocksState } from "../votes/types";
import { voteEscrowAddress } from "../../common/walletconnect";
import { getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { getRewards } from "../rewards";
import { IAMM, ITokens } from "../../config/types";

// Stats
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
): Promise<ITvlStatsResponse> => {
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
    };
  } catch (error: any) {
    return {
      success: false,
      tvl: new BigNumber(0),
      error: error.message,
    };
  }
};

// Stats
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


// Stats
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

// Pools
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
        const baseBalance = staked.multipliedBy(40).dividedBy(100);
        const totalLiquidity = lpBalance.plus(staked);
        const derived = new BigNumber(pool.derivedBalance);
        const poolApr = new BigNumber(pool.poolAPR);
        const stakedPercentage = staked.multipliedBy(100).dividedBy(totalLiquidity);
        const boostValue = derived.dividedBy(baseBalance);
        const userAPR = poolApr.multipliedBy(boostValue.isFinite() ? boostValue : 0);
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

// Locks
/**
 * Returns the list of all the locks created by a user along with the pool attached if any.
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getAllLocksPositionData = async (
  userTezosAddress: string
): Promise<IAllLocksPositionResponse> => {
  try {
    if (!userTezosAddress) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const GAUGES = state.config.gauges;

    const [locksResponse, veStorageResponse] = await Promise.all([
      axios.get(`${Config.VE_INDEXER}locks?address=${userTezosAddress}`),
      getTzktStorageData(voteEscrowAddress),
    ]);
    const locksData = locksResponse.data.result;
    const attachedLocksBigMapId: string = Number(veStorageResponse.data.attached).toString();

    const attachedLocksResponse = await getTzktBigMapData(
      attachedLocksBigMapId,
      `active=true&select=key,value`
    );
    const attachedLocksData: IAttachedTzktResponse[] = attachedLocksResponse.data;

    const attachedLocks: IAttachedData = attachedLocksData.reduce(
      (finalAttached: IAttachedData, data: IAttachedTzktResponse) => (
        (finalAttached[data.key] = data.value), finalAttached
      ),
      {}
    );

    const finalVeNFTData: IAllLocksPositionData[] = [];
    const currentTimestamp: BigNumber = new BigNumber(Date.now())
      .dividedBy(1000)
      .decimalPlaces(0, 1);

    for (const lock of locksData) {
      const tokenId = new BigNumber(lock.id);
      const epochVotingPower = new BigNumber(lock.epochtVotingPower);
      const availableVotingPower = new BigNumber(lock.availableVotingPower);
      const consumedVotingPower = epochVotingPower.minus(availableVotingPower);
      const currentVotingPower = new BigNumber(lock.currentVotingPower).dividedBy(
        PLY_DECIMAL_MULTIPLIER
      );
      const lockEndTimestamp = new BigNumber(lock.endTs);
      const attached = Boolean(lock.attached);
      const finalLock: IAllLocksPositionData = {
        tokenId,
        baseValue: new BigNumber(lock.baseValue).dividedBy(PLY_DECIMAL_MULTIPLIER),
        votingPower: new BigNumber(0),
        epochVotingPower: epochVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        consumedVotingPower: consumedVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        currentVotingPower,
        locksState: ELocksState.DISABLED,
        endTimeStamp: lockEndTimestamp.multipliedBy(1000).toNumber(),
        attached,
        attachedGaugeAddress: undefined,
        attachedAmmAddress: undefined,
        attachedTokenASymbol: undefined,
        attachedTokenBSymbol: undefined,
      };

      if (epochVotingPower.isFinite() && epochVotingPower.isGreaterThan(0)) {
        if (availableVotingPower.isGreaterThan(0)) {
          finalLock.votingPower = availableVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER);
          finalLock.locksState = ELocksState.AVAILABLE;
        } else {
          finalLock.locksState = ELocksState.CONSUMED;
        }
      } else {
        if (currentTimestamp.isGreaterThan(lockEndTimestamp)) {
          finalLock.locksState = ELocksState.EXPIRED;
        } else {
          finalLock.locksState = ELocksState.DISABLED;
        }
      }

      if (
        attached &&
        attachedLocks[tokenId.toString()] &&
        GAUGES[attachedLocks[tokenId.toString()]]
      ) {
        const gaugeAttached = attachedLocks[tokenId.toString()];
        finalLock.attachedGaugeAddress = gaugeAttached;
        finalLock.attachedAmmAddress = GAUGES[gaugeAttached].ammAddress;
        finalLock.attachedTokenASymbol = GAUGES[gaugeAttached].tokenOneSymbol;
        finalLock.attachedTokenBSymbol = GAUGES[gaugeAttached].tokenTwoSymbol;
      }
      finalVeNFTData.push(finalLock);
    }
    finalVeNFTData.sort(
      (a, b) => a.locksState - b.locksState || b.tokenId.minus(a.tokenId).toNumber()
    );
    return {
      success: true,
      allLocksData: finalVeNFTData,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allLocksData: [],
      error: error.message,
    };
  }
};

// Pools
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
          boostValue: boostValue.isFinite() ? boostValue : new BigNumber(0),
        });
      }
    }
    
    return {
      success: true,
      gaugeEmissionsTotal: plyEmmissonsTotal,
      poolsRewardsData: poolsData,
      gaugeAddresses,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      gaugeEmissionsTotal: new BigNumber(0),
      poolsRewardsData: [],
      gaugeAddresses: [],
      error: error.message,
    };
  }
};




//Locks
export const getAllLocksRewardsData = async (
  userTezosAddress: string,
  tokenPrices: ITokenPriceList
): Promise<IAllLocksRewardsResponse> => {
  try {
    if (!userTezosAddress || Object.keys(tokenPrices).length === 0) {
      throw new Error("Invalid or empty arguments.");
    }
    const state = store.getState();
    const AMM = state.config.AMMs;
    const TOKENS = state.config.tokens;
    const allLocksRewardsData: IAllLocksRewardsData = {};
    let totalTradingFeesAmount = new BigNumber(0);
    let totalBribesAmount = new BigNumber(0);

    const locksIndexerResponse = await axios.get(
      `${Config.VE_INDEXER}votes?address=${userTezosAddress}`
    );
    const locksIndexerData: IAllLocksRewardsIndexerData[] = locksIndexerResponse.data;
    for (const lockData of locksIndexerData) {
      // console.log(lockData);
      const locksRewardsTokenData: ILocksRewardsTokenData = {};
      for (const voteData of lockData.votesUnclaimed) {
        if (!locksRewardsTokenData[voteData.epoch]) {
          locksRewardsTokenData[voteData.epoch] = [];
        }
        const amm = AMM[voteData.amm];
        const bribesValueAndData: IBribesValueAndData = getBribesData(
          voteData.bribes,
          tokenPrices,
          TOKENS
        );
        const feesValueAndData: IFeesValueAndData = getFeesData(
          voteData.fee,
          voteData.feeClaimed,
          tokenPrices,
          amm,
          TOKENS
        );
        totalTradingFeesAmount = totalTradingFeesAmount.plus(feesValueAndData.feesAmount);
        totalBribesAmount = totalBribesAmount.plus(bribesValueAndData.bribesValue);
        
        const locksRewardsEpochData: ILockRewardsEpochData = {
          ammAddress: voteData.amm,
          tokenASymbol: amm.token1.symbol,
          tokenBSymbol: amm.token2.symbol,
          ammType: amm.type,
          votes: new BigNumber(voteData.votes).dividedBy(PLY_DECIMAL_MULTIPLIER),
          votesPercentage: new BigNumber(voteData.voteShare),
          bribesAmount: bribesValueAndData.bribesValue,
          bribesData: bribesValueAndData.bribesData,
          feesStatus: feesValueAndData.feesStatus,
          feesAmount: feesValueAndData.feesAmount,
          feesData: feesValueAndData.feesData,
        };
        locksRewardsTokenData[voteData.epoch].push(locksRewardsEpochData);
        console.log(voteData);
      }
      allLocksRewardsData[lockData.lockId] = locksRewardsTokenData;
    }
    console.log(allLocksRewardsData);
    console.log(totalTradingFeesAmount.toString(), totalBribesAmount.toString());
    // console.log(locksIndexerData);
    return {
      allLocksRewardsData,
      totalTradingFeesAmount,
      totalBribesAmount,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

//Locks
const getBribesData = (
  bribes: IBribeIndexer[],
  tokenPrices: ITokenPriceList,
  TOKENS: ITokens
): IBribesValueAndData => {
  try {
    let bribesValue = new BigNumber(0);
    const bribesData: ILockRewardsBribeData[] = [];
    for (const bribeData of bribes) {
      const value = new BigNumber(bribeData.value).dividedBy(
        new BigNumber(10).pow(TOKENS[bribeData.name].decimals)
      );
      const amount = value.multipliedBy(tokenPrices[bribeData.name]);
      bribesValue = bribesValue.plus(amount);
      bribesData.push({
        bribeId: new BigNumber(bribeData.bribeId),
        bribeValue: value,
        tokenSymbol: bribeData.name,
      });
    }
    return {
      bribesValue,
      bribesData,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

//Locks
const getFeesData = (
  feeData: IFeeIndexer,
  feeClaimed: boolean,
  tokenPrices: ITokenPriceList,
  AMM: IAMM,
  TOKENS: ITokens
): IFeesValueAndData => {
  try {
    const token1Symbol = feeData.token1Symbol;
    const token2Symbol = feeData.token2Symbol;
    const tokenOneDecimal = new BigNumber(10).pow(
      TOKENS[token1Symbol] ? TOKENS[token1Symbol].decimals : 0
    );
    const tokenTwoDecimal = new BigNumber(10).pow(
      TOKENS[token2Symbol] ? TOKENS[token2Symbol].decimals : 0
    );

    const tokenOneFeeValue = new BigNumber(feeData.token1Fee).dividedBy(tokenOneDecimal);
    const tokenTwoFeeValue = new BigNumber(feeData.token2Fee).dividedBy(tokenTwoDecimal);
    const feesOneAmount = tokenOneFeeValue.multipliedBy(tokenPrices[token1Symbol] || 0);
    const feesTwoAmount = tokenTwoFeeValue.multipliedBy(tokenPrices[token2Symbol] || 0);
    const tokenAFees = token1Symbol === AMM.token1.symbol ? tokenOneFeeValue : tokenTwoFeeValue;
    const tokenBFees = token1Symbol === AMM.token2.symbol ? tokenOneFeeValue : tokenTwoFeeValue;

    const feesStatus = feeClaimed
      ? EFeesStatus.CLAIMED
      : token1Symbol === "" && token2Symbol === ""
      ? EFeesStatus.NOT_PULLED
      : EFeesStatus.GENERATED;
    const feesAmount = feesOneAmount.plus(feesTwoAmount);
    const feesData: ILockRewardsFeeData = { tokenAFees, tokenBFees };
    return {
      feesStatus,
      feesAmount,
      feesData,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};




//Locks
export const getAllRewardsOperationsData = async (
  userTezosAddress: string
): Promise<IAllRewardsOperationsData> => {
  try {
    if (!userTezosAddress) {
      throw new Error("Invalid or empty arguments.");
    }
    const allEpochClaimOperationData: IAllEpochClaimOperationData = {};
    const allBribesClaimData: IAllBribesOperationData[] = [];
    const allFeesClaimData: IAllFeesOperationData[] = [];

    const locksIndexerResponse = await axios.get(
      `${Config.VE_INDEXER}votes?address=${userTezosAddress}`
    );
    const locksIndexerData: IAllLocksRewardsIndexerData[] = locksIndexerResponse.data;
    
    for (const lockData of locksIndexerData) {
      // console.log(lockData);
      const tokenId = lockData.lockId;
      const allEpochClaimTokenData: IAllEpochClaimTokenData = {};
      const allFeesOperationData: IAllFeesOperationData = {
        tokenId: Number(tokenId),
        amms: {},
      };
      for (const voteData of lockData.votesUnclaimed) {
        const epochNumber = voteData.epoch;
        if(!allEpochClaimTokenData[epochNumber]) {
          allEpochClaimTokenData[epochNumber] = {
            tokenId: Number(tokenId),
            epoch: Number(epochNumber),
            bribeData: [],
            feeData: [],
          }
        }
        if(!allFeesOperationData.amms[voteData.amm]) {
          allFeesOperationData.amms[voteData.amm] = [];
        }
        if (isFeeClaimable(voteData)) {
          allEpochClaimTokenData[epochNumber].feeData.push(voteData.amm);
          allFeesOperationData.amms[voteData.amm].push(Number(epochNumber));
        }
        for(const bribe of voteData.bribes) {
          const bribeId = Number(bribe.bribeId);
          const amm = bribe.amm;
          allEpochClaimTokenData[epochNumber].bribeData.push({
            bribeId,
            amm,
          });
          allBribesClaimData.push({
            tokenId: Number(tokenId),
            epoch: Number(epochNumber),
            bribeId,
            amm,
          });
        }
      }
      allEpochClaimOperationData[tokenId] = allEpochClaimTokenData;
      allFeesClaimData.push(allFeesOperationData);
    }
    //Filter out those epoch data which has both empty fee data and bribe data
    const claimableEpochData = filterEmptyEpochClaimData(allEpochClaimOperationData);
    //Format the data structure as well as filter out empty data
    const claimableFeesData = createClaimAllFeeData(allFeesClaimData);
    console.log(allEpochClaimOperationData);
    console.log(claimableEpochData);
    console.log(allBribesClaimData);
    console.log(allFeesClaimData);
    console.log(claimableFeesData);
    
    
    return {
      epochClaimData: claimableEpochData,
      feesClaimData: claimableFeesData,
      bribesClaimData: allBribesClaimData,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

//Locks
const isFeeClaimable = (voteData: IVotesUnclaimedIndexer): boolean => {
  if (
    !voteData.feeClaimed &&
    voteData.fee.token1Symbol !== "" &&
    voteData.fee.token2Symbol !== "" &&
    new BigNumber(voteData.fee.token1Fee).isGreaterThan(0) &&
    new BigNumber(voteData.fee.token2Fee).isGreaterThan(0)
  ) {
    return true;
  } else {
    return false;
  }
};

//Locks
const createClaimAllFeeData = (
  allFeesClaimData: IAllFeesOperationData[]
): IAllClaimableFeesData[] => {
  const claimableFeesData: IAllClaimableFeesData[] = [];
  allFeesClaimData.forEach((feeData) => {
    Object.keys(feeData.amms).forEach((ammData) => {
      if (feeData.amms[ammData].length !== 0) {
        claimableFeesData.push({
          tokenId: feeData.tokenId,
          amm: ammData,
          epoch: feeData.amms[ammData],
        });
      }
    });
  });
  return claimableFeesData;
};

//Locks
const filterEmptyEpochClaimData = (
  allEpochClaimOperationData: IAllEpochClaimOperationData
): IAllEpochClaimOperationData => {
  const claimableEpochData: IAllEpochClaimOperationData = {};
  Object.keys(allEpochClaimOperationData).forEach((tokenId) => {
    Object.keys(allEpochClaimOperationData[tokenId]).forEach((epoch) => {
      const epochData = allEpochClaimOperationData[tokenId][epoch];
      if (epochData.bribeData.length !== 0 || epochData.feeData.length !== 0) {
        if(!claimableEpochData[tokenId]){
          claimableEpochData[tokenId] = {};
        }
        claimableEpochData[tokenId][epoch] = epochData;
      }
    });
  });
  return claimableEpochData;
};
