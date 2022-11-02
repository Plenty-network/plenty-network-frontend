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
  const [tokenIn, setTokenIn] = useState<tokenParameter>({} as tokenParameter);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,
      new: token[1].extras?.isNew as boolean,
      chainType: token[1].extras?.chain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);
  const [tokenOut, setTokenOut] = useState({} as tokenParameter);

  useEffect(() => {
    const tokenInFromParam = router.query.from;
    console.log("ishu991", router.query);
    if (tokenInFromParam) {
      console.log("ishu91", tokenInFromParam);
      const tokenInDatum = tokensListConfig.find((token) => token.name === tokenInFromParam);
      console.log("ishu101", tokenInDatum, tokensListConfig);

      if (tokenInDatum) {
        console.log("ishu221", tokenInDatum);
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    } else {
      console.log("ishu23", "cttez");
      setTokenIn({
        name: "ctez",
        image: ctez,
      });
    }
    console.log("ishu234", tokenIn);
  }, [router.query.from, tokensListConfig]);
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
  }, [router]);

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
