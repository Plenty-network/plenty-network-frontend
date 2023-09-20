import axios from "axios";
import Config from "../../config/config";
import { store } from "../../redux";
import { connectedNetwork } from "../../common/walletconnect";
import { loadSwapDataWrapper } from "../swap/wrappers";
import { BigNumber } from "bignumber.js";

/**
 * @deprecated
 */
const getCtezPrice = async (): Promise<{ ctezPriceInUSD: number }> => {
  try {
    const promises = [];
    const cfmmStorageUrl = `${Config.RPC_NODES.mainnet}chains/main/blocks/head/context/contracts/KT1H5b7LxEExkFd2Tng77TfuWbM5aPvHstPr/storage`;
    const xtzDollarValueUrl = Config.API.url;
    promises.push(axios.get(cfmmStorageUrl));
    promises.push(axios.get(xtzDollarValueUrl));

    const promisesResponse = await Promise.all(promises);
    const tokenPool = parseFloat(promisesResponse[0].data.args[0].int);
    const cashPool = parseFloat(promisesResponse[0].data.args[1].int);
    const xtzPrice = promisesResponse[1].data.market_data.current_price.usd;
    const ctezPriceInUSD = (cashPool / tokenPool) * xtzPrice;
    return {
      ctezPriceInUSD: ctezPriceInUSD,
    };
  } catch (e) {
    console.log({ e });
    return {
      ctezPriceInUSD: 0,
    };
  }
};

/**
 * @deprecated
 */
const getuDEFIPrice = async (): Promise<{ uDEFIinUSD: number }> => {
  try {
    const uDEFIOracleUrl = `${Config.RPC_NODES.mainnet}chains/main/blocks/head/context/contracts/KT1UuqJiGQgfNrTK5tuR1wdYi5jJ3hnxSA55/storage`;
    const uedfipriceResponse = await axios.get(uDEFIOracleUrl);
    let uDEFIinUSD = uedfipriceResponse.data.args[0].args[1].int;
    uDEFIinUSD = parseInt(uDEFIinUSD);
    uDEFIinUSD = uDEFIinUSD / Math.pow(10, 6);
    return {
      uDEFIinUSD: uDEFIinUSD,
    };
  } catch (err) {
    console.log({ err });
    return {
      uDEFIinUSD: 0,
    };
  }
};

/**
 * Gets price of agEUR.e from Ethereum chain
 * @deprecated
 */
const getagEURePrice = async (): Promise<{ agEUReInUSD: number }> => {
  try {
    const url = "https://api.angle.money/v1/prices";
    const APIpriceResponse = await axios.get(url);
    const dataObject = APIpriceResponse.data[4];

    let agEUReInUSD;
    if (dataObject.token === "agEUR") {
      agEUReInUSD = dataObject.rate;
      parseFloat(agEUReInUSD);
      return { agEUReInUSD: agEUReInUSD };
    } else {
      for (const x in APIpriceResponse.data) {
        if (APIpriceResponse.data[x].token === "agEUR") {
          agEUReInUSD = APIpriceResponse.data[x].rate;
          parseFloat(agEUReInUSD);
          return { agEUReInUSD: agEUReInUSD };
        }
      }
    }
    return {
      agEUReInUSD: Number(agEUReInUSD),
    };
  } catch (err) {
    console.log({ err });
    return {
      agEUReInUSD: 0,
    };
  }
};

const getXtzDollarPrice = async (): Promise<number> => {
  const xtzDollarValueUrl = Config.API.url;
  const xtzDollarValue = await axios.get(xtzDollarValueUrl);
  const xtzPrice = xtzDollarValue.data.market_data.current_price.usd;
  return xtzPrice;
};
/**
 * Gets price of tokens to show during trade
 */

export const getTokenPrices = async (): Promise<{
  success: boolean;
  tokenPrice: { [id: string]: number };
}> => {
  try {
    /*     const pricesResponse = await axios
      .get("https://api.teztools.io/token/prices", { timeout: 3000 })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log("teztool", err);
        return {
          contracts: [
            {
              symbol: "DAI.e",
              usdValue: "1.0",
            },
          ],
        };
      });
    const tokenPriceResponse = pricesResponse; */

    const tokenPrice: { [id: string]: number } = {};

    const indexerPriceResponse = await axios
      .get(`${Config.API_SERVER_URL["mainnet"]}ve/prices`)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return [];
      });
    const indexerPricesData = indexerPriceResponse;

    /*     for (const x of tokenPriceResponse.contracts) {
      tokenPrice[x.symbol] = Number(x.usdValue);
    } */

    for (const x of indexerPricesData) {
      //if (Number(x.price) !== 0) tokenPrice[x.token] = Number(x.price);
      tokenPrice[x.token] = Number(x.price);
    }

    return {
      success: true,
      tokenPrice,
    };
  } catch (error) {
    console.log({ tokenPriceError: error });
    return {
      success: false,
      tokenPrice: {},
    };
  }
};

export const getLPTokenPrice = async (
  tokenA: string,
  tokenB: string,
  tokenPrice: { [id: string]: number }
): Promise<{
  success: boolean;
  lpTokenPrice: BigNumber;
}> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.tokens;

    const swapData = await loadSwapDataWrapper(tokenA, tokenB);

    const tokenInSupply = swapData.tokenInSupply.multipliedBy(
      new BigNumber(10).pow(TOKEN[swapData.tokenIn].decimals)
    );
    const tokenOutSupply = swapData.tokenOutSupply.multipliedBy(
      new BigNumber(10).pow(TOKEN[swapData.tokenOut].decimals)
    );
    const lpTokenSupply = swapData.lpTokenSupply.multipliedBy(
      new BigNumber(10).pow(swapData.lpToken?.decimals as number)
    );

    let tokenAAmount = tokenInSupply
      .multipliedBy(new BigNumber(10).pow(swapData.lpToken?.decimals as number))
      .dividedBy(lpTokenSupply);
    tokenAAmount = tokenAAmount
      .multipliedBy(tokenPrice[swapData.tokenIn] ?? 0)
      .dividedBy(new BigNumber(10).pow(TOKEN[swapData.tokenIn].decimals));

    let tokenBAmount = new BigNumber(
      tokenOutSupply.multipliedBy(new BigNumber(10).pow(swapData.lpToken?.decimals as number))
    ).dividedBy(lpTokenSupply);
    tokenBAmount = tokenBAmount
      .multipliedBy(tokenPrice[swapData.tokenOut] ?? 0)
      .dividedBy(new BigNumber(10).pow(TOKEN[swapData.tokenOut].decimals));

    const lpTokenPrice = tokenAAmount.plus(tokenBAmount);

    return {
      success: true,
      lpTokenPrice,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      lpTokenPrice: new BigNumber(0),
    };
  }
};

export const getLPTokenPrices = async (tokenPrice: {
  [id: string]: number;
}): Promise<{ success: boolean; lpPrices: { [id: string]: BigNumber } }> => {
  try {
    const state = store.getState();
    const V2_AMM = state.config.AMMs;
    const AMM = { ...V2_AMM };

    let lpPrices: { [id: string]: BigNumber } = {};
    for (const key in AMM) {
      const price = await getLPTokenPrice(
        // @ts-ignore
        AMM[key].token1?.symbol || AMM[key].tokenX?.symbol,
        // @ts-ignore
        AMM[key].token2?.symbol || AMM[key].tokenY?.symbol,
        tokenPrice
      );
      lpPrices = { ...lpPrices, [AMM[key].lpToken.address]: price.lpTokenPrice };
    }
    return {
      success: true,
      lpPrices,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      lpPrices: {},
    };
  }
};
