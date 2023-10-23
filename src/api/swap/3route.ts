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
      app_id: "0",
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
    for (let i = 0; i < routeSwapURL.data.hops.length; i++) {
      const hop = routeSwapURL.data.hops[i];
      hopsReal.set(hopsReal.size, {
        code: hop.code,
        dex_id: hop.dexId.toString(),
        amount_from_token_in_reserves: hop.tokenInAmount.toString(),
        amount_from_trading_balance: hop.tradingBalanceAmount.toString(),
        params: hop.params == null ? "" : hop.params,
      });
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
  slippage: number
): Promise<{ tokenOutValue: BigNumber; minReceived: string }> => {
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

    let tokenOutValue = BigNumber(routeSwapURL.data.output);
    let minReceived = BigNumber(routeSwapURL.data.output).multipliedBy(slippage).toString();
    return {
      tokenOutValue,
      minReceived,
    };
  } catch (error) {
    console.log(error);
    return {
      // @ts-ignore
      tokenOutValue: 0,
      minReceived: "0",
    };
  }
};
