import { useQuery } from "react-query";
import { poolsDataWrapper } from "..";
import {IAmmContracts } from "../../../config/types";
import { store } from "../../../redux";
import { IPoolsDataWrapperResponse, PoolsMainPage, VolumeV1Data, VolumeVeData } from "../types";


export const usePoolsMain2 = () =>
  useQuery<IPoolsDataWrapperResponse[], Error>(
    'pools-mains',
    async () => {
      const  tokenprice = store.getState().tokenPrice.tokenPrice;
      const data1= (await poolsDataWrapper(undefined,tokenprice)).allData;
      const data:IPoolsDataWrapperResponse[]=Object.values(data1)
       return data;
    },
    { refetchInterval: 60000 },
);
export const usePoolsMain = () =>
  useQuery<PoolsMainPage[], Error>(
    'pools-mains',
    async () => {
      const data:PoolsMainPage[]=[];  
      const  data1  = await volumeV1Data();
      const  data2 =await volumeVeData();
      // const a= await poolsDataWrapper
      // const  tokenprice = store.getState().tokenPrice.tokenPrice;
      const tokens=await iAmmContracts();
      data1.forEach((e,index)=>{
         data2.forEach((d2)=>{
            if(d2.pool===e.pool){
                const dataEachPool: PoolsMainPage = {
                    id: index,
                    ...d2,
                    ...e,
                    ...tokens[e.pool]
                  };
                  console.log("dataEachPool",dataEachPool)  
                data.push(dataEachPool);
            }
         });
      });
      return data;
    },
    { refetchInterval: 10000 },
);
const volumeV1Data =async ()=>{
    const response = await fetch('https://62d80fa990883139358a3999.mockapi.io/api/v1/ve');
     const data:VolumeV1Data[] = await response.json();
     return data;
}
const volumeVeData =async ()=>{
    const response = await fetch('https://62d80fa990883139358a3999.mockapi.io/api/v1/config');
     const data:VolumeVeData[] = await response.json();
     return data;
}
const iAmmContracts =async ()=>{
    const response = await fetch('https://config.plentydefi.com/v1/config/amm');
     const data:IAmmContracts = await response.json();
     return data;
}