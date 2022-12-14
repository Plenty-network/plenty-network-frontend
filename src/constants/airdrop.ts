import { EvmCTAState } from "../redux/airdrop/types";

export const AIRDROP_ERROR_MESSAGES = {
  INVALID_TEZOS_ADDRESS: "Invalid Tezos address in request",
  NOT_ELIGIBLE: "Selected Tezos user address is not eligible for claim",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_MESSAGE: "Invalid ethereum message in request",
  MISSING_SIGNATURE: "Request has missing signature",
  REVEAL_TEZOS_ADDRESS: "Tezos address not revealed. Please click reveal",
};

export const AIRDROP_EVM_CTA_TEXTS: { [key in EvmCTAState]: string } = {
  [EvmCTAState.EVM_DISCONNECTED]: "Connect to wallet",
  [EvmCTAState.ELIGIBLE]: "Switch to Tezos tab",
  [EvmCTAState.NOT_ELIGIBLE]: "Your wallet is not eligible",
  [EvmCTAState.TEZOS_DISCONNECTED]: "Connect Tezos wallet",
  [EvmCTAState.HAS_AIRDROP_SWITCH]: "Switch Tezos address",
  [EvmCTAState.NOT_SIGNED]: "Confirm Tezos address",
  [EvmCTAState.NOT_REVEALED]: "Reveal Tezos address",
  [EvmCTAState.WRONG_NETWORK]: "Switch network",
  [EvmCTAState.LOADING]: "Loading..."
};
