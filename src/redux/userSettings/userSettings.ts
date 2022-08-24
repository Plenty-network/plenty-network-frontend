import { createSlice } from "@reduxjs/toolkit";

interface IuserSettingsState {
  settings: {
    [key: string]: {
      expertMode: boolean;
      multiHop: boolean;
      slippage: number;
    };
  };
}

const initialState: IuserSettingsState = {
  settings: {
    "": {
      expertMode: false,
      multiHop: true,
      slippage: 0.5,
    },
  },
};

const UserSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    setUserSettingsExpertMode: (state, action) => {
      return {
        settings: {
          ...state.settings,

          [action.payload.address]: {
            multiHop: state.settings[action.payload.address]?.multiHop
              ? state.settings[action.payload.address]?.multiHop
              : true,
            expertMode: action.payload.expertMode,
            slippage: state.settings[action.payload.address]?.slippage
              ? state.settings[action.payload.address]?.slippage
              : 0.5,
          },
        },
      };
    },
    setUserSettingsMultihop: (state, action) => {
      return {
        settings: {
          ...state.settings,
          [action.payload.address]: {
            expertMode: state.settings[action.payload.address]?.expertMode
              ? state.settings[action.payload.address]?.expertMode
              : false,
            multiHop: action.payload.multiHop,
            slippage: state.settings[action.payload.address]?.slippage
              ? state.settings[action.payload.address]?.slippage
              : 0.5,
          },
        },
      };
    },
    setUserSettingsSlippage: (state, action) => {
      return {
        settings: {
          ...state.settings,
          [action.payload.address]: {
            expertMode: state.settings[action.payload.address]?.expertMode
              ? state.settings[action.payload.address]?.expertMode
              : false,
            multiHop: state.settings[action.payload.address]?.multiHop
              ? state.settings[action.payload.address]?.multiHop
              : true,

            slippage: action.payload.slippage,
          },
        },
      };
    },
  },
});
export const { setUserSettingsExpertMode, setUserSettingsMultihop, setUserSettingsSlippage } =
  UserSettingsSlice.actions;
export const userSettings = UserSettingsSlice.reducer;
