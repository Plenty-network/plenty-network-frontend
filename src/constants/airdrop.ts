import { Mission } from "../api/airdrop/types";
import { EvmCTAState } from "../redux/airdrop/types";

export const AIRDROP_ERROR_MESSAGES: { [message: string]: string } = {
  INVALID_TEZOS_ADDRESS: "Invalid Tezos address in request",
  NOT_ELIGIBLE: "Selected Tezos user address is not eligible for claim",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_MESSAGE: "Invalid ethereum message in request",
  MISSING_SIGNATURE: "Request has missing signature",
  GET_TEZ_FOR_FEES: "Tezos address is new. Please get some XTZ.",
  UNABLE_TO_SUBMIT: "Unable to submit signature. Please retry.",
};
export const AIRDROP_ERROR_MESSAGESS = [
  { INVALID_TEZOS_ADDRESS: "Invalid Tezos address in request" },
  { NOT_ELIGIBLE: "Selected Tezos user address is not eligible for claim" },
  { INTERNAL_SERVER_ERROR: "Internal server error" },
  { INVALID_MESSAGE: "Invalid ethereum message in request" },
  { MISSING_SIGNATURE: "Request has missing signature" },
  { REVEAL_TEZOS_ADDRESS: "Tezos address not revealed. Please click reveal" },
];

export const AIRDROP_EVM_CTA_TEXTS: { [key in EvmCTAState]: string } = {
  [EvmCTAState.EVM_DISCONNECTED]: "Connect to wallet",
  [EvmCTAState.ELIGIBLE]: "Switch to Tezos tab",
  [EvmCTAState.NOT_ELIGIBLE]: "Your wallet is not eligible",
  [EvmCTAState.TEZOS_DISCONNECTED]: "Connect Tezos wallet",
  [EvmCTAState.HAS_AIRDROP_SWITCH]: "Switch Tezos address",
  [EvmCTAState.NOT_SIGNED]: "Confirm Tezos address",
  [EvmCTAState.WRONG_NETWORK]: "Switch network",
  [EvmCTAState.LOADING]: "Loading...",
  [EvmCTAState.RELOAD]: "Reload",
};

export const AIRDROP_MISSIONS_FOR_DISPLAY: {
  mission: Mission;
  displayText: string;
  href: string;
}[] = [
  {
    mission: Mission.ELIGIBLE,
    displayText: "Allow Plenty to tweet about the airdrop on your behalf",
    href: "",
  },
  {
    mission: Mission.TRADE,
    displayText: "Make a trade on Plenty",
    href: "/swap",
  },
  {
    mission: Mission.LP,
    displayText: "Add Liquidity for any pair",
    href: "/pools",
  },
  {
    mission: Mission.STAKE,
    displayText: "Stake the liquidity position in a gauge",
    href: "/pools",
  },
  {
    mission: Mission.LOCK,
    displayText: "Lock PLY as veNFT",
    href: "/vote",
  },
  {
    mission: Mission.VOTE,
    displayText: "Vote for any pair in the gauges",
    href: "/vote",
  },
];

export const AIRDROP_TWEET_TEXT: string = "Tweeting from plenty.network";