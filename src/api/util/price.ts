import axios from 'axios';
import Config from '../../config/config';
import { store } from '../../redux';
import { rpcNode , connectedNetwork} from '../../common/wallet';


const getCtezPrice = async () : Promise<{ctezPriceInUSD : number}> => {
    try {
      const promises = [];
      const cfmmStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/KT1H5b7LxEExkFd2Tng77TfuWbM5aPvHstPr/storage`;
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

  const getuDEFIPrice = async () : Promise<{uDEFIinUSD : number}> => {
    try {
      const uDEFIOracleUrl = `${rpcNode}chains/main/blocks/head/context/contracts/KT1UuqJiGQgfNrTK5tuR1wdYi5jJ3hnxSA55/storage`;
      const uedfipriceResponse = await axios.get(uDEFIOracleUrl);
      let uDEFIinUSD = uedfipriceResponse.data.args[0].args[1].int;
      uDEFIinUSD = parseInt(uDEFIinUSD);
      uDEFIinUSD = uDEFIinUSD / Math.pow(10, 6);
      return {
        uDEFIinUSD : uDEFIinUSD,
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
  
  export const getagEURePrice = async () : Promise<{agEUReInUSD : number}> => {
    try {
    
      const url = 'https://api.angle.money/v1/prices';
      const APIpriceResponse = await axios.get(url);
      const dataObject = APIpriceResponse.data[4];
  
      let agEUReInUSD;
      if(dataObject.token === 'agEUR'){
        agEUReInUSD = dataObject.rate;
        parseFloat(agEUReInUSD);
        return {agEUReInUSD : agEUReInUSD};
      }
      else{
        for(const x in APIpriceResponse.data){
          if(APIpriceResponse.data[x].token === 'agEUR'){
            agEUReInUSD = APIpriceResponse.data[x].rate;
            parseFloat(agEUReInUSD);
            return {agEUReInUSD : agEUReInUSD};
          }
        }
      }
      return {
          agEUReInUSD : Number(agEUReInUSD)
      };
    } catch (err) {
      console.log({ err });
      return {
        agEUReInUSD: 0,
      };
    }
  };


  export const getXtzDollarPrice = async () : Promise<number> => {
    const xtzDollarValueUrl = Config.API.url;
    const xtzDollarValue = await axios.get(xtzDollarValueUrl);
    const xtzPrice = xtzDollarValue.data.market_data.current_price.usd;
    return xtzPrice;
  };
  /**
   * Gets price of tokens to show during trade
   */
  export const getTokenPrices = async () : Promise<{success : boolean , tokenPrice : { [id: string] : number; }}> => {
    try {
      const state = store.getState();
      const TOKEN = state.config.standard;
      const pricesResponse = await axios.get('https://api.teztools.io/token/prices');
      const tokenPriceResponse = pricesResponse.data;
      const ctezPrice = await getCtezPrice();
      const uDEFIPrice = await getuDEFIPrice();
      const agEurePrice = await getagEURePrice();
      const xtzPrice = await getXtzDollarPrice();
        
      const tokenPrice: { [id: string] : number; } = {};  
      const tokens = Object.keys(TOKEN);
      const tokenAddress : { [id: string] : { contractAddress? : string; }}= {}
      Object.keys(TOKEN).forEach(function(key) {
        tokenAddress[key] = {contractAddress : TOKEN[key].address}
      })
      for (const i in tokenPriceResponse.contracts) {
        if (tokens.includes(tokenPriceResponse.contracts[i].symbol)) {
          if (
            tokenAddress[tokenPriceResponse.contracts[i].symbol].contractAddress ===
            tokenPriceResponse.contracts[i].tokenAddress
          ) {
            tokenPrice[tokenPriceResponse.contracts[i].symbol] =
              tokenPriceResponse.contracts[i].usdValue;
          }
        }
      }
      // TODO: Find solution with Anshu for .e token prices
      for (const x in Config.WRAPPED_ASSETS[connectedNetwork]) {
        if (
          x === 'DAI.e' ||
          x === 'USDC.e' ||
          x === 'USDT.e' ||
          x === 'LINK.e' ||
          x === 'MATIC.e' ||
          x === 'BUSD.e' ||
          x === 'WETH.e' ||
          x === 'WBTC.e'
        ) {
          tokenPrice[x] = tokenPrice[Config.WRAPPED_ASSETS[connectedNetwork][x].REF_TOKEN];
        }
      }
      tokenPrice['ctez'] = ctezPrice.ctezPriceInUSD;
      tokenPrice['uDEFI'] = uDEFIPrice.uDEFIinUSD;
      tokenPrice['agEUR.e'] = agEurePrice.agEUReInUSD;
      tokenPrice['tez'] = xtzPrice;

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