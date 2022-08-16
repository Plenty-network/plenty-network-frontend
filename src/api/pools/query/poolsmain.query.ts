import { useQuery } from 'react-query';
import { poolsDataWrapper } from '..';
import { store} from '../../../redux';
import { getTokenPrices } from '../../util/price';
import {
  IPoolsDataWrapperResponse,
} from '../types';

export const usePoolsMain = () =>
  useQuery<IPoolsDataWrapperResponse[], Error>(
    'pools-mains',
    async () => {
     // const tokenprice = store.getState().tokenPrice.tokenPrice;
    const tokenprice= await (await getTokenPrices()).tokenPrice
      const walletAddress = store.getState().wallet.address;
      const data1 = (
        await poolsDataWrapper(
          walletAddress ? walletAddress : undefined,
          tokenprice,
        )
      ).allData;
      const data: IPoolsDataWrapperResponse[] = Object.values(data1);
      return data;
    },
    { refetchInterval: 60000 }
  );

// export const useGetValue=()=>{
//   const tokenprice = useAppSelector((state) => state.tokenPrice).tokenPrice;
//   let data:IPoolsDataWrapperResponse[]=[]
//   if(Object.keys(tokenprice).length>0){
//     const { data , isFetched } = usePoolsMain(tokenprice);
//     return { data , isFetched }
//   }  
//   return  { data:data , isFetched:false }
// }