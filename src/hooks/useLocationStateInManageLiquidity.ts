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
  const feeTier = useAppSelector((state) => state.ManageLiquidityV3.feeTier);
  const router = useRouter();
  const showLiquidityModal = useAppSelector(
    (state) => state.ManageLiquidityV3.showLiquidityModalV3
  );
  // const [feeBps, setFeeBps] = useState("");
  const [feeBps, setFeeBps] = useState(feeTier);
  const [tokenX, setTokenX] = useState<tokenParameterLiquidity>(tokenIn);

  const [tokenY, setTokenY] = useState<tokenParameterLiquidity>(tokenOut);

  // const [tokenX, setTokenX] = useState<tokenParameterLiquidity>(
  //   router.asPath.indexOf("=") >= 0
  //     ? router.asPath
  //         .slice(
  //           router.asPath.indexOf("=") + 1,
  //           router.asPath.indexOf("&") === -1 ? router.asPath.length : router.asPath.indexOf("&")
  //         )
  //         .toString() === ""
  //       ? tokenIn
  //       : {
  //           name: router.asPath
  //             .slice(
  //               router.asPath.indexOf("=") + 1,
  //               router.asPath.indexOf("&") === -1
  //                 ? router.asPath.length
  //                 : router.asPath.indexOf("&")
  //             )
  //             .toString(),
  //           image: `/assets/Tokens/${router.asPath
  //             .slice(
  //               router.asPath.indexOf("=") + 1,
  //               router.asPath.indexOf("&") === -1
  //                 ? router.asPath.length
  //                 : router.asPath.indexOf("&")
  //             )
  //             .toString()}.png`,
  //           symbol: router.asPath
  //             .slice(
  //               router.asPath.indexOf("=") + 1,
  //               router.asPath.indexOf("&") === -1
  //                 ? router.asPath.length
  //                 : router.asPath.indexOf("&")
  //             )
  //             .toString(),
  //         }
  //     : tokenIn
  // );

  // const [tokenY, setTokenY] = useState<tokenParameterLiquidity>(
  //   router.asPath.indexOf("=") !== router.asPath.lastIndexOf("=") &&
  //     router.asPath.lastIndexOf("=") !== router.asPath.length - 1
  //     ? {
  //         name: router.asPath
  //           .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
  //           .toString(),
  //         symbol: router.asPath
  //           .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
  //           .toString(),
  //         image: `/assets/Tokens/${router.asPath
  //           .slice(router.asPath.lastIndexOf("=") + 1, router.asPath.length)
  //           .toString()}.png`,
  //       }
  //     : tokenOut
  // );
  const queryString = router.asPath.split("?")[1];

  const keyValuePairs = queryString.split("&");
  useEffect(() => {
    // Loop through the key-value pairs and extract the values
    for (const pair of keyValuePairs) {
      const [key, value] = pair.split("=");

      if (key === "tokenX") {
        setTokenX({
          name: decodeURIComponent(value),
          symbol: decodeURIComponent(value),
          image: `/assets/Tokens/${decodeURIComponent(value)}.png`,
        });
      } else if (key === "tokenY") {
        setTokenY({
          name: decodeURIComponent(value),
          symbol: decodeURIComponent(value),
          image: `/assets/Tokens/${decodeURIComponent(value)}.png`,
        });
      } else if (key === "feeBps") {
        setFeeBps(decodeURIComponent(value));
      }
    }
  }, []);

  useEffect(() => {
    dispatch(setShowLiquidityModalV3(true));
    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tokenX: tokenX ? tokenX.symbol : null,
          tokenY: tokenY ? tokenY.symbol : null,
          feeBps: feeBps,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [tokenX, tokenY]);

  return {
    tokenX,
    setTokenX,
    tokenY,
    setTokenY,
    showLiquidityModal,
    feeBps,
    setFeeBps,
  };
};
