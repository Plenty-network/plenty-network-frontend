import { useState } from 'react';
import ctez from '../assets/Tokens/ctez.png';
import { tokenParameter } from '../constants/swap';

export const useLocationStateInSwap = () => {
  const [tokenIn, setTokenIn] = useState({
    name: 'ctez',
    image: ctez,
  });

  const [tokenOut, setTokenOut] = useState({} as tokenParameter);

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
