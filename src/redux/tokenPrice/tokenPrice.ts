import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTokenPrices } from '../../api/util/price';

interface TokenPriceState {
  tokenPrice: {
    [id: string]: number;
  };
}

const initialState: TokenPriceState = {
  tokenPrice: {},
};

export const getTokenPrice = createAsyncThunk(
  'tokenPrice/getTokenPrice',
  async (thunkAPI) => {
    const res = await getTokenPrices().then((resp) => resp.tokenPrice);
    console.log();
    return res;
  }
);

const TokenPriceSlice = createSlice({
  name: 'tokenPrice',
  initialState,
  reducers: {},
  extraReducers: {
    [getTokenPrice.pending.toString()]: (state: any) => {
      state.tokenPrice = {};
    },
    [getTokenPrice.fulfilled.toString()]: (state: any, action: any) => {
      state.tokenPrice = action.payload;
    },
    [getTokenPrice.rejected.toString()]: (state: any) => {
      state.tokenPrice = {};
    },
  },
});

export const tokenPrice = TokenPriceSlice.reducer;
