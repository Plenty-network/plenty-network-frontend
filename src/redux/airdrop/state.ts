import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EvmCTAState, IAirdropStatesData, ITextDisplayState, TextType } from "./types";

const initialState: IAirdropStatesData = {
  evmCTAState: EvmCTAState.EVM_DISCONNECTED,
  textDisplayState: {
    isVisible: false,
    textType: TextType.NONE,
    textData: undefined,
  },
};

const AirdropStateSlice = createSlice({
  name: "airdropStates",
  initialState,
  reducers: {
    setEvmCTAState: (state, action: PayloadAction<EvmCTAState>) => {
      state.evmCTAState = action.payload;
    },
    setTextDisplayState: (state, action: PayloadAction<ITextDisplayState>) => {
      state.textDisplayState = action.payload;
    },
  },
});

export const { setEvmCTAState, setTextDisplayState } = AirdropStateSlice.actions;
export const airdropState = AirdropStateSlice.reducer;
