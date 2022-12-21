import { createSlice } from "@reduxjs/toolkit";

interface DisclaimerState {
  address: {
    [key: string]: boolean;
  };
}

const initialState: DisclaimerState = {
  address: {
    "": false,
  },
};

const DisclaimerSlice = createSlice({
  name: "airdropTransactions",
  initialState,
  reducers: {
    setDisclaimer: (state, action) => {
      return {
        address: {
          ...state.address,

          [action.payload.address]: [action.payload.isChecked],
        },
      };
    },
  },
});

export const { setDisclaimer } = DisclaimerSlice.actions;
export const Disclaimer = DisclaimerSlice.reducer;
