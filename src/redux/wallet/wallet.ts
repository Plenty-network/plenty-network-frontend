import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ConnectWalletAPI,
  DisconnectWalletAPI,
  FetchWalletAPI,
} from './wallet.api';

interface WalletState {
  address: string | '';
  loading: boolean;
}

const initialState: WalletState = {
  address: '',
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
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (thunkAPI) => {
    const res = await FetchWalletAPI().then((resp) => resp.wallet);

    return res;
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
      state.address = '';
    },
    [fetchWallet.fulfilled.toString()]: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const wallet = walletSlice.reducer;
