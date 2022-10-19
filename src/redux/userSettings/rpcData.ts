import { createSlice } from "@reduxjs/toolkit";

interface IRpcNodeData {
  rpcNode: undefined | string;
}

const initialState: IRpcNodeData = {
  rpcNode: undefined,
};

const rpcDataSlice = createSlice({
  name: "rpcData",
  initialState,
  reducers: {
    setRpcNode: (state, action: any) => {
      state.rpcNode = action.payload;
    },
  },
});

export const { setRpcNode } = rpcDataSlice.actions;
export const rpcData = rpcDataSlice.reducer;
