import { createSlice } from "@reduxjs/toolkit";
import { IFlashMessageProps } from "./type";

export const initialState: {[key:string]:IFlashMessageProps} = {
  
};

const flashMessages = createSlice({
  name: "flashMessage",
  initialState,
  reducers: {
    setFlashMessage: (state, action: { type: any; payload: IFlashMessageProps }) => {
      if(action.payload.key){
        state[action.payload.key]=action.payload}
    },
    unsetFlashMessage: (state,action:{type:any,payload:{key:string}}) => {
      const next = {...state}
      delete next[action.payload.key]
      return next
    },
  },
});
export const { setFlashMessage, unsetFlashMessage } = flashMessages.actions;
export const flashMessage = flashMessages.reducer;
