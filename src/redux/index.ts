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
import {flashMessage} from "./flashMessage";
import { userSettings } from "./userSettings/userSettings";
import { veNFT } from "./veNFT";
import { pools } from "./pools";
import { epoch } from "./epoch/epoch";
import { walletLoading } from "./walletLoading";
import { portfolioRewards } from "./myPortfolio/rewards";
import { portfolioStatsTvl } from "./myPortfolio/tvl";
import { portfolioStatsVotes } from "./myPortfolio/votesStats";
import { rpcData } from "./userSettings/rpcData";

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
  portfolioStatsTvl: portfolioStatsTvl,
  portfolioStatsVotes: portfolioStatsVotes,
  rpcData: rpcData,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "userSettings",
    "config",
    "pools",
    "epoch",
    "tokenPrice",
    "portfolioStatsTvl",
    "portfolioStatsVotes",
    "rpcData",
  ],
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
