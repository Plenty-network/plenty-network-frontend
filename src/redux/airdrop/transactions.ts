import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAirdropTransactionsData,
  // IReceiptsCallPayload,
  // ISignaturePayload,
  // ReceiptsCallFrom,
} from "./types";

const initialState: IAirdropTransactionsData = {
  // signaturesData: {},
  // receiptsCallFrom: {},
  tweetedAccounts: [],
};

const AirdropTransactionsSlice = createSlice({
  name: "airdropTransactions",
  initialState,
  reducers: {
    // addSignature: (state, action: PayloadAction<ISignaturePayload>) => {
    //   state.signaturesData = {
    //     ...state.signaturesData,
    //     [action.payload.evmAddress]: { ...action.payload.signatureData },
    //   };
    // },
    // setReceiptsCallFrom: (state, action: PayloadAction<IReceiptsCallPayload>) => {
    //   state.receiptsCallFrom = {
    //     ...state.receiptsCallFrom,
    //     [action.payload.tezosAddress]: action.payload.receiptsCallFrom,
    //   };
    // },
    addTweetedAccount: (state, action: PayloadAction<string>) => {
      state.tweetedAccounts = state.tweetedAccounts.concat(action.payload);
    },
  },
});

// export const { addSignature, setReceiptsCallFrom, addTweetedAccount } =
//   AirdropTransactionsSlice.actions;
export const { addTweetedAccount } = AirdropTransactionsSlice.actions;
export const airdropTransactions = AirdropTransactionsSlice.reducer;