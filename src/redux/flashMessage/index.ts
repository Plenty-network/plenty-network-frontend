import { createSlice } from "@reduxjs/toolkit";
import { Flashtype } from "../../components/FlashScreen";
import { IFlashMessageProps } from "./type";

export const initialState: IFlashMessageProps = {
  flashType: Flashtype.Info,
  headerText: "",
  trailingText: "",
  linkText: "",
  isLoading: false,
  onClick: () => {},
  transactionId: "",
};

const flashMessages = createSlice({
  name: "flashMessage",
  initialState,
  reducers: {
    setFlashMessage: (state, action: { type: any; payload: IFlashMessageProps }) => {
      console.log(action.payload.transactionId);
      state.isLoading = action.payload.isLoading;
      state.flashType = action.payload.flashType;
      state.transactionId = action.payload.transactionId;
      state.headerText = action.payload.headerText;
      state.trailingText = action.payload.trailingText;
      state.linkText = action.payload.linkText;
      state.onClick = action.payload.onClick;
    },
    unsetFlashMessage: (state) => {
      state.isLoading = false;
    },
  },
});
export const { setFlashMessage, unsetFlashMessage } = flashMessages.actions;
export const flashMessage = flashMessages.reducer;
