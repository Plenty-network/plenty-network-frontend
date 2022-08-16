import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber } from "bignumber.js";
import { fetchTotalVotingPower } from '../../api/stake';

interface IPoolsState {
  totalVotingPower: BigNumber;
}

const initialState: IPoolsState = {
  totalVotingPower: new BigNumber(0),
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
      console.log('Fetching total voting power');
    },
    [getTotalVotingPower.fulfilled.toString()]: (state: any, action: any) => {
      state.totalVotingPower = action.payload;
      console.log('Total voting power fetching completed');
    },
    [getTotalVotingPower.rejected.toString()]: (state: any, action: any) => {
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const pools = PoolsSlice.reducer;