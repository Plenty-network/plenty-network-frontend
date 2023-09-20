import { createSlice } from "@reduxjs/toolkit";
import { tokenParameterLiquidity } from "../../components/Liquidity/types";
import { ActiveLiquidity } from "../../components/Pools/ManageLiquidityHeader";

const initialState = {
  showLiquidityModalV2: false,
  tokenX: {} as tokenParameterLiquidity,
  tokenY: {} as tokenParameterLiquidity,
  isGaugeAvailable: false as boolean,
  activeState: "" as ActiveLiquidity,
};

const ManageLiquidityV2Slice = createSlice({
  name: "ManageLiquidityV2",
  initialState,
  reducers: {
    setTokenXV2: (state, action) => {
      state.tokenX = action.payload;
    },
    setTokenYV2: (state, action) => {
      state.tokenY = action.payload;
    },
    setShowLiquidityModalV2: (state, action) => {
      state.showLiquidityModalV2 = action.payload;
    },

    setActiveStatev2: (state, action) => {
      state.activeState = action.payload;
    },
    setIsGaugeAvailable: (state, action) => {
      state.isGaugeAvailable = action.payload;
    },
  },
});
export const {
  setShowLiquidityModalV2,
  setTokenXV2,
  setTokenYV2,
  setActiveStatev2,
  setIsGaugeAvailable,
} = ManageLiquidityV2Slice.actions;
export const ManageLiquidityV2 = ManageLiquidityV2Slice.reducer;
