import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "bignumber.js";
import { getVotesStatsData } from "../../api/portfolio/stats";
import { API_RE_ATTEMPTS } from "../../constants/global";
import { IVotesStatsData } from "./types";

const initialState: IVotesStatsData = {
  totalEpochVotingPower: new BigNumber(0),
  totalPlyLocked: new BigNumber(0),
  votesStatsFetching: false,
  votesStatsError: false,
  votesStatsAttempts: 0,
}


export const fetchVotesStatsData = createAsyncThunk(
  'positions/fetchVotesStatsData',
  async (userTezosAddress:string, thunkAPI) => {
    const res = await getVotesStatsData(userTezosAddress);
    return res;
  }
);


const PortfolioStatsVotes = createSlice({
  name: "portfolioStatsVotes",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchVotesStatsData.pending.toString()]: (state: any) => {
      state.votesStatsError = false;
      state.votesStatsFetching = true;
      console.log("Fetching votes stats data");
    },
    [fetchVotesStatsData.fulfilled.toString()]: (state: any, action: any) => {
      state.votesStatsError = false;
      state.votesStatsAttempts = 0;
      state.votesStatsFetching = false;
      state.totalEpochVotingPower = action.payload.totalEpochVotingPower;
      state.totalPlyLocked = action.payload.totalPlyLocked;
      console.log("Votes stats data fetching completed");
    },
    [fetchVotesStatsData.rejected.toString()]: (state: any, action: any) => {
      state.votesStatsFetching = false;
      if (state.votesStatsAttempts < API_RE_ATTEMPTS) {
        state.votesStatsError = true;
        state.votesStatsAttempts += 1;
        console.log("Re-attempting to fetch votes stats data.");
      }
      state.totalEpochVotingPower = new BigNumber(0);
      state.totalPlyLocked = new BigNumber(0);
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const portfolioStatsVotes = PortfolioStatsVotes.reducer;