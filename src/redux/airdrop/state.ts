import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "bignumber.js";
import { EvmCTAState, IAirdropStatesData, ITextDisplayState, TextType } from "./types";

const initialState: IAirdropStatesData = {
  evmCTAState: EvmCTAState.EVM_DISCONNECTED,
  textDisplayState: {
    isVisible: false,
    textType: TextType.NONE,
    textData: undefined,
  },
  ethClaimAmount: new BigNumber(0),
  reloadTrigger: false,
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
    setEthClaimAmount: (state, action: PayloadAction<BigNumber>) => {
      state.ethClaimAmount = action.payload;
    },
    setReloadTrigger: (state) => {
      state.reloadTrigger  = !state.reloadTrigger;
    },
  },
});

export const { setEvmCTAState, setTextDisplayState, setEthClaimAmount, setReloadTrigger } = AirdropStateSlice.actions;
export const airdropState = AirdropStateSlice.reducer;
