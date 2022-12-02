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

export const tEZorCTEZtoUppercase = (a: string) =>
  a.trim().toLowerCase() === "xtz"
    ? "TEZ"
    : a.trim().toLowerCase() === "ctez"
    ? a.toUpperCase()
    : a;

export default function nFormatter(num: BigNumber) {
  if (num.isGreaterThanOrEqualTo(1000000000)) {
    return num.dividedBy(1000000000).toFixed(2) + "B";
  }
  if (num.isGreaterThanOrEqualTo(1000000)) {
    return num.dividedBy(1000000).toFixed(2) + "M";
  }
  if (num.isGreaterThanOrEqualTo(1000)) {
    return num.dividedBy(1000).toFixed(2) + "K";
  }

  return num.toFixed(2);
}
