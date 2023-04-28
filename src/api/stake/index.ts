import { BigNumber } from "bignumber.js";
import axios from "axios";
import { connectedNetwork, dappClient } from "../../common/walletconnect";
import Config from "../../config/config";
import { store } from "../../redux";
import { gaugeStorageType } from "../rewards/data";
import { getStakedBalance } from "../util/balance";
import { getDexAddress } from "../util/fetchConfig";
import { getStorage, getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { IStakedData, IStakedDataResponse, IVePLYData, IVePLYListResponse } from "./types";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import { ELocksState } from "../votes/types";

/**
 * Returns the list of veNFTs with boost value for a user, for a particular gauge.
 * @param tokenOneSymbol - Symbol of the first token of the selected pair
 * @param tokenTwoSymbol - Symbol of the second token of the selected pair
 * @param userStakeInput - Amount of PNLP token the user wants to stake(input)
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getVePLYListForUser = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userStakeInput: string | undefined,
  userTezosAddress: string
): Promise<IVePLYListResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;

    const locksResponse = await axios.get(
      `${Config.VE_INDEXER[connectedNetwork]}locks?address=${userTezosAddress}`
    );

    if (locksResponse.data.result.length === 0) {
      return {
        success: true,
        vePLYData: [],
      };
    }

    const locksData = locksResponse.data.result.filter(
      (lock: any) => !lock.attached
    ); // Filter the tokens for not attached ones.

    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === 'false') {
      throw new Error('AMM does not exist for the selected pair.');
    }
    const pnlpTokenDecimals = AMM[dexContractAddress].lpToken.decimals;
    const gaugeAddress: string | undefined =
      AMM[dexContractAddress].gauge;
    if (gaugeAddress === undefined) {
      throw new Error('Gauge does not exist for the selected pair.');
    }
    const gaugeStorage = await getStorage(gaugeAddress, gaugeStorageType);

    const totalSupply = new BigNumber(gaugeStorage.total_supply).dividedBy(
      new BigNumber(10).pow(pnlpTokenDecimals)
    );
    const userStakedBalance = new BigNumber(
      (
        await getStakedBalance(tokenOneSymbol, tokenTwoSymbol, userTezosAddress)
      ).balance
    );
    const finalUserStakedBalance = new BigNumber(userStakeInput || 0).plus(
      userStakedBalance
    );
    const finalTotalSupply = new BigNumber(userStakeInput || 0).plus(
      totalSupply
    );

    const totalVotingPower = state.pools.totalVotingPower; // Fetch the total voting power stored in redux store

    const currentTimestamp: BigNumber = new BigNumber(Date.now())
      .dividedBy(1000)
      .decimalPlaces(0, 1);

    const finalVePLYData: IVePLYData[] = [];

    locksData.forEach((lock: any) => {
      const lockEndTimestamp = new BigNumber(lock.endTs);
      const votingPower = new BigNumber(lock.currentVotingPower).dividedBy(PLY_DECIMAL_MULTIPLIER);
      const boostedValue = getBoostValue(
        finalUserStakedBalance,
        finalTotalSupply,
        votingPower,
        totalVotingPower
      );
      if(boostedValue.isGreaterThan(0)) {
        const updatedLockData = {
          tokenId: lock.id,
          boostValue: boostedValue.toFixed(1),
          votingPower: votingPower.toString(),
          lockState: currentTimestamp.isGreaterThan(lockEndTimestamp) ? ELocksState.EXPIRED : ELocksState.AVAILABLE
        };
        finalVePLYData.push(updatedLockData);
      }
    });
    if(finalVePLYData.length > 0) {
      // finalVePLYData.sort(compareVePLYData);
      finalVePLYData.sort(
        (a, b) => a.lockState - b.lockState || new BigNumber(b.boostValue).minus(new BigNumber(a.boostValue)).toNumber()
      );
    }
    return {
      success: true,
      vePLYData: finalVePLYData,
    };
  } catch (error: any) {
    return {
      success: false,
      vePLYData: [],
      error: error.message,
    };
  }
};

/**
 * Fetch the total voting power for the current timestamp.
 */
export const fetchTotalVotingPower = async (): Promise<BigNumber> => {
  try {
    const voteEscrowAddress = Config.VOTE_ESCROW[connectedNetwork];
    const Tezos = await dappClient().tezos();
    const voteEscrowInstance = await Tezos.contract.at(voteEscrowAddress);
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    
    const totalVotingPower = await voteEscrowInstance.contractViews
      .get_total_voting_power({ time: 0, ts: currentTimestamp })
      .executeView({ viewCaller: voteEscrowAddress });
    
    return totalVotingPower.dividedBy(PLY_DECIMAL_MULTIPLIER);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Returns the staked detals for a pool, if it's boosted or not and the respective attached lock.
 * @param tokenOneSymbol - Symbol of the first token of the pair of selected pool
 * @param tokenTwoSymbol - Symbol of the second token of the pair of selected pool
 * @param userTezosAddress - Tezos wallet address of the user
 * @param ammAddress - Contract address of the selected pool(optional)
 */
export const getStakedData = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  ammAddress?: string
): Promise<IStakedDataResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = ammAddress || getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const pnlpTokenDecimals = AMM[dexContractAddress].lpToken.decimals;
    const gaugeAddress: string | undefined = AMM[dexContractAddress].gauge;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }

    const gaugeStorage = await getTzktStorageData(gaugeAddress);
    const gaugeStorageData = gaugeStorage.data;
    const balancesBigMapId = new BigNumber(gaugeStorageData.balances).toString();
    const derivedBalancesBigMapId = new BigNumber(gaugeStorageData.derived_balances).toString();
    const attachedTokensBigMapId = new BigNumber(gaugeStorageData.attached_tokens).toString();

    let stakedBalance = new BigNumber(0);
    let derivedBalance = new BigNumber(0);
    let isBoosted = false;
    let boostedLockId = new BigNumber(0);
    // Fetch the staked balance for the user
    const balancesResponse = await getTzktBigMapData(
      balancesBigMapId,
      `select=key,value&key=${userTezosAddress}&active=true`
    );
    if (balancesResponse.data.length !== 0) {
      stakedBalance = new BigNumber(balancesResponse.data[0].value);
    }
    // Fetch the derived balance for the user
    const derivedBalancesResponse = await getTzktBigMapData(
      derivedBalancesBigMapId,
      `select=key,value&key=${userTezosAddress}&active=true`
    );
    if (derivedBalancesResponse.data.length !== 0) {
      derivedBalance = new BigNumber(derivedBalancesResponse.data[0].value);
    }
    // Fetch the attched lock for the gauge for the user if any
    const attachedTokensResponse = await getTzktBigMapData(
      attachedTokensBigMapId,
      `select=key,value&key=${userTezosAddress}&active=true`
    );
    if (attachedTokensResponse.data.length !== 0) {
      if (Object.keys(attachedTokensResponse.data[0]).length !== 0) {
        isBoosted = true;
        boostedLockId = new BigNumber(attachedTokensResponse.data[0].value);
      }
    }
    // Calculate the base balance required for calculating boost value
    const baseBalance = stakedBalance.multipliedBy(40).dividedBy(100);
    const boostValue = derivedBalance.dividedBy(baseBalance);

    const stakedData: IStakedData = {
      isBoosted,
      boostedLockId,
      boostValue: boostValue.isFinite() ? boostValue.toFixed(1) : "0.0", // checking if boost value is a finite number which it is not in case of 0 stake
      stakedBalance: stakedBalance.dividedBy(new BigNumber(10).pow(pnlpTokenDecimals)),
      gaugeAddress,
      dexContractAddress,
    };

    return {
      success: true,
      stakedData,
    };
  } catch (error: any) {
    console.log(error.message);
    const stakedData: IStakedData = {
      isBoosted: false,
      boostedLockId: new BigNumber(0),
      boostValue: "0.0",
      stakedBalance: new BigNumber(0),
      gaugeAddress: "",
      dexContractAddress: "",
    };
    return {
      success: false,
      stakedData,
      error: error.message,
    };
  }
};

