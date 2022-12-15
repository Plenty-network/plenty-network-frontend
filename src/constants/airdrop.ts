import { Mission } from "../api/airdrop/types";
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
  [EvmCTAState.LOADING]: "Loading...",
};

export const AIRDROP_MISSIONS_FOR_DISPLAY: { mission: Mission; displayText: string }[] = [
  {
    mission: Mission.ELIGIBLE,
    displayText: "Tweet",
  },
  {
    mission: Mission.TRADE,
    displayText: "Make a trade on Plenty",
  },
  {
    mission: Mission.LP,
    displayText: "Add Liquidity for any pair",
  },
  {
    mission: Mission.STAKE,
    displayText: "Stake the liquidity position in a gauge",
  },
  {
    mission: Mission.LOCK,
    displayText: "Lock PLY as veNFT",
  },
  {
    mission: Mission.VOTE,
    displayText: "Vote for any pair in the guages",
  },
];
