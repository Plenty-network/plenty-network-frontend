import { useQuery } from 'react-query';
import { poolsDataWrapper } from '..';
import { store } from '../../../redux';
import {
  IPoolsDataWrapperResponse,
} from '../types';

export const usePoolsMain = () =>
  useQuery<IPoolsDataWrapperResponse[], Error>(
    'pools-mains',
    async () => {
      const tokenprice = store.getState().tokenPrice.tokenPrice;
      const walletAddress = store.getState().wallet.address;
      const data1 = (
        await poolsDataWrapper(
          walletAddress ? walletAddress : undefined,
          tokenprice
        )
      ).allData;
      const data: IPoolsDataWrapperResponse[] = Object.values(data1);
      return data;
    },
    { refetchInterval: 60000 }
  );

