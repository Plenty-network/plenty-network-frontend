import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  operationSuccesful: false,
  isBanner: true,
  scrollY: 0,
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
  },
});
export const { setIsLoadingWallet, setIsBanner, setScrollY } = IsLoadingSlice.actions;
export const walletLoading = IsLoadingSlice.reducer;
