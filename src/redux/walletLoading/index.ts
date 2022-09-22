import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  operationSuccesful: false,
};

const IsLoadingSlice = createSlice({
  name: "walletLoading",
  initialState,
  reducers: {
    setIsLoadingWallet: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.operationSuccesful = action.payload.operationSuccesful;
    },
  },
});
export const { setIsLoadingWallet } = IsLoadingSlice.actions;
export const walletLoading = IsLoadingSlice.reducer;
