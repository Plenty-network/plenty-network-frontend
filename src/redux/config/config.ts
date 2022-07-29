import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchConfig } from '../../api/util/fetchConfig';
import { IAmmContracts, ITokens } from '../../config/types';

interface ConfigState {
  tokens: ITokens;
  AMMs: IAmmContracts;
  standard: ITokens;
  lp: ITokens;
}

const initialState: ConfigState = {
  tokens: {},
  AMMs: {},
  standard: {},
  lp: {},
};

export const getConfig = createAsyncThunk(
  'config/getConfig',
  async (thunkAPI) => {
    const res = await fetchConfig();
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
      //   state.tokens = {};
      //   state.AMMs = {};
      //   state.standard = {};
      //   state.lp = {};
      console.log('Fetching config');
    },
    [getConfig.fulfilled.toString()]: (state: any, action: any) => {
      console.log(action.payload);
      state.tokens = action.payload.TOKEN;
      state.AMMs = action.payload.AMM;
      state.standard = action.payload.STANDARD;
      state.lp = action.payload.LP;
      console.log('done');
    },
    [getConfig.rejected.toString()]: (state: any, action: any) => {
      // state.tokens = {};
      // state.AMMs = {};
      // state.standard = {};
      // state.lp = {};
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const config = ConfigSlice.reducer;
