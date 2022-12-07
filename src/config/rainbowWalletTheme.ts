import merge from "lodash-es/merge";
import { Theme, midnightTheme } from "@rainbow-me/rainbowkit";

/* Extending the default midnight theme provided by RainbowKit with custom colors */
export const customTheme = merge(midnightTheme(), {
  colors: {
    accentColor: "#9d5cff",
    modalBackground: "#0e0817",
    modalBorder: "#282230",
    closeButtonBackground: "#0e0817",
  },
} as Theme);
