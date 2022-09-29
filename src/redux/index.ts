import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { wallet } from "./wallet/wallet";
import { config } from "./config/config";
import { tokenPrice } from "./tokenPrice/tokenPrice";
import isLoadingWallet from "./isLoading/reducer";
import flashMessage from "./flashMessage/reducer";
import { userSettings } from "./userSettings/userSettings";
import { veNFT } from "./veNFT";
import { pools } from "./pools";
import { epoch } from "./epoch/epoch";
import { walletLoading } from "./walletLoading";
import { portfolioRewards } from "./myPortfolio/rewards";

const reducers = combineReducers({
  wallet: wallet,
  config: config,
  isLoadingWallet: isLoadingWallet,
  tokenPrice: tokenPrice,
  userSettings: userSettings,
  pools: pools,
  epoch: epoch,
  veNFT: veNFT,
  walletLoading: walletLoading,
  portfolioRewards: portfolioRewards,
  flashMessage:flashMessage,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userSettings", "config", "pools", "epoch", "tokenPrice"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
