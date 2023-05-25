import { createSlice } from "@reduxjs/toolkit";
import { MyPortfolioSection } from "../../../pages/myportfolio";

const initialState = {
  isLoading: false,
  activePortfolio: MyPortfolioSection.Positions,
  operationSuccesful: false,
  isBanner: true,
  bannerClicked: false,
  scrollY: 0,
  height: 0,
  clientHeight: 0,
};

const IsLoadingSlice = createSlice({
  name: "walletLoading",
  initialState,
  reducers: {
    setIsLoadingWallet: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.operationSuccesful = action.payload.operationSuccesful;
    },
    setIsBanner: (state, action) => {
      state.isBanner = action.payload;
    },
    setScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
    setClientHeight: (state, action) => {
      state.clientHeight = action.payload;
    },
    setHeight: (state, action) => {
      state.height = action.payload;
    },
    setMyPortfolioSection: (state, action) => {
      state.activePortfolio = action.payload;
    },
    setbannerClicked: (state, action) => {
      state.bannerClicked = action.payload;
    },
  },
});
export const {
  setIsLoadingWallet,
  setIsBanner,
  setScrollY,
  setMyPortfolioSection,
  setHeight,
  setClientHeight,
  setbannerClicked,
} = IsLoadingSlice.actions;
export const walletLoading = IsLoadingSlice.reducer;
