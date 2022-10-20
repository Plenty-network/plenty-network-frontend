import axios from 'axios';
import Config from '../../config/config';
import { store } from '../../redux';
import { connectedNetwork } from '../../common/walletconnect';
import { loadSwapDataWrapper } from '../swap/wrappers';
import { BigNumber } from 'bignumber.js'

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
 * Deprecate when token is listed on Tezos exchanges
 */

export const getagEURePrice = async (): Promise<{ agEUReInUSD: number }> => {
  try {
    const url = 'https://api.angle.money/v1/prices';
    const APIpriceResponse = await axios.get(url);
    const dataObject = APIpriceResponse.data[4];

    let agEUReInUSD;
    if (dataObject.token === 'agEUR') {
      agEUReInUSD = dataObject.rate;
      parseFloat(agEUReInUSD);
      return { agEUReInUSD: agEUReInUSD };
    } else {
      for (const x in APIpriceResponse.data) {
        if (APIpriceResponse.data[x].token === 'agEUR') {
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

export const getXtzDollarPrice = async (): Promise<number> => {
  const xtzDollarValueUrl = Config.API.url;
  const xtzDollarValue = await axios.get(xtzDollarValueUrl);
  const xtzPrice = xtzDollarValue.data.market_data.current_price.usd;
  return xtzPrice;
};
/**
 * Gets price of tokens to show during trade
 */
// TODO :  get angle protocol to add plenty.network in whitelist
// TODO : Mainnet launch take a look at Pricing function
export const getTokenPrices = async (): Promise<{
  success: boolean;
  tokenPrice: { [id: string]: number };
}> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;
    const pricesResponse = await axios.get(
      'https://api.teztools.io/token/prices'
    );
    const tokenPriceResponse = pricesResponse.data;
    const ctezPrice = await getCtezPrice();
    const uDEFIPrice = await getuDEFIPrice();
    // const agEurePrice = await getagEURePrice();
    const xtzPrice = await getXtzDollarPrice();

    const tokenPrice: { [id: string]: number } = {};
    const tokens = Object.keys(TOKEN);

    const indexerPriceResponse = await axios.get(`${Config.PLY_INDEXER}analytics/tokens`);
    const indexerPricesData = indexerPriceResponse.data;

    for(const i in tokenPriceResponse.contracts){
      for(const j in indexerPricesData){
        if(tokenPriceResponse.contracts[i].symbol === indexerPricesData[j].token){
          if(tokenPriceResponse.contracts[i].symbol === 'WETH.e' || tokenPriceResponse.contracts[i].symbol === 'MATIC.e')
          continue;
          tokenPriceResponse.contracts[i].usdValue = Number(indexerPricesData[j].price.value);
        } else {
          if(indexerPricesData[j].token === 'WETH.e' || indexerPricesData[j].token === 'MATIC.e') {
            continue;
          }
          tokenPrice[indexerPricesData[j].token] = Number(indexerPricesData[j].price.value);
        }
      }
    }
    
    const tokenSymbols: { [id: string]: { symbol?: string } } = {};
    Object.keys(TOKEN).forEach(function (key) {
      tokenSymbols[key] = { symbol: TOKEN[key].symbol };
    });
    for (const i in tokenPriceResponse.contracts) {
      if (tokens.includes(tokenPriceResponse.contracts[i].symbol)) {
        if (
          tokenSymbols[tokenPriceResponse.contracts[i].symbol]
            .symbol === tokenPriceResponse.contracts[i].symbol
        ) {
          tokenPrice[tokenPriceResponse.contracts[i].symbol] =
            tokenPriceResponse.contracts[i].usdValue;
        }
      }
    }
     // TODO : Remove this for removing wAssets
    for (const i in tokenPriceResponse.contracts) {
      const x = tokenPriceResponse.contracts[i].symbol;
      if (
        // x === 'wDAI' ||
        // x === 'wUSDC' ||
        // x === 'wUSDT' ||
        // x === 'wLINK' ||
        x === 'wMATIC' ||
        // x === 'wBUSD' ||
        x === 'wWETH'
        // x === 'wWBTC'
      ) {
        tokenPrice[tokenPriceResponse.contracts[i].symbol] =
          tokenPriceResponse.contracts[i].usdValue;
      }
    }
    // TODO: Find solution with Anshu for .e token prices
    for (const x in Config.WRAPPED_ASSETS[connectedNetwork]) {
      if (
        // x === 'DAI.e' ||
        // x === 'USDC.e' ||
        // x === 'USDT.e' ||
        // x === 'LINK.e' ||
        x === 'MATIC.e' ||
        // x === 'BUSD.e' ||
        x === 'WETH.e' 
        // x === 'WBTC.e'
      ) {
        tokenPrice[x] =
          tokenPrice[Config.WRAPPED_ASSETS[connectedNetwork][x].REF_TOKEN];
      }
    }
    tokenPrice['ctez'] = ctezPrice.ctezPriceInUSD;
    tokenPrice['uDEFI'] = uDEFIPrice.uDEFIinUSD;
    // tokenPrice['agEUR.e'] = agEurePrice.agEUReInUSD;
    tokenPrice['tez'] = xtzPrice;

    // Hardcoding PLY Price for development
    tokenPrice['PLY'] = 1;
    
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

export const getLPTokenPrice = async (tokenA : string , tokenB : string , tokenPrice: { [id: string]: number }): Promise<{
  success: boolean;
  lpTokenPrice: BigNumber;
}> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    const swapData = await loadSwapDataWrapper(tokenA , tokenB);

    const tokenInSupply = swapData.tokenInSupply.multipliedBy(new BigNumber(10).pow(TOKEN[swapData.tokenIn].decimals));
    const tokenOutSupply = swapData.tokenOutSupply.multipliedBy(new BigNumber(10).pow(TOKEN[swapData.tokenOut].decimals));
    const lpTokenSupply = swapData.lpTokenSupply.multipliedBy(new BigNumber(10).pow(swapData.lpToken?.decimals as number));

    let tokenAAmount = ((tokenInSupply).multipliedBy(new BigNumber(10).pow(swapData.lpToken?.decimals as number))).dividedBy(lpTokenSupply);
    tokenAAmount = (tokenAAmount.multipliedBy(tokenPrice[swapData.tokenIn])).dividedBy(new BigNumber(10).pow(TOKEN[swapData.tokenIn].decimals));


    let tokenBAmount = new BigNumber((tokenOutSupply).multipliedBy(new BigNumber(10).pow(swapData.lpToken?.decimals as number))).dividedBy(lpTokenSupply);
    tokenBAmount = (tokenBAmount.multipliedBy(tokenPrice[swapData.tokenOut])).dividedBy(new BigNumber(10).pow(TOKEN[swapData.tokenOut].decimals));

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

export const getLPTokenPrices =async (tokenPrice: { [id: string]: number }) : Promise<{success : boolean , lpPrices : { [id: string]: BigNumber } }> => {

  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    
    let lpPrices: { [id: string]: BigNumber } = {};
    for(const key in AMM) {
      const price = await getLPTokenPrice(AMM[key].token1.symbol , AMM[key].token2.symbol , tokenPrice);
      lpPrices = {...lpPrices, [AMM[key].lpToken.symbol]: price.lpTokenPrice};
    }
    return {
      success : true , 
      lpPrices,
    };    
  } catch (error) {
    console.log(error);
    return{
      success : false,
      lpPrices : {},
    };
  }
  
}