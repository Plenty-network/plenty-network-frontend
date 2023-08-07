import { BigNumber } from "bignumber.js";
import { IParamObject, IRouteTokenList } from "./types";
import axios from "axios";
import Config from '../../config/config';
import { connectedNetwork } from "../../common/walletconnect";
import { store } from "../../redux";

export const threeRouteRouter = async (
    tokenIn: string,
    tokenOut: string,
    tokenInAmount: BigNumber,
    userAddress: string,
    slippage: number
  ): Promise<{ param: IParamObject | [] }> => {
    try {
        let tokenInId = 0;
        let tokenOutId = 0;

        const routeSwapURL = await axios.get(
            `${Config.PLENTY_3ROUTE_URL[connectedNetwork]}swap/${tokenIn.toUpperCase()}/${tokenOut.toUpperCase()}/${tokenInAmount.toString()}`, {
              headers: {
                'Authorization': `${process.env.NEXT_PUBLIC_ROUTER_AUTHORISATION_TOKEN}`
              }
            }
          );        
          
          let routeTokenList : IRouteTokenList = await axios.get(
            `${Config.PLENTY_3ROUTE_URL[connectedNetwork]}tokens`, {
              headers: {
                'Authorization': `${process.env.NEXT_PUBLIC_ROUTER_AUTHORISATION_TOKEN}`
               }
            }
          );   

        routeTokenList.data.map<any>((datum) => {
          if(datum.symbol.toUpperCase() === tokenIn.toUpperCase() ){
            tokenInId = datum.id;
            return;
          }
        });

        routeTokenList.data.map<any>((datum) => {
          if(datum.symbol.toUpperCase() === tokenOut.toUpperCase()){
            tokenOutId = datum.id;
            return;
          }
        });

        let param = {
            app_id: 4,
            min_out: routeSwapURL.data.output * slippage,
            receiver: userAddress,
            token_in_id: tokenInId,
            token_out_id: tokenOutId,
            hops: new Map(),
        };

        for (let i = 0; i < routeSwapURL.data.chains.length; i++) {
            const chain = routeSwapURL.data.chains[i];
            for (let j = 0; j < chain.hops.length; j++) {
                const hop = chain.hops[j];
                param.hops.set(param.hops.size, ({
                    code: (j === 0 ? 1 : 0) + (hop.forward ? 2 : 0),
                    dex_id: hop.dex,
                    amount_opt: j === 0 ? chain.input : undefined,
                    params: []
                }));
            }
        }
        console.log('routertest', param);
        return {
            param,
        };
    } catch (error) {
      console.log(error);
      return {
        param: [],
      };
    }
  };