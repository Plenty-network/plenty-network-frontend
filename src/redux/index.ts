import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

import { wallet } from './wallet/wallet';
import { config } from './config/config';
import { tokenPrice } from './tokenPrice/tokenPrice';
import isLoadingWallet from './isLoading/reducer';

export const store = configureStore({
  reducer: {
    wallet,
    config,
    isLoadingWallet,
    tokenPrice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
