import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ConnectWalletAPI,
  DisconnectWalletAPI,
  FetchWalletAPI,
  switchWalletAccountAPI,
} from "./wallet.api";

interface WalletState {
  address: string | "";
  loading: boolean;
}

const initialState: WalletState = {
  address: "",
  loading: false,
};

export const walletConnection = createAsyncThunk("wallet/walletConnection", async (thunkAPI) => {
  const res = await (await ConnectWalletAPI()).wallet;
  return res;
});
export const walletDisconnection = createAsyncThunk(
  "wallet/walletDisconnection",
  async (thunkAPI) => {
    await DisconnectWalletAPI();
  }
);
export const fetchWallet = createAsyncThunk("wallet/fetchWallet", async (thunkAPI) => {
  const res = await FetchWalletAPI();
  return res.wallet;
});
export const switchWallet = createAsyncThunk("wallet/switchWallet", async (thunkAPI) => {
  const res = await switchWalletAccountAPI();
  if (res.success) {
    return res.wallet;
  }
});

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: {
    [walletConnection.pending.toString()]: (state: any) => {
      state.loading = true;
    },
    [walletConnection.fulfilled.toString()]: (state: any, action: any) => {
      state.address = action.payload;
      state.loading = false;
    },
    [walletConnection.rejected.toString()]: (state: any) => {
      state.loading = false;
    },
    [walletDisconnection.fulfilled.toString()]: (state) => {
      state.address = "";
    },
    [fetchWallet.fulfilled.toString()]: (state, action) => {
      state.address = action.payload;
    },
    [switchWallet.fulfilled.toString()]: (state, action) => {
      state.address = action.payload;
    },
    [switchWallet.rejected.toString()]: (state, action) => {
      state.address = "";
    },
  },
});

export const wallet = walletSlice.reducer;
