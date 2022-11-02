import { useState, useEffect, useMemo } from "react";
import ctez from "../assets/Tokens/ctez.png";
import { tokenParameter } from "../constants/swap";
import { useRouter } from "next/router";
import { useAppSelector } from "../redux";
import { Chain } from "../config/types";

export const useLocationStateInSwap = () => {
  const tokens = useAppSelector((state) => state.config.standard);
  const tokensArray = Object.entries(tokens);
  const router = useRouter();
  const [tokenIn, setTokenIn] = useState<tokenParameter>({
    name: "ctez",
    image: ctez,
  });

  const [tokenOut, setTokenOut] = useState({} as tokenParameter);

  useEffect(() => {
    console.log("ishu1", tokenIn, tokenOut);
    if (tokenIn.name === router.query.from && tokenOut.name === router.query.to) {
      return;
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          from: tokenIn && tokenIn.name ? tokenIn.name : null,
          ...(tokenOut.name
            ? {
                to: tokenOut.name,
              }
            : {}),
        },
      },
      undefined,
      { shallow: true }
    );
  }, [tokenIn, tokenOut]);
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
    console.log("ishu2", tokenInFromParam, tokenOutFromParam);
    if (tokenInFromParam) {
      const tokenInDatum = tokensListConfig.find((token) => token.name === tokenInFromParam);

      if (tokenInDatum) {
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    }
    console.log("ishu3", tokenIn);
    if (tokenOutFromParam) {
      const tokenOutDatum = tokensListConfig.find((token) => token.name === tokenOutFromParam);

      if (tokenOutDatum) {
        setTokenOut({
          name: tokenOutDatum.name,
          image: tokenOutDatum.image,
        });
      }
      console.log("ishu4", tokenOut);
    }
  }, [router.query.to, router.query.from]);

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
