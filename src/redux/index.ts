import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import { wallet } from './wallet/wallet';
import { config } from './config/config';
import { tokenPrice } from './tokenPrice/tokenPrice';
import isLoadingWallet from './isLoading/reducer';
import { userSettings } from './userSettings/userSettings';

const reducers = combineReducers({
  wallet: wallet,
  config: config,
  isLoadingWallet: isLoadingWallet,
  tokenPrice: tokenPrice,
  userSettings: userSettings,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSettings'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
