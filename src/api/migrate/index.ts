import { BigNumber } from "bignumber.js";
import { IMigrateExchange, IveResponse, IVestAndClaim } from "./types";
import { veSwapAddress } from "../../common/walletconnect";
import { getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { DAY, PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import { MigrateToken } from "../../config/types";
import Config from "../../config/config";

/**
 * Calculates the exchange amount and splits into claimable and vested
 * @param inputValue - User input value for Plenty / Wrap
 * @param token - PLENTY / WRAP
 */
export const getMigrateExchangeAmount = (
  inputValue: BigNumber,
  token: MigrateToken
): IMigrateExchange => {
  try {

    const exchangeRate = Config.EXCHANGE_TOKENS[token]
      ? new BigNumber(Config.EXCHANGE_TOKENS[token].exchangeRate)
      : new BigNumber(0);
    const tokenOutAmount = inputValue
      .multipliedBy(exchangeRate)
      .decimalPlaces(Config.EXCHANGE_TOKENS[token].tokenDecimals, 1);

    // 50% claimable and 50% vested
    const claimableAmount = tokenOutAmount
      .dividedBy(2)
      .decimalPlaces(Config.EXCHANGE_TOKENS[token].tokenDecimals, 1);
    const vestedAmount = tokenOutAmount
      .dividedBy(2)
      .decimalPlaces(Config.EXCHANGE_TOKENS[token].tokenDecimals, 1);

    return {
      success: true,
      claimableAmount,
      vestedAmount,
      exchangeRate,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      claimableAmount: new BigNumber(0),
      vestedAmount: new BigNumber(0),
      exchangeRate: new BigNumber(0),
    };
  }
};

/**
 * Calculates Claimable , Vested Amount and Time Left to next claim
 * @param userAddress - User Address
 */
export const getUserClaimAndVestAmount = async (userAddress: string): Promise<IVestAndClaim> => {
  try {

    const swapStorageResponse = await getTzktStorageData(veSwapAddress);
    const swapStorage = swapStorageResponse.data;
    const ledgerBigMap = swapStorage.ledger;

    const ledgerResponse = await getTzktBigMapData(
      ledgerBigMap,
      `key=${userAddress}&select=key,value`
    );

    const ledgerData = ledgerResponse.data[0].value;

    const date = new Date(ledgerData.last_claim);
    ledgerData.last_claim = Math.floor(date.getTime()/1000);

    const vested__ = BigNumber.min(
      new BigNumber(ledgerData.balance),
      (new BigNumber(ledgerData.release_rate).multipliedBy(new BigNumber((Math.floor(Date.now() / 1000))).minus(new BigNumber(ledgerData.last_claim))))
    );

    const claimableAmount = vested__.plus(new BigNumber(ledgerData.vested)).dividedBy(PLY_DECIMAL_MULTIPLIER);
    const vestedAmount = new BigNumber(new BigNumber(ledgerData.balance).minus(vested__)).dividedBy(
      PLY_DECIMAL_MULTIPLIER
    );

    const isClaimable = Math.floor(Date.now() / 1000) - ledgerData.last_claim > DAY ? true : false;
    const lastClaim = new BigNumber(ledgerData.last_claim);
    const nextClaim = new BigNumber(lastClaim).plus(DAY);

    return {
      success: true,
      isClaimable,
      claimableAmount,
      vestedAmount,
      lastClaim: lastClaim.multipliedBy(1000),
      nextClaim: nextClaim.multipliedBy(1000),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      isClaimable: false,
      claimableAmount: new BigNumber(0),
      vestedAmount: new BigNumber(0),
      lastClaim: new BigNumber(0),
      nextClaim: new BigNumber(0),
    };
  }
};
