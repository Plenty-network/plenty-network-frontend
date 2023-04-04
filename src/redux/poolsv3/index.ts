import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Rightdiff: "0",
  Leftdiff: "0",
  leftRangeInput: 0,
  RightRangeInput: 0,
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
  },
});
export const { setIsRightDiff, setIsLeftDiff, setleftRangeInput, setRightRangeInput } =
  PoolsV3Slice.actions;
export const poolsv3 = PoolsV3Slice.reducer;
