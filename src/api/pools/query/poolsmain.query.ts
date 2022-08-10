import { useQuery } from "react-query";
import {IAmmContracts } from "../../../config/types";
import { PoolsMainPage, VolumeV1Data, VolumeVeData } from "../types";

export const usePoolsMain = () =>
  useQuery<PoolsMainPage[], Error>(
    'pools-mains',
    async () => {
      const data:PoolsMainPage[]=[];  
      const  data1  = await volumeV1Data();
      const  data2 =await volumeVeData();
      //const  tokens = store.getState().config.AMMs;
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
    { refetchInterval: 60000 },
);
const volumeV1Data =async ()=>{
    const response = await fetch('http://65.0.129.224/v1/pools');
     const data:VolumeV1Data[] = await response.json();
     return data;
}
const volumeVeData =async ()=>{
    const response = await fetch('http://13.127.76.247/ve/pools');
     const data:VolumeVeData[] = await response.json();
     return data;
}
const iAmmContracts =async ()=>{
    const response = await fetch('https://config.plentydefi.com/v1/config/amm');
     const data:IAmmContracts = await response.json();
     return data;
}