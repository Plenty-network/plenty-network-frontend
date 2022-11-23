import { useState, useEffect, useMemo } from "react";
import ctez from "../assets/Tokens/ctez.png";
import { tokenParameter } from "../constants/swap";
import { useRouter } from "next/router";
import { useAppSelector } from "../redux";
import { Chain } from "../config/types";
import { tokenParameterLiquidity } from "../components/Liquidity/types";

export const useLocationStateInLiquidity = () => {
  const tokens = useAppSelector((state) => state.config.tokens);

  const [tokenIn, setTokenIn] = useState<tokenParameterLiquidity>({
    name: "tez",
    image: ctez,
    symbol: "tez",
  });

  const [tokenOut, setTokenOut] = useState<tokenParameterLiquidity>({
    name: "ctez",
    image: ctez,
    symbol: "ctez",
  });

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
