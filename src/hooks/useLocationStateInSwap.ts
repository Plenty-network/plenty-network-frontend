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
  const { query } = useRouter();
  // console.log(
  //   "ishu0",
  //   router.asPath.indexOf("="),
  //   router.asPath.indexOf("&"),
  //   router.asPath.lastIndexOf("=")
  // );
  // const r = router.asPath.slice(
  //   router.asPath.indexOf("=") + 1,
  //   router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
  // );
  // const d = router.asPath.slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length);
  // console.log("ishu11", r, d);
  console.log("ishu100", router.asPath.indexOf("="));
  const [tokenIn, setTokenIn] = useState<tokenParameter>(
    router.asPath.indexOf("=") >= 0
      ? {
          name: router.asPath
            .slice(
              router.asPath.indexOf("=") + 1,
              router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
            )
            .toString(),
          image: `/assets/Tokens/${router.asPath
            .slice(
              router.asPath.indexOf("=") + 1,
              router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
            )
            .toString()}.png`,
        }
      : { name: "ctez", image: ctez }
  );

  const [tokenOut, setTokenOut] = useState({} as tokenParameter);
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
    if (Object.keys(router.query).length !== 0) {
      console.log("ishu30", router);
      console.log("ishu", tokenIn, tokenOut, router);
      if (tokenIn.name === router.query.from && tokenOut.name === router.query.to) {
        console.log("ishu2");
        return;
      }
    }
    {
      console.log("ishu22", tokenIn, tokenOut, router, query);
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
      console.log("ishu23", router);
    }
  }, [tokenIn.name, tokenOut.name]);
  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      console.log("ishu3", router);
      const tokenInFromParam = router.query.from;
      const tokenOutFromParam = router.query.to;

      if (tokenInFromParam) {
        const tokenInDatum = tokensListConfig.find((token) => token.name === tokenInFromParam);

        if (tokenInDatum) {
          console.log("ishu4", tokenInDatum);
          setTokenIn({
            name: tokenInDatum.name,
            image: tokenInDatum.image,
          });
        }
      }

      if (tokenOutFromParam) {
        const tokenOutDatum = tokensListConfig.find((token) => token.name === tokenOutFromParam);

        if (tokenOutDatum) {
          console.log("ishu5", tokenOutDatum);
          setTokenOut({
            name: tokenOutDatum.name,
            image: tokenOutDatum.image,
          });
        }
      }
      console.log("ishu6", tokenIn, tokenOut);
    }
  }, [router]);

  return {
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
