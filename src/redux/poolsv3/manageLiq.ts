import { createSlice } from "@reduxjs/toolkit";
import { tokenParameterLiquidity } from "../../components/Liquidity/types";
import { ActiveLiquidity } from "../../components/Pools/ManageLiquidityHeader";

const initialState = {
  showLiquidityModalV3: false,
  tokenX: {} as tokenParameterLiquidity,
  tokenY: {} as tokenParameterLiquidity,
  feeTier: "",
  activeState: "" as ActiveLiquidity,
};

const ManageLiquidityV3Slice = createSlice({
  name: "ManageLiquidityV3",
  initialState,
  reducers: {
    setTokenXV3: (state, action) => {
      state.tokenX = action.payload;
    },
    setTokenYV3: (state, action) => {
      state.tokenY = action.payload;
    },
    setShowLiquidityModalV3: (state, action) => {
      state.showLiquidityModalV3 = action.payload;
    },
    setFeeTier: (state, action) => {
      state.feeTier = action.payload;
    },
    setActiveStatev3: (state, action) => {
      state.activeState = action.payload;
    },
  },
});
export const { setShowLiquidityModalV3, setTokenXV3, setTokenYV3, setFeeTier, setActiveStatev3 } =
  ManageLiquidityV3Slice.actions;
export const ManageLiquidityV3 = ManageLiquidityV3Slice.reducer;
