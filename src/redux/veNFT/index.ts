import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDropDown: { votingPower: "", tokenId: "" },
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
    setisMyportfolio: (state, action) => {
      state.isMyPortfolio = false;
    },
  },
});
export const { setSelectedDropDown, setisMyportfolio } = veNFTSlice.actions;
export const veNFT = veNFTSlice.reducer;
