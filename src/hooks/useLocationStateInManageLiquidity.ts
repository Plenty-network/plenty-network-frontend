import { useState, useEffect, useMemo } from "react";

import { tokenParameter } from "../constants/swap";
import { useRouter } from "next/router";
import { AppDispatch, useAppSelector } from "../redux";
import { tokenParameterLiquidity } from "../components/Liquidity/types";
import { useDispatch } from "react-redux";
import { setShowLiquidityModalV3 } from "../redux/poolsv3/manageLiq";

export const useLocationStateInManageLiquidity = () => {
  const tokens = useAppSelector((state) => state.config.tokens);
  const dispatch = useDispatch<AppDispatch>();
  const tokenOut = useAppSelector((state) => state.ManageLiquidityV3.tokenY);
  const tokenIn = useAppSelector((state) => state.ManageLiquidityV3.tokenX);
  const router = useRouter();
  const showLiquidityModal = useAppSelector(
    (state) => state.ManageLiquidityV3.showLiquidityModalV3
  );
  const [tokenX, setTokenX] = useState<tokenParameterLiquidity>(
    router.asPath.indexOf("=") >= 0
      ? router.asPath
          .slice(
            router.asPath.indexOf("=") + 1,
            router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
          )
          .toString() === ""
        ? tokenIn
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
            symbol: router.asPath
              .slice(
                router.asPath.indexOf("=") + 1,
                router.asPath.indexOf("&") === -1
                  ? router.asPath.length
                  : router.asPath.indexOf("&")
              )
              .toString(),
          }
      : tokenIn
  );

  const [tokenY, setTokenY] = useState<tokenParameterLiquidity>(
    router.asPath.indexOf("=") !== router.asPath.lastIndexOf("=") &&
      router.asPath.lastIndexOf("=") !== router.asPath.length - 1
      ? {
          name: router.asPath
            .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
            .toString(),
          symbol: router.asPath
            .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
            .toString(),
          image: `/assets/Tokens/${router.asPath
            .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
            .toString()}.png`,
        }
      : tokenOut
  );

  useEffect(() => {
    dispatch(setShowLiquidityModalV3(true));
    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tokenX: tokenX ? tokenX.symbol : null,
          tokenY: tokenY ? tokenY.symbol : null,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [tokenX, tokenY]);
  // useEffect(() => {
  //   const tokenInFromParam = router.query.tokenX;
  //   const tokenOutFromParam = router.query.tokenY;

  //   if (tokenInFromParam) {
  //     setTokenX(tokenInFromParam);
  //   }

  //   if (tokenOutFromParam) {
  //     setTokenY(tokenOutFromParam);
  //   }
  // }, [router]);

  return {
    tokenX,
    setTokenX,
    tokenY,
    setTokenY,
    showLiquidityModal,
  };
};