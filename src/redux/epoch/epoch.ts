import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IEpochListObject } from "../../api/util/types";
import { getListOfEpochs } from "../../api/util/epoch";

interface IEpochState {
  currentEpoch: IEpochListObject;
  selectedEpoch: IEpochListObject;
  epochData: IEpochListObject[];
  epochFetchError: boolean;
}

const initialState: IEpochState = {
  currentEpoch: {} as IEpochListObject,
  selectedEpoch: {} as IEpochListObject,
  epochData: [],
  epochFetchError: false,
};

export const getEpochData = createAsyncThunk("config/getEpochData", async (thunkAPI) => {
  const res = await getListOfEpochs();
  if(!res.success) {
    throw new Error(res.error || "Epoch fetch error");
  }
  if(res.epochData.findIndex((data: IEpochListObject) => data.isCurrent === true) < 0) {
    throw new Error("No current epoch found");
  }
  return res;
});

const EpochSlice = createSlice({
  name: "epoch",
  initialState,
  reducers: {
    setSelectedEpoch: (state, action: any) => {
      state.selectedEpoch = action.payload;
    },
  },
  extraReducers: {
    [getEpochData.pending.toString()]: (state: any, action: any) => {
      state.epochFetchError = false;
      console.log("Fetch epoch.");
    },
    [getEpochData.fulfilled.toString()]: (state: any, action: any) => {
      const index = action.payload.epochData.findIndex(
        (data: IEpochListObject) => data.isCurrent === true
      );
      state.currentEpoch = action.payload.epochData[index];
      state.epochFetchError = false;
      state.epochData = action.payload.epochData;
      console.log('Epoch fetching completed');
    },
    [getEpochData.rejected.toString()]: (state: any, action: any) => {
      state.epochFetchError = true;
      console.log(`Error: ${action.error.message}`);
      console.log("Re-attempting to fetch epoch.");
    },
  },
});
export const { setSelectedEpoch } = EpochSlice.actions;
export const epoch = EpochSlice.reducer;
