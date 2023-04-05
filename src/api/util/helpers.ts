import { BigNumber } from "bignumber.js";

import fallback from "../../assets/icon/pools/fallback.png";
import { tokenParameterLiquidity } from "../../components/Liquidity/types";

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

export const tokenChange = (
  topLevelSelectedToken: tokenParameterLiquidity,
  tokenA: tokenParameterLiquidity,
  tokenB: tokenParameterLiquidity
) => (topLevelSelectedToken.symbol === tokenA.symbol ? tokenA : tokenB);

export const tokenChangeB = (
  topLevelSelectedToken: tokenParameterLiquidity,
  tokenA: tokenParameterLiquidity,
  tokenB: tokenParameterLiquidity
) => (topLevelSelectedToken.symbol === tokenA.symbol ? tokenB : tokenA);

export default function nFormatter(num: BigNumber) {
  if (num.isGreaterThanOrEqualTo(1000000000)) {
    return num.dividedBy(1000000000).toFixed(2) + "b";
  }
  if (num.isGreaterThanOrEqualTo(1000000)) {
    return num.dividedBy(1000000).toFixed(2) + "m";
  }
  if (num.isGreaterThanOrEqualTo(1000)) {
    return num.dividedBy(1000).toFixed(2) + "k";
  }

  return num.toFixed(2);
}

export function nFormatterWithLesserNumber(num: BigNumber) {
  if (num.isGreaterThan(0)) {
    if (num.isLessThan(0.01)) {
      return "<0.01";
    }
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "b";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "m";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "k";
    }
    return num.toFixed(2);
  } else {
    return 0;
  }
}
export const changeSource = (e: any) => {
  e.target.src = { fallback };
  e.onerror = null;
};
export function imageExists(image_url: string) {
  var http = new XMLHttpRequest();

  http.open("HEAD", image_url, false);
  http.send();

  return http.status != 404;
}
