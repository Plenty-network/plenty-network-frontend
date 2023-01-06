import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber } from "bignumber.js";
import { fetchTotalVotingPower } from '../../api/stake';
import { API_RE_ATTEMPTS } from '../../constants/global';

interface IPoolsState {
  totalVotingPower: BigNumber;
  totalVotingPowerError: boolean;
  totalVotingPowerAttempts: number;
}

const initialState: IPoolsState = {
  totalVotingPower: new BigNumber(0),
  totalVotingPowerError: false,
  totalVotingPowerAttempts: 0,
}

export const getTotalVotingPower = createAsyncThunk(
  'pools/getTotalVotingPower',
  async (thunkAPI) => {
    const res = await fetchTotalVotingPower();
    return res;
  }
);

const PoolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {},
  extraReducers: {
    [getTotalVotingPower.pending.toString()]: (state: any) => {
      state.totalVotingPowerError = false;
      console.log('Fetching total voting power');
    },
    [getTotalVotingPower.fulfilled.toString()]: (state: any, action: any) => {
      state.totalVotingPower = action.payload;
      state.totalVotingPowerError = false;
      state.totalVotingPowerAttempts = 0;
      console.log('Total voting power fetching completed');
    },
    [getTotalVotingPower.rejected.toString()]: (state: any, action: any) => {
      if (state.totalVotingPowerAttempts < (API_RE_ATTEMPTS + 3)) {
        state.totalVotingPowerError = true;
        state.totalVotingPowerAttempts += 1;
        console.log('Re-attempting to fetch total voting power.');
      }
      state.totalVotingPower = new BigNumber(0);
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const pools = PoolsSlice.reducer;