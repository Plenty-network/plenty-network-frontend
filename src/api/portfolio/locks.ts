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
  IVotesUnclaimedIndexer,
  IAllBribesOperationData,
  IAllFeesOperationData,
  IAllClaimableFeesData,
  IAllRewardsOperationsData,
  IClaimInflationOperationData,
  IUnclaimedRewardsForLockData,
} from "./types";
import { store } from "../../redux";
import { ITokenPriceList } from "../util/types";
import { ELocksState } from "../votes/types";
import { voteEscrowAddress } from "../../common/walletconnect";
import { getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { IConfigPool, IConfigTokens } from "../../config/types";


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

    let lockIdsString: string = "";
    let lockIds: string[] = [];
    if(locksData.length > 0) {
      lockIds = locksData.map((lock: any) => lock.id);
      lockIdsString = lockIds.join(",");
    }
    const attachedLocksResponse = await getTzktBigMapData(
      attachedLocksBigMapId,
      `active=true${
        lockIds.length > 0
          ? lockIds.length === 1
            ? `&key=${lockIdsString}`
            : `&key.in=${lockIdsString}`
          : ""
      }&select=key,value`
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
      const nextEpochVotingPower = new BigNumber(lock.nextEpochVotingPower).dividedBy(
        PLY_DECIMAL_MULTIPLIER
      );
      const lockEndTimestamp = new BigNumber(lock.endTs);
      const attached = Boolean(lock.attached);
      const finalLock: IAllLocksPositionData = {
        tokenId,
        baseValue: new BigNumber(lock.baseValue).dividedBy(PLY_DECIMAL_MULTIPLIER),
        votingPower: availableVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        epochVotingPower: epochVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        consumedVotingPower: consumedVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER),
        currentVotingPower,
        nextEpochVotingPower,
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
          // finalLock.votingPower = availableVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER);
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
      // TODO: Remove next if on redeployment
      if(attachedLocks[tokenId.toString()] === "KT19zYN4twVndWprTXhU8G48Sxom8JMZqc1F") {
        finalLock.attached = false;
      }
      // TODO: Remove above if on redeployment

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


/**
 * Returns the rewards data for all the locks owned by a user.
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenPrices - Object of prices of all standard tokens
 */
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
        if (isFeeClaimable(voteData) || voteData.bribes.length !== 0) {
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
        }
      }
      allLocksRewardsData[lockData.lockId] = locksRewardsTokenData;
    }
    
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


/**
 * Returns the required bribes data (sum of individual bribes in $ and list of individual bribes) for an amm in an epoch.
 * @param bribes - List of bribes for an amm in an epoch
 * @param tokenPrices - Object of prices of all standard tokens
 * @param TOKENS - List of all tokens from config
 */
