import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  operationSuccesful: false,
  isBanner: true,
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
  },
});
export const { setIsLoadingWallet, setIsBanner } = IsLoadingSlice.actions;
export const walletLoading = IsLoadingSlice.reducer;
