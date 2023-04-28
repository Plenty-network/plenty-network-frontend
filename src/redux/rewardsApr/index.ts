import { BigNumber } from "bignumber.js";
import { fetchRewardsAprEstimate } from "../../api/votes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRewardsAprEstimateArguments, IRewardsAprState } from "./types";
import { API_RE_ATTEMPTS } from "../../constants/global";

const initialState: IRewardsAprState = {
  rewardsAprEstimate: new BigNumber(0),
  rewardsAprEstimateFetching: false,
  rewardsAprEstimateError: false,
  rewardsAprEstimateAttempts: 0
}

export const getRewardsAprEstimate = createAsyncThunk(
  'rewardsApr/getRewardsAprEstimate',
  async ({totalVotingPower, tokenPrices}: IRewardsAprEstimateArguments, thunkAPI) => {
    const res = await fetchRewardsAprEstimate(totalVotingPower, tokenPrices);
    return res;
  }
);

const RewardsAprSlice = createSlice({
  name: 'rewardsApr',
  initialState,
  reducers: {},
  extraReducers: {
    [getRewardsAprEstimate.pending.toString()]: (state: any) => {
      state.rewardsAprEstimateFetching = true;
      state.rewardsAprEstimateError = false;
      console.log('Fetching rewards APR estimate');
    },
    [getRewardsAprEstimate.fulfilled.toString()]: (state: any, action: any) => {
      state.rewardsAprEstimate = action.payload;
      state.rewardsAprEstimateError = false;
      state.rewardsAprEstimateAttempts = 0;
      state.rewardsAprEstimateFetching = false;
      console.log('Rewards APR estimate fetching completed');
    },
    [getRewardsAprEstimate.rejected.toString()]: (state: any, action: any) => {
      if (state.rewardsAprEstimateAttempts < (API_RE_ATTEMPTS)) {
        state.rewardsAprEstimateError = true;
        state.rewardsAprEstimateAttempts += 1;
        console.log('Re-attempting to fetch rewards APR estimate.');
      }
      // state.rewardsAprEstimate = new BigNumber(0);
      state.rewardsAprEstimateFetching = false;
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const rewardsApr = RewardsAprSlice.reducer;