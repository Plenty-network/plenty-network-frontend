import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchConfig } from "../../api/util/fetchConfig";
import { IAmmContracts, IGaugeConfig, ITokens } from "../../config/types";

interface ConfigState {
  tokens: ITokens;
  AMMs: IAmmContracts;
  standard: ITokens;
  lp: ITokens;
  gauges: IGaugeConfig;
}

const initialState: ConfigState = {
  tokens: {},
  AMMs: {},
  standard: {},
  lp: {},
  gauges: {},
};

export const getConfig = createAsyncThunk("config/getConfig", async (thunkAPI) => {
  const res = await fetchConfig();
  return res;
});

const ConfigSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    createGaugeConfig: (state) => {
      const AMMs = state.AMMs;
      const gaugeConfigData: IGaugeConfig = {};

      Object.keys(AMMs).forEach((amm) => {
        if (AMMs[amm].gaugeAddress) {
          gaugeConfigData[AMMs[amm].gaugeAddress as string] = {
            ammAddress: amm,
            ammType: AMMs[amm].type,
            tokenOneSymbol: AMMs[amm].token1.symbol,
            tokenTwoSymbol: AMMs[amm].token2.symbol,
          };
        }
      });

      state.gauges = gaugeConfigData;
    },
  },
  extraReducers: {
    [getConfig.pending.toString()]: (state: any) => {
      console.log("Fetching config");
    },
    [getConfig.fulfilled.toString()]: (state: any, action: any) => {
      state.tokens = action.payload.TOKEN;
      state.AMMs = action.payload.AMM;
      state.standard = action.payload.STANDARD;
      state.lp = action.payload.LP;
      console.log("config fetching completed");
    },
    [getConfig.rejected.toString()]: (state: any, action: any) => {
      console.log(`Error: ${action.error.message}`);
    },
  },
});

export const { createGaugeConfig } = ConfigSlice.actions;
export const config = ConfigSlice.reducer;
