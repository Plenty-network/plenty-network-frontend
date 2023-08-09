import { BigNumber } from "bignumber.js";
import { IParamObject, IRouteTokenList } from "./types";
import axios from "axios";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";

export const threeRouteRouter = async (
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: BigNumber,
  userAddress: string,
  slippage: number,
  tokenInDecimals: number,
  tokenOutDecimals: number
): Promise<{ param: IParamObject }> => {
  try {
    let tokenInId = 0;
    let tokenOutId = 0;

    const routeSwapURL = await axios.get(
      `${
        Config.PLENTY_3ROUTE_URL[connectedNetwork]
      }swap/${tokenIn.toUpperCase()}/${tokenOut.toUpperCase()}/${tokenInAmount.toString()}`,
      {
        headers: {
          Authorization: `${process.env.NEXT_PUBLIC_ROUTER_AUTHORISATION_TOKEN}`,
        },
      }
    );

    let routeTokenList: IRouteTokenList = await axios.get(
      `${Config.PLENTY_3ROUTE_URL[connectedNetwork]}tokens`,
      {
        headers: {
          Authorization: `${process.env.NEXT_PUBLIC_ROUTER_AUTHORISATION_TOKEN}`,
        },
      }
    );

    routeTokenList.data.map<any>((datum) => {
      if (datum.symbol.toUpperCase() === tokenIn.toUpperCase()) {
        tokenInId = datum.id;
        return;
      }
    });

    routeTokenList.data.map<any>((datum) => {
      if (datum.symbol.toUpperCase() === tokenOut.toUpperCase()) {
        tokenOutId = datum.id;
        return;
      }
    });

    let param = {
      app_id: "4",
      min_out: BigNumber(routeSwapURL.data.output)
        .multipliedBy(new BigNumber(10).pow(tokenOutDecimals))
        .multipliedBy(slippage)
        .decimalPlaces(0, 1)
        .toString(),
      receiver: userAddress,
      token_in_id: tokenInId.toString(),
      token_out_id: tokenOutId.toString(),
      hops: {},
    };

    const hopsReal = new Map();
    for (let i = 0; i < routeSwapURL.data.chains.length; i++) {
      const chain = routeSwapURL.data.chains[i];
      for (let j = 0; j < chain.hops.length; j++) {
        const hop = chain.hops[j];

        hopsReal.set(hopsReal.size, {
          code: ((j === 0 ? 1 : 0) + (hop.forward ? 2 : 0)).toString(),
          dex_id: hop.dex.toString(),
          amount_opt:
            j === 0
              ? BigNumber(chain.input)
                  .multipliedBy(new BigNumber(10).pow(tokenInDecimals))
                  .decimalPlaces(0, 1)
                  .toString()
              : undefined,
          params: "",
        });
      }
    }

    hopsReal.forEach((value, key) => {
      //@ts-ignore
      param.hops[key] = value;
    });

    return {
      param,
    };
  } catch (error) {
    console.log(error);
    return {
      // @ts-ignore
      param: {},
    };
  }
};

export const estimateSwapOutput = async (
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: BigNumber,
  slippage: number,
): Promise<{ tokenOutValue: BigNumber, minReceived: string }> => {
  try {
    const routeSwapURL = await axios.get(
      `${
        Config.PLENTY_3ROUTE_URL[connectedNetwork]
      }swap/${tokenIn.toUpperCase()}/${tokenOut.toUpperCase()}/${tokenInAmount.toString()}`,
      {
        headers: {
          Authorization: `${process.env.NEXT_PUBLIC_ROUTER_AUTHORISATION_TOKEN}`,
        },
      }
    );

    let tokenOutValue =  BigNumber(routeSwapURL.data.output);
    let minReceived = BigNumber(routeSwapURL.data.output)
                      .multipliedBy(slippage)
                      .decimalPlaces(0, 1)
                      .toString();

    return {
      tokenOutValue, minReceived
    };
  } catch (error) {
    console.log(error);
    return {
      // @ts-ignore
      tokenOutValue: 0, minReceived: 0
    };
  }
};