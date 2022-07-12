import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchConfig } from '../../api/util/fetchConfig';

interface ConfigState {
  tokens: { [x: string]: any };
  AMMs: { [x: string]: any };
}

const initialState: ConfigState = {
  tokens: {},
  AMMs: {},
};

export const getConfig = createAsyncThunk(
  'wallet/getConfig',
  async (thunkAPI) => {
    const res = await fetchConfig().then((resp) => resp);

    return res;
  }
);

// TODO : ADD TYPES TO state vars
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
