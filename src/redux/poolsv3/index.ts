import { createSlice } from "@reduxjs/toolkit";
import { initialBoundaries } from "../../api/v3/types";
import { tokenParameterLiquidity } from "../../components/Liquidity/types";

const initialState = {
  isFullRange: false,
  isBrushChanged: false,
  isLoading: false,
  Rightdiff: "0",
  Leftdiff: "0",
  leftRangeInput: 0,
  RightRangeInput: 0,
  leftbrush: 0,
  rightbrush: 0,
  currentPrice: 0,
  BRightdiff: "0",
  BLeftdiff: "0",
  BleftRangeInput: 0,
  BRightRangeInput: 0,
  Bleftbrush: 0,
  Brightbrush: 0,
  BcurrentPrice: 0,
  topLevelSelectedToken: {} as tokenParameterLiquidity,
  tokenIn: {} as tokenParameterLiquidity,
  tokenOut: {} as tokenParameterLiquidity,
  tokenInOrg: {} as tokenParameterLiquidity,
  tokenOutOrg: {} as tokenParameterLiquidity,
  minTickA: 0,
  maxTickA: 0,
  minTickB: 0,
  maxTickB: 0,
  initBound: {} as initialBoundaries,
  BinitBound: {} as initialBoundaries,
};

const PoolsV3Slice = createSlice({
  name: "PoolsV3",
  initialState,
  reducers: {
    setFullRange: (state, action) => {
      state.isFullRange = action.payload;
    },
    setIsRightDiff: (state, action) => {
      state.Rightdiff = action.payload.Rightdiff;
    },
    setInitBound: (state, action) => {
      state.initBound = action.payload;
    },
    setBInitBound: (state, action) => {
      state.BinitBound = action.payload;
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
      console.log("fulls", action.payload);
      state.leftbrush = action.payload;
    },
    setrightbrush: (state, action) => {
      console.log("fulls", action.payload);
      state.rightbrush = action.payload;
    },
    setcurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
    setBIsRightDiff: (state, action) => {
      state.BRightdiff = action.payload;
    },
    setBIsLeftDiff: (state, action) => {
      state.BLeftdiff = action.payload;
    },
    setBleftRangeInput: (state, action) => {
      state.BleftRangeInput = action.payload;
    },
    setBRightRangeInput: (state, action) => {
      state.BRightRangeInput = action.payload;
    },
    setBleftbrush: (state, action) => {
      state.Bleftbrush = action.payload;
    },
    setBrightbrush: (state, action) => {
      state.Brightbrush = action.payload;
    },
    setBcurrentPrice: (state, action) => {
      state.BcurrentPrice = action.payload;
    },
    settopLevelSelectedToken: (state, action) => {
      state.topLevelSelectedToken = action.payload;
    },
    setTokenInV3: (state, action) => {
      state.tokenIn = action.payload;
    },
    setTokeOutV3: (state, action) => {
      state.tokenOut = action.payload;
    },
    setTokenInOrg: (state, action) => {
      state.tokenInOrg = action.payload;
    },
    setTokeOutOrg: (state, action) => {
      state.tokenOutOrg = action.payload;
    },
    setminTickA: (state, action) => {
      state.minTickA = action.payload;
    },
    setmaxTickA: (state, action) => {
      state.maxTickA = action.payload;
    },
    setminTickB: (state, action) => {
      state.minTickB = action.payload;
    },
    setmaxTickB: (state, action) => {
      state.maxTickB = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsBrushChanged: (state, action) => {
      state.isBrushChanged = action.payload;
    },
  },
});
export const {
  setFullRange,
  setInitBound,
  setBInitBound,
  setIsBrushChanged,
  setminTickA,
  setIsLoading,
  setmaxTickA,
  setminTickB,
  setmaxTickB,
  setTokenInOrg,
  setTokeOutOrg,
  setTokenInV3,
  setTokeOutV3,
  setIsRightDiff,
  setIsLeftDiff,
  setleftRangeInput,
  setRightRangeInput,
  setleftbrush,
  setrightbrush,
  setcurrentPrice,
  settopLevelSelectedToken,
  setBIsRightDiff,
  setBIsLeftDiff,
  setBleftRangeInput,
  setBRightRangeInput,
  setBleftbrush,
  setBrightbrush,
  setBcurrentPrice,
} = PoolsV3Slice.actions;
export const poolsv3 = PoolsV3Slice.reducer;
