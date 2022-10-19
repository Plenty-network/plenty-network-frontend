import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLPTokenPrices, getTokenPrices } from "../../api/util/price";
import { BigNumber } from "bignumber.js";

interface ILpTokenPriceList {
  [id: string]: BigNumber;
}

interface ITokenPriceList {
  [id: string]: number;
}
interface TokenPriceState {
  tokenPrice: ITokenPriceList;
  lpTokenPrices: ILpTokenPriceList;
}

const initialState: TokenPriceState = {
  tokenPrice: {},
  lpTokenPrices: {},
};

export const getTokenPrice = createAsyncThunk("tokenPrice/getTokenPrice", async (thunkAPI) => {
  const res = await getTokenPrices()
    .then((resp) => resp.tokenPrice)
    .catch((error: any) => {
      throw new Error(error.message);
    });

  return res;
});

export const getLpTokenPrice = createAsyncThunk(
  "tokenPrice/getLpTokenPrice",
  async (tokenPrices: ITokenPriceList, thunkAPI) => {
    const res: ILpTokenPriceList = await getLPTokenPrices(tokenPrices)
      .then((resp) => resp.lpPrices)
      .catch((error: any) => {
        throw new Error(error.message);
      });
    return res;
  }
);

const TokenPriceSlice = createSlice({
  name: "tokenPrice",
  initialState,
  reducers: {},
  extraReducers: {
    [getTokenPrice.pending.toString()]: (state: any) => {
      // state.tokenPrice = {};
      console.log("Fetching token prices.");
    },
    [getTokenPrice.fulfilled.toString()]: (state: any, action: any) => {
      state.tokenPrice = action.payload;
      console.log("Fetching token prices complete.");
    },
    [getTokenPrice.rejected.toString()]: (state: any, action: any) => {
      // state.tokenPrice = {};
      console.log(`Error: ${action.error.message}`);
    },
    [getLpTokenPrice.pending.toString()]: (state: any) => {
      // state.lpTokenPrices = {};
      console.log("Fetching lp token prices.");
    },
    [getLpTokenPrice.fulfilled.toString()]: (state: any, action: any) => {
      state.lpTokenPrices = action.payload;
      console.log("Fetching lp token prices complete.");
    },
    [getLpTokenPrice.rejected.toString()]: (state: any, action: any) => {
      // state.lpTokenPrices = {};
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const tokenPrice = TokenPriceSlice.reducer;
