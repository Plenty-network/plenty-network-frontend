import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber } from "bignumber.js";
import { fetchTotalVotingPower } from '../../api/stake';

interface IPoolsState {
  totalVotingPower: BigNumber;
  totalVotingPowerError: boolean;
}

const initialState: IPoolsState = {
  totalVotingPower: new BigNumber(0),
  totalVotingPowerError: false,
}

export const getTotalVotingPower = createAsyncThunk(
  'config/getTotalVotingPower',
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
      console.log('Total voting power fetching completed');
    },
    [getTotalVotingPower.rejected.toString()]: (state: any, action: any) => {
      state.totalVotingPowerError = true;
      console.log(`Error: ${action.error.message}`);
      console.log('Re-attempting to fetch total voting power.');
    },
  },
});

export const pools = PoolsSlice.reducer;