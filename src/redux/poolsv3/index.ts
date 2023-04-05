import { createSlice } from "@reduxjs/toolkit";
import { tokenParameterLiquidity } from "../../components/Liquidity/types";

const initialState = {
  Rightdiff: "0",
  Leftdiff: "0",
  leftRangeInput: 0,
  RightRangeInput: 0,
  leftbrush: 0,
  rightbrush: 0,
  currentPrice: 0,
  topLevelSelectedToken: {} as tokenParameterLiquidity,
};

const PoolsV3Slice = createSlice({
  name: "PoolsV3",
  initialState,
  reducers: {
    setIsRightDiff: (state, action) => {
      state.Rightdiff = action.payload.Rightdiff;
    },
    setIsLeftDiff: (state, action) => {
      state.Leftdiff = action.payload.LeftDiff;
    },
    setleftRangeInput: (state, action) => {
      state.leftRangeInput = action.payload;
    },
    setRightRangeInput: (state, action) => {
      state.RightRangeInput = action.payload;
    },
    setleftbrush: (state, action) => {
      state.leftbrush = action.payload;
    },
    setrightbrush: (state, action) => {
      state.rightbrush = action.payload;
    },
    setcurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
    settopLevelSelectedToken: (state, action) => {
      state.topLevelSelectedToken = action.payload;
    },
  },
});
export const {
  setIsRightDiff,
  setIsLeftDiff,
  setleftRangeInput,
  setRightRangeInput,
  setleftbrush,
  setrightbrush,
  setcurrentPrice,
  settopLevelSelectedToken,
} = PoolsV3Slice.actions;
export const poolsv3 = PoolsV3Slice.reducer;
