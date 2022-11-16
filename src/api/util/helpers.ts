import { BigNumber } from "bignumber.js";

/**
 * Returns the percentage change from old number to new number
 * @param oldNumber - The previous number from which change happened
 * @param newNumber - The new number to which change happened
 */
export const percentageChange = (oldNumber: BigNumber, newNumber: BigNumber): BigNumber => {
  return oldNumber.isEqualTo(0) || newNumber.isEqualTo(0)
    ? new BigNumber(0)
    : newNumber.minus(oldNumber).dividedBy(oldNumber).multipliedBy(100);
};
