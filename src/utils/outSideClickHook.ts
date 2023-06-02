import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { getRealPriceFromTick, getTickFromRealPrice } from "../api/v3/helper";

export function useOutsideClick(ref: any, callBack: Function) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export const calcrealPrice = (tick: number, tokenXSymbol: string, tokenYSymbol: string) => {
  const [realPrice, setRealPrice] = useState(0);

  getRealPriceFromTick(tick, tokenXSymbol, tokenYSymbol).then(function (result) {
    setRealPrice(result);
    return realPrice?.toFixed(6);
  });
  return realPrice?.toFixed(6);
};

export const calcTick = (price: BigNumber, tokenXSymbol: string, tokenYSymbol: string) => {
  const [tick, setTick] = useState(0);
  setTick(0);
  getTickFromRealPrice(price, tokenXSymbol, tokenYSymbol).then(function (result) {
    setTick(result);
    return tick.toString();
  });
  return tick.toString();
};