/**
 * Calulate the boost value for the selected veNFT.
 * @param userStakedBalance - The final balance calculated by adding the user input to staked balance in storage
 * @param totalSupply - The final total supply calculated by adding the user input to the total supply in storage
 * @param tokenVotingPower - Voting power of selected veNFT received from indexer api
 * @param totalVotingPower - Total voting power for the current timestamp
 */
const getBoostValue = (
  userStakedBalance: BigNumber,
  totalSupply: BigNumber,
  tokenVotingPower: BigNumber,
  totalVotingPower: BigNumber
): BigNumber => {
  try {
    const markUp = totalSupply
      .multipliedBy(tokenVotingPower)
      .dividedBy(totalVotingPower)
      .multipliedBy(60)
      .dividedBy(100);
    const baseBalance = userStakedBalance.multipliedBy(40).dividedBy(100);
    const derivedBalance = BigNumber.minimum(
      baseBalance.plus(markUp),
      userStakedBalance
    );
    const boostValue = derivedBalance.dividedBy(baseBalance);
    return boostValue.isFinite() ? boostValue : new BigNumber(0);
  } catch (error: any) {
    throw new Error(error.message);
  }
};


/**
 * Function used as a callback for sorting the vePLY data in descending order of the boost value.
 */
 const compareVePLYData = (
  valueOne: IVePLYData,
  valueTwo: IVePLYData
): number => {
  if (new BigNumber(valueOne.boostValue).isGreaterThan(new BigNumber(valueTwo.boostValue))) {
    return -1;
  } else if (new BigNumber(valueOne.boostValue).isLessThan(new BigNumber(valueTwo.boostValue))) {
    return 1;
  } else {
    return 0;
  }
};
