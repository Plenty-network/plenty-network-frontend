import { useState, useEffect, useMemo } from 'react';
import ctez from '../assets/Tokens/ctez.png';
import { tokenParameter } from '../constants/swap';
import { useRouter } from 'next/router';
import { useAppSelector } from '../redux';
import { Chain } from '../config/types';
import { tokenParameterLiquidity } from '../components/Liquidity/types';

export const useLocationStateInLiquidity = () => {
  const tokens = useAppSelector((state) => state.config.standard);
  const tokensArray = Object.entries(tokens);
  const router = useRouter();
  // const [tokenIn, setTokenIn] = useState<tokenParameterLiquidity>({
  //   name: 'ctez',
  //   image: ctez,
  //   symbol: 'ctez',
  // });

  // const [tokenOut, setTokenOut] = useState<tokenParameterLiquidity>({
  //   name: 'tez',
  //   image: ctez,
  //   symbol: 'tez',
  // });
  const [tokenIn, setTokenIn] = useState<tokenParameterLiquidity>({
    name: 'USDC.e',
    image: ctez,
    symbol: 'USDC.e',
  });

  const [tokenOut, setTokenOut] = useState<tokenParameterLiquidity>({
    name: 'USDT.e',
    image: ctez,
    symbol: 'USDT.e',
  });

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
