import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAirdropTransactionsData, ISignaturePayload, ReceiptsCallFrom } from "./types";

const initialState: IAirdropTransactionsData = {
  signaturesData: {},
  receiptsCallFrom: ReceiptsCallFrom.TEZOS,
};

const AirdropTransactionsSlice = createSlice({
  name: "airdropTransactions",
  initialState,
  reducers: {
    addSignature: (state, action: PayloadAction<ISignaturePayload>) => {
      // const prevState = {...state.signatureData};
      // prevState[action.payload.evmAddress] = {...action.payload.signatureData};
      state.signaturesData = {
        ...state.signaturesData,
        [action.payload.evmAddress]: { ...action.payload.signatureData },
      };
    },
    setReceiptsCallFrom: (state, action: PayloadAction<ReceiptsCallFrom>) => {
      state.receiptsCallFrom = action.payload;
    },
  },
});

export const { addSignature, setReceiptsCallFrom} = AirdropTransactionsSlice.actions;
export const airdropTransactions = AirdropTransactionsSlice.reducer;