import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchConfig } from '../../api/utils';

interface ConfigState {
  tokens: {};
  AMMs: {};
}

const initialState: ConfigState = {
  tokens: {},
  AMMs: {},
};

export const getConfig = createAsyncThunk(
  'wallet/getConfig',
  async (thunkAPI) => {
    const res = await fetchConfig().then((resp) => resp);
    console.log(res);
    return res;
  }
);

const ConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: {
    [getConfig.pending.toString()]: (state: any) => {
      state.tokens = {};
      state.AMMs = {};
    },
    [getConfig.fulfilled.toString()]: (state: any, action: any) => {
      console.log(action);
      state.tokens = action.payload.TOKEN;
      state.AMMs = action.payload.AMM;
    },
    [getConfig.rejected.toString()]: (state: any) => {
      state.tokens = {};
      state.AMMs = {};
    },
  },
});

export const config = ConfigSlice.reducer;
