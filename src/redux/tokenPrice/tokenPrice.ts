import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLPTokenPrices, getTokenPrices } from '../../api/util/price';
import { BigNumber } from "bignumber.js";

interface ILpTokenPriceList {
  [id: string]: BigNumber
}

interface ITokenPriceList {
  [id: string]: number
}
interface TokenPriceState {
  tokenPrice: ITokenPriceList;
  lpTokenPrices : ILpTokenPriceList;
}

const initialState: TokenPriceState = {
  tokenPrice: {},
  lpTokenPrices: {},
};

export const getTokenPrice = createAsyncThunk(
  'tokenPrice/getTokenPrice',
  async (thunkAPI) => {
    const res = await getTokenPrices().then((resp) => resp.tokenPrice);

    return res;
  }
);

export const getLpTokenPrice = createAsyncThunk(
  'tokenPrice/getLpTokenPrice',
  async (tokenPrices:ITokenPriceList, thunkAPI) => {
    const res: ILpTokenPriceList = await getLPTokenPrices(tokenPrices).then((resp) => resp.lpPrices);

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
    [getLpTokenPrice.pending.toString()]: (state: any) => {
      state.lpTokenPrices = {};
    },
    [getLpTokenPrice.fulfilled.toString()]: (state: any, action: any) => {
      state.lpTokenPrices = action.payload;
    },
    [getLpTokenPrice.rejected.toString()]: (state: any) => {
      state.lpTokenPrices = {};
    },
  },
});

export const tokenPrice = TokenPriceSlice.reducer;
