import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "bignumber.js";
import { getTvlStatsData } from "../../api/portfolio/stats";
import { API_RE_ATTEMPTS } from "../../constants/global";
import { ITvlStatsArgument, ITvlStatsData } from "./types";

const initialState: ITvlStatsData = {
  userTvl: new BigNumber(0),
  userTvlFetching: false,
  userTvlError: false,
  userTvlAttempts: 0,
}


export const fetchTvlStatsData = createAsyncThunk(
  'positions/fetchTvlStatsData',
  async ({userTezosAddress, tokenPrices, lpTokenPrices}: ITvlStatsArgument, thunkAPI) => {
    const res = await getTvlStatsData(userTezosAddress, tokenPrices, lpTokenPrices);
    return res;
  }
);


const PortfolioStatsTvl = createSlice({
  name: "portfolioStatsTvl",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTvlStatsData.pending.toString()]: (state: any) => {
      state.userTvlError = false;
      state.userTvlFetching = true;
      console.log("Fetching tvl stats data");
    },
    [fetchTvlStatsData.fulfilled.toString()]: (state: any, action: any) => {
      state.userTvlError = false;
      state.userTvlAttempts = 0;
      state.userTvlFetching = false;
      state.userTvl = action.payload;
      console.log("Tvl stats data fetching completed");
    },
    [fetchTvlStatsData.rejected.toString()]: (state: any, action: any) => {
      state.userTvlFetching = false;
      if (state.userTvlAttempts < API_RE_ATTEMPTS) {
        state.userTvlError = true;
        state.userTvlAttempts += 1;
        console.log("Re-attempting to fetch tvl stats data.");
      }
      state.userTvl = new BigNumber(0);
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const portfolioStatsTvl = PortfolioStatsTvl.reducer;