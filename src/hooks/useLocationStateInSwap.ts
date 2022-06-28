import { useState } from 'react';
import ctez from '../assets/Tokens/ctez.png';

export const useLocationStateInSwap = () => {
  const [tokenIn, setTokenIn] = useState({
    name: 'ctez',
    image: ctez,
  });

  const [tokenOut, setTokenOut] = useState({ name: 'PLENTY', image: ctez });
  // const [tokenOut, setTokenOut] = useState({
  //   name: 'false',
  // });

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
