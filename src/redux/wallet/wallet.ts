import { createSlice } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  loading: boolean;
}

const initialState: WalletState = {
  address: null,
  loading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletConnectionStart: (state) => {
      state.loading = true;
    },
    walletConnectionSuccessfull: (state, action) => {
      state.address = action.payload;
      state.loading = false;
    },
    walletConnectionFailed: (state) => {
      state.loading = false;
    },
    walletDisconnection: (state) => {
      state.address = null;
    },
    fetchWallet: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const {
  walletConnectionStart,
  walletConnectionSuccessfull,
  walletConnectionFailed,
  walletDisconnection,
  fetchWallet,
} = walletSlice.actions;

export const wallet = walletSlice.reducer;
