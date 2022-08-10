import axios from 'axios'
import { store } from '../../redux';
import { BigNumber } from 'bignumber.js'
import { IPoolsDataWrapperResponse, VolumeVeData } from './types'
import { IAmmContracts } from '../../config/types';

export const poolsDataWrapper = async (
    address: string
  ): Promise< { success : boolean , allData  :{ [id: string]: IPoolsDataWrapperResponse } }> => {
    try {   

        // UnComment when launching
        // const state = store.getState();
        // const AMMS = state.config.AMMs;

        const AMMResponse = await axios.get("https://config.plentydefi.com/v1/config/amm");
        const AMMS : IAmmContracts  = AMMResponse.data;

        // console.log(AMMS);

    //   Make URL dynamic
        const poolsResponse = await axios.get("http://65.0.129.224/v1/pools");
        const poolsData = poolsResponse.data;

        console.log(poolsData);

        const analyticsResponse = await axios.get("http://13.127.76.247/ve/pools");
        const analyticsData = analyticsResponse.data;

        console.log(poolsData);

        const allData: { [id: string]: IPoolsDataWrapperResponse } = {};

        for(var x of poolsData){
            const AMM = AMMS[x.pool];
            allData[x.pool].tokenA = AMM.token1.symbol;
            allData[x.pool].tokenB = AMM.token2.symbol;
            allData[x.pool].poolType = AMM.type;
            allData[x.pool].apr = new BigNumber(x.apr);
            allData[x.pool].prevApr = x.prevApr ?? new BigNumber(0);
            allData[x.pool].boostedApr = allData[x.pool].apr.multipliedBy(2.5);  //Check formula

            const analyticsObject = getAnalyticsObject(x.pool , analyticsData);

            allData[x.pool].volume = new BigNumber(analyticsObject.volume24H.value) ?? new BigNumber(0);
            allData[x.pool].volumeTokenA = new BigNumber(analyticsObject.volume24H.token1) ?? new BigNumber(0);
            allData[x.pool].volumeTokenB = new BigNumber(analyticsObject.volume24H.token2) ?? new BigNumber(0);

            allData[x.pool].tvl = new BigNumber(analyticsObject.tvl.value) ?? new BigNumber(0);

            allData[x.pool].fees = new BigNumber(analyticsObject.fees7D.value) ?? new BigNumber(0);

            // Add Bribes data here ANIKET
            allData[x.pool].bribes = x.bribes[0] ?? new BigNumber(0);

            // Call Balance and staked API from KIRAN with ternary operator
            allData[x.pool].isMyPos = false;
        }
      

        console.log(allData);

      return {
        success: true,
        allData : allData,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        allData: {},
      };
    }
  };


const getAnalyticsObject =  (ammAddress :string , analyticsData: VolumeVeData[]) => {


    // Add Try Catch and Data Types

        let analyticsObject;

        for(var x of analyticsData){
            if(x.pool === ammAddress)
            analyticsObject = x;
            break;
        }

        if(analyticsObject)
        return analyticsObject;
        else
        throw new Error("No Analytics Data Available");

}