const getBribesData = (
  bribes: IBribeIndexer[],
  tokenPrices: ITokenPriceList,
  TOKENS: IConfigTokens
): IBribesValueAndData => {
  try {
    let bribesValue = new BigNumber(0);
    const bribesData: ILockRewardsBribeData[] = [];
    for (const bribeData of bribes) {
      const value = new BigNumber(bribeData.value).dividedBy(
        new BigNumber(10).pow(TOKENS[bribeData.name].decimals)
      );
      const amount = value.multipliedBy(tokenPrices[bribeData.name] || 0);
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


/**
 * Returns the modified fee data as required (value in $) for an amm in an epoch.
 * @param feeData - Fee data for a pool in an epoch
 * @param feeClaimed - Status of fee
 * @param tokenPrices - Object of prices of all standard tokens
 * @param AMM - List of all amm from config
 * @param TOKENS - List of all tokens from config
 */
const getFeesData = (
  feeData: IFeeIndexer,
  feeClaimed: boolean,
  tokenPrices: ITokenPriceList,
  AMM: IConfigPool,
  TOKENS: IConfigTokens
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
    const feesAmount =
      feesStatus === EFeesStatus.CLAIMED ? new BigNumber(0) : feesOneAmount.plus(feesTwoAmount);
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


/**
 * Returns the data required for all operations related to user rewards.
 * @param userTezosAddress - Tezos wallet address of the user
 */
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
        if (!allEpochClaimTokenData[epochNumber]) {
          allEpochClaimTokenData[epochNumber] = {
            tokenId: Number(tokenId),
            epoch: Number(epochNumber),
            bribeData: [],
            feeData: [],
          };
        }
        if (!allFeesOperationData.amms[voteData.amm]) {
          allFeesOperationData.amms[voteData.amm] = [];
        }
        if (isFeeClaimable(voteData)) {
          allEpochClaimTokenData[epochNumber].feeData.push(voteData.amm);
          allFeesOperationData.amms[voteData.amm].push(Number(epochNumber));
        }
        for (const bribe of voteData.bribes) {
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


/**
 * Checks if the fee is claimable or not.
 * @param voteData - Data from indexer related to unclaimed votes.
 */
const isFeeClaimable = (voteData: IVotesUnclaimedIndexer): boolean => {
  if (
    !voteData.feeClaimed &&
    voteData.fee.token1Symbol !== "" &&
    voteData.fee.token2Symbol !== "" &&
    (new BigNumber(voteData.fee.token1Fee).isGreaterThan(0) ||
      new BigNumber(voteData.fee.token2Fee).isGreaterThan(0))
  ) {
    return true;
  } else {
    return false;
  }
};


/**
 * Filters the claimable fees data for 0 values and returns the list in modified format required for operation.
 * @param allFeesClaimData - Claimable fees data list
 */
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


/**
 * Filters the claimable epoch data and returns the list in modified format for operation.
 * @param allEpochClaimOperationData - Claimable epoch wise data for all locks and all epochs.
 * @returns 
 */
const filterEmptyEpochClaimData = (
  allEpochClaimOperationData: IAllEpochClaimOperationData
): IAllEpochClaimOperationData => {
  const claimableEpochData: IAllEpochClaimOperationData = {};
  Object.keys(allEpochClaimOperationData).forEach((tokenId) => {
    Object.keys(allEpochClaimOperationData[tokenId]).forEach((epoch) => {
      const epochData = allEpochClaimOperationData[tokenId][epoch];
      if (epochData.bribeData.length !== 0 || epochData.feeData.length !== 0) {
        if (!claimableEpochData[tokenId]) {
          claimableEpochData[tokenId] = {};
        }
        claimableEpochData[tokenId][epoch] = epochData;
      }
    });
  });
  return claimableEpochData;
};


/**
 * Returns all the unclaimed data for all the lock selected.
 * @param tokenId - Lock ID of the lock to be withdrawn or checked for unclaimed rewards
 */
export const getUnclaimedRewardsForLock = (tokenId: number): IUnclaimedRewardsForLockData => {
  try {
    const state = store.getState();
    const allLocksRewardsData = state.portfolioRewards.allLocksRewardsData;
    const epochClaimData = state.portfolioRewards.epochClaimData;
    const feesClaimData = state.portfolioRewards.feesClaimData;
    const bribesClaimData = state.portfolioRewards.bribesClaimData;
    const allLocksInflationData = state.portfolioRewards.allLocksInflationData;
    const inflationOpertionData = state.portfolioRewards.claimAllInflationData;

    let unclaimedFeeBribeExist: boolean = false;
    let unclaimedInflationExist: boolean = false;
    let lockFeesClaimData: IAllClaimableFeesData[] = [];
    let lockBribesClaimData: IAllBribesOperationData[] = [];
    let lockInflationClaimData: IClaimInflationOperationData[] = [];
    let unclaimedFeesValue: BigNumber = new BigNumber(0);
    let unclaimedBribesValue: BigNumber = new BigNumber(0);
    let unclaimedInflationValue: BigNumber = new BigNumber(0);
    let unclaimedInflationInPLY: BigNumber = new BigNumber(0);

    if (
      epochClaimData[tokenId.toString()] &&
      Object.keys(epochClaimData[tokenId.toString()]).length !== 0
    ) {
      unclaimedFeeBribeExist = true;
      const lockData = allLocksRewardsData[tokenId.toString()];
      for (const epoch of Object.keys(lockData)) {
        lockData[epoch].forEach((epochData) => {
          unclaimedFeesValue = unclaimedFeesValue.plus(epochData.feesAmount);
          unclaimedBribesValue = unclaimedBribesValue.plus(epochData.bribesAmount);
        });
      }
      lockFeesClaimData = feesClaimData.filter((feeData) => feeData.tokenId === tokenId);
      lockBribesClaimData = bribesClaimData.filter((bribeData) => bribeData.tokenId === tokenId);
    }
    if (
      allLocksInflationData[tokenId.toString()] &&
      Object.keys(allLocksInflationData[tokenId.toString()]).length !== 0
    ) {
      unclaimedInflationExist = true;
      const lockData = allLocksInflationData[tokenId.toString()];
      for (const epochData of lockData) {
        unclaimedInflationValue = unclaimedInflationValue.plus(epochData.inflationValue);
        unclaimedInflationInPLY = unclaimedInflationInPLY.plus(epochData.inflationInPly);
      }
      lockInflationClaimData = inflationOpertionData.filter(
        (inflationData) => inflationData.tokenId === tokenId
      );
    }

    const unclaimedRewardsExist = unclaimedFeeBribeExist || unclaimedInflationExist;
    return {
      success: true,
      unclaimedRewardsExist,
      lockRewardsData: {
        unclaimedFeesValue,
        unclaimedBribesValue,
        unclaimedInflationValue,
        unclaimedInflationInPLY,
      },
      lockRewardsOperationData: {
        lockFeesClaimData,
        lockBribesClaimData,
        lockInflationClaimData,
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      unclaimedRewardsExist: false,
      lockRewardsData: {
        unclaimedFeesValue: new BigNumber(0),
        unclaimedBribesValue: new BigNumber(0),
        unclaimedInflationValue: new BigNumber(0),
        unclaimedInflationInPLY: new BigNumber(0),
      },
      lockRewardsOperationData: {
        lockFeesClaimData: [],
        lockBribesClaimData: [],
        lockInflationClaimData: [],
      },
      error: error.message,
    };
  }
};
