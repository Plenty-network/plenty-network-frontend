import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ConnectWalletAPI, DisconnectWalletAPI } from './wallet.api';

interface WalletState {
  address: string | null;
  loading: boolean;
}

const initialState: WalletState = {
  address: null,
  loading: false,
};

export const walletConnection = createAsyncThunk(
  'wallet/walletConnection',
  async (thunkAPI) => {
    const res = await ConnectWalletAPI().then((resp) => resp.wallet);
    return res;
  }
);
export const walletDisconnection = createAsyncThunk(
  'wallet/walletDisconnection',
  async (thunkAPI) => {
    await DisconnectWalletAPI();
  }
);

const walletSlice = createSlice({
  name: 'wallet',
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
      state.address = null;
    },
    fetchWallet: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const wallet = walletSlice.reducer;
