import { useState, useEffect, useMemo } from 'react';
import ctez from '../assets/Tokens/ctez.png';
import { tokenParameter } from '../constants/swap';
import { useRouter } from 'next/router';
import { useAppSelector } from '../redux';
import { Chain } from '../config/types';

export const useLocationStateInSwap = () => {
  const tokens = useAppSelector((state) => state.config.standard);
  const tokensArray = Object.entries(tokens);
  const router = useRouter();
  const [tokenIn, setTokenIn] = useState<tokenParameter>({
    name: 'ctez',
    image: ctez,
  });

  const [tokenOut, setTokenOut] = useState({} as tokenParameter);

  useEffect(() => {
    if (
      (tokenIn.name === 'tez'
        ? 'TEZ'
        : tokenIn.name === 'ctez'
        ? 'CTEZ'
        : tokenIn.name) === router.query.from &&
      (tokenOut.name === 'tez'
        ? 'TEZ'
        : tokenOut.name === 'ctez'
        ? 'CTEZ'
        : tokenOut.name) === router.query.to
    ) {
      return;
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          from:
            tokenIn && tokenIn.name
              ? tokenIn.name === 'tez'
                ? 'TEZ'
                : tokenIn.name === 'ctez'
                ? 'CTEZ'
                : tokenIn.name
              : null,
          ...(tokenOut.name
            ? {
                to:
                  tokenOut.name === 'tez'
                    ? 'TEZ'
                    : tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : tokenOut.name,
              }
            : {}),
        },
      },
      undefined,
      { shallow: true }
    );
  }, [tokenIn, tokenOut, router]);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,
      new: token[1].extras?.isNew as boolean,
      chainType: token[1].extras?.chain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);

  useEffect(() => {
    const tokenInFromParam = router.query.from;
    const tokenOutFromParam = router.query.to;

    if (tokenInFromParam) {
      const tokenInDatum = tokensListConfig.find(
        (token) => token.name === tokenInFromParam
      );

      if (tokenInDatum) {
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    }

    if (tokenOutFromParam) {
      const tokenOutDatum = tokensListConfig.find(
        (token) => token.name === tokenOutFromParam
      );

      if (tokenOutDatum) {
        setTokenOut({
          name: tokenOutDatum.name,
          image: tokenOutDatum.image,
        });
      }
    }
  }, [router]);

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
