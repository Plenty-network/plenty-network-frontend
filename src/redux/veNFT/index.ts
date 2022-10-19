import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDropDown: { votingPower: "", tokenId: "" },
  selectedDropDownLocal: { votingPower: "", tokenId: "" },
  isMyPortfolio: false,
};

const veNFTSlice = createSlice({
  name: "veNFT",
  initialState,
  reducers: {
    setSelectedDropDown: (state, action) => {
      state.selectedDropDown = {
        votingPower: action.payload.votingPower,
        tokenId: action.payload.tokenId,
      };
      state.isMyPortfolio = true;
    },
    setSelectedDropDownLocal: (state, action) => {
      state.selectedDropDownLocal = {
        votingPower: action.payload.votingPower,
        tokenId: action.payload.tokenId,
      };
      state.isMyPortfolio = true;
    },
    setisMyportfolio: (state, action) => {
      state.isMyPortfolio = false;
    },
  },
});
export const { setSelectedDropDown, setisMyportfolio, setSelectedDropDownLocal } =
  veNFTSlice.actions;
export const veNFT = veNFTSlice.reducer;
