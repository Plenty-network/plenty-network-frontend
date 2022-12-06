import { useState, useEffect, useMemo } from "react";
import ctez from "../assets/Tokens/ctez.png";
import { tokenParameter } from "../constants/swap";
import { useRouter } from "next/router";
import { useAppSelector } from "../redux";
import { Chain } from "../config/types";

export const useLocationStateInSwap = () => {
  const tokens = useAppSelector((state) => state.config.tokens);
  const tokensArray = Object.entries(tokens);
  const router = useRouter();
  const [tokenIn, setTokenIn] = useState<tokenParameter>(
    router.asPath.indexOf("=") >= 0
      ? router.asPath
          .slice(
            router.asPath.indexOf("=") + 1,
            router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
          )
          .toString() === ""
        ? ({} as tokenParameter)
        : {
            name: router.asPath
              .slice(
                router.asPath.indexOf("=") + 1,
                router.asPath.indexOf("&") === -1
                  ? router.asPath.length
                  : router.asPath.indexOf("&")
              )
              .toString(),
            image: `/assets/Tokens/${router.asPath
              .slice(
                router.asPath.indexOf("=") + 1,
                router.asPath.indexOf("&") === -1
                  ? router.asPath.length
                  : router.asPath.indexOf("&")
              )
              .toString()}.png`,
          }
      : { name: "CTez", image: ctez }
  );

  const [tokenOut, setTokenOut] = useState(
    router.asPath.indexOf("=") !== router.asPath.lastIndexOf("=") &&
      router.asPath.lastIndexOf("=") !== router.asPath.length - 1
      ? {
          name: router.asPath
            .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
            .toString(),
          image: `/assets/Tokens/${router.asPath
            .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
            .toString()}.png`,
        }
      : ({} as tokenParameter)
  );
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].name}.png`,

      chainType: token[1].originChain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);

  useEffect(() => {
    // if (tokenIn.name === router.query.from && tokenOut.name === router.query.to) {
    //   return;
    // }
    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          from: tokenIn && tokenIn.name ? tokenIn.name : null,
          to: tokenOut && tokenOut.name ? tokenOut.name : null,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [tokenIn.name, tokenOut.name]);
  useEffect(() => {
    const tokenInFromParam = router.query.from;
    const tokenOutFromParam = router.query.to;

    if (tokenInFromParam) {
      const tokenInDatum = tokensListConfig.find((token) => token.name === tokenInFromParam);

      if (tokenInDatum) {
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    }

    if (tokenOutFromParam) {
      const tokenOutDatum = tokensListConfig.find((token) => token.name === tokenOutFromParam);

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
