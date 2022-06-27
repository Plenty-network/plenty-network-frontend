import { createSelector, createSlice } from '@reduxjs/toolkit';

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
  reducers: {},
});

export const {} = walletSlice.actions;

export const wallet = walletSlice.reducer;
