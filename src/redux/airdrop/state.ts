import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "bignumber.js";
import { EvmCTAState, IAirdropStatesData, IRevealedPayload, ITextDisplayState, TextType } from "./types";

const initialState: IAirdropStatesData = {
  evmCTAState: EvmCTAState.EVM_DISCONNECTED,
  textDisplayState: {
    isVisible: false,
    textType: TextType.NONE,
    textData: undefined,
  },
  revealedData: {},
  ethClaimAmount: new BigNumber(0),
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
    setEthClaimAmount: (state, action: PayloadAction<BigNumber>) => {
      state.ethClaimAmount = action.payload;
    },
  },
});

export const { setEvmCTAState, setTextDisplayState, addRevealed, setEthClaimAmount } = AirdropStateSlice.actions;
export const airdropState = AirdropStateSlice.reducer;
