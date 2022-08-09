import { useQuery } from "react-query";
import { poolsMainPage } from "../types";

export const usePoolsMain = () =>
  useQuery<poolsMainPage[], Error>(
    'pools-mains',
    async () => {
      const  data  = await volumeData();
      return data;
    },
    { refetchInterval: 30_000 },
);
const volumeData =async ()=>{
    const response = await fetch('http://65.0.129.224/v1/pools');
     const data:poolsMainPage[] = await response.json();
     return data;
}