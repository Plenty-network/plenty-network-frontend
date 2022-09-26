import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "bignumber.js";
import { getAllLocksRewardsData, getAllRewardsOperationsData } from "../../api/portfolio/kiran";
import { API_RE_ATTEMPTS } from "../../constants/global";
import { IAllLocksRewardArgument, IPorfolioRewardsData } from "./types";

const initialState: IPorfolioRewardsData = {
  allLocksRewardsData: {},
  totalTradingFeesAmount: new BigNumber(0),
  totalBribesAmount: new BigNumber(0),
  epochClaimData: {},
  feesClaimData: [],
  bribesClaimData: [],
  locksRewardsDataError: false,
  locksRewardsDataAttempts: 0,
  rewardsOperationDataError: false,
  rewardsOperationDataAttempts: 0,
};

// Unclaimed Rewards(Bribes & Fees) data fetch for all user locks
export const fetchAllLocksRewardsData = createAsyncThunk(
  'rewards/fetchAllLocksRewardsData',
  async ({userTezosAddress, tokenPrices}: IAllLocksRewardArgument, thunkAPI) => {
    const res = await getAllLocksRewardsData(userTezosAddress, tokenPrices);
    return res;
  }
);

// Unclaimed rewards data for operations fetch for all user locks
export const fetchAllRewardsOperationsData = createAsyncThunk(
  'rewards/fetchAllRewardsOperationsData',
  async (userTezosAddress: string, thunkAPI) => {
    const res = await getAllRewardsOperationsData(userTezosAddress);
    return res;
  }
);

const PortfolioRewards = createSlice({
  name: 'portfolioRewards',
  initialState,
  reducers: {},
  extraReducers: {
    // Unclaimed Rewards(Bribes & Fees) data fetch for all user locks
    [fetchAllLocksRewardsData.pending.toString()]: (state: any) => {
      state.locksRewardsDataError = false;
      console.log('Fetching all locks rewards data');
    },
    [fetchAllLocksRewardsData.fulfilled.toString()]: (state: any, action: any) => {
      state.locksRewardsDataError = false;
      state.locksRewardsDataAttempts = 0;
      state.allLocksRewardsData = action.payload.allLocksRewardsData;
      state.totalTradingFeesAmount = action.payload.totalTradingFeesAmount;
      state.totalBribesAmount = action.payload.totalBribesAmount;
      console.log('All locks rewards data fetching completed');
    },
    [fetchAllLocksRewardsData.rejected.toString()]: (state: any, action: any) => {
      if(state.locksRewardsDataAttempts < API_RE_ATTEMPTS) {
        state.locksRewardsDataError = true;
        state.locksRewardsDataAttempts += 1;
        console.log('Re-attempting to fetch all locks rewards data.');
      } else {
        state.locksRewardsDataAttempts = 0;
      }
      state.allLocksRewardsData = {};
      state.totalTradingFeesAmount = new BigNumber(0);
      state.totalBribesAmount = new BigNumber(0);
      console.log(`Error: ${action.error.message}`);
    },
    // Unclaimed rewards data for operations fetch for all user locks
    [fetchAllRewardsOperationsData.pending.toString()]: (state: any) => {
      state.rewardsOperationDataError = false;
      console.log('Fetching all rewards operations data');
    },
    [fetchAllRewardsOperationsData.fulfilled.toString()]: (state: any, action: any) => {
      state.rewardsOperationDataError = false;
      state.rewardsOperationDataAttempts = 0;
      state.epochClaimData = action.payload.epochClaimData;
      state.bribesClaimData = action.payload.bribesClaimData;
      state.feesClaimData = action.payload.feesClaimData;
      console.log('All rewards operations data fetching completed');
    },
    [fetchAllRewardsOperationsData.rejected.toString()]: (state: any, action: any) => {
      if(state.rewardsOperationDataAttempts < API_RE_ATTEMPTS) {
        state.rewardsOperationDataError = true;
        state.rewardsOperationDataAttempts += 1;
        console.log('Re-attempting to fetch all rewards operations data.');
      } else {
        state.rewardsOperationDataAttempts = 0;
      }
      state.epochClaimData = {};
      state.bribesClaimData = [];
      state.feesClaimData = [];
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const portfolioRewards = PortfolioRewards.reducer;
