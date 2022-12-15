import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EvmCTAState, IAirdropStatesData, IRevealedPayload, ITextDisplayState, TextType } from "./types";

const initialState: IAirdropStatesData = {
  evmCTAState: EvmCTAState.EVM_DISCONNECTED,
  textDisplayState: {
    isVisible: false,
    textType: TextType.NONE,
    textData: undefined,
  },
  revealedData: {},
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
    addRevealed: (state, action: PayloadAction<IRevealedPayload>) => {
      state.revealedData = {
        ...state.revealedData,
        [action.payload.tezosAddress]: action.payload.revealed ,
      };
    },
  },
});

export const { setEvmCTAState, setTextDisplayState, addRevealed } = AirdropStateSlice.actions;
export const airdropState = AirdropStateSlice.reducer;
