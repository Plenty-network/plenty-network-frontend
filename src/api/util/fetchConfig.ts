import axios from 'axios';
import Config from '../../config/config';
import { AMM_TYPE, IAmmContracts, IContractsConfig, ITokens } from '../../config/types';
import { store } from '../../redux';

export const fetchConfig = async () : Promise<IContractsConfig> => {
  const token_response = await axios.get(Config.TOKENS_CONFIG);
  const lp_response = await axios.get(Config.LP_CONFIG);
  const standard_response = await axios.get(Config.STANDARD_CONFIG);
  const amms_response = await axios.get(Config.AMM_CONFIG);

  const TOKEN: ITokens = token_response.data;
  const LP: ITokens = lp_response.data;
  const STANDARD: ITokens = standard_response.data;
  const AMM: IAmmContracts = amms_response.data;
  return {
    TOKEN: TOKEN,
    LP: LP,
    STANDARD: STANDARD,
    AMM: AMM,
  };
};

export const getDexAddress = (tokenIn: string, tokenOut: string): string => {
  const state = store.getState();
  const AMM = state.config.AMMs;

  const address = Object.keys(AMM).find(
    (key) =>
    (AMM[key].token1.symbol === tokenIn &&
      AMM[key].token2.symbol === tokenOut) ||
    (AMM[key].token2.symbol === tokenIn &&
      AMM[key].token1.symbol === tokenOut)
  );

  return address ?? 'false';
};

export const getDexType = (tokenIn: string, tokenOut: string): string => {
  const state = store.getState();
  const AMM = state.config.AMMs;

  const address = Object.keys(AMM).find(
    (key) =>
    (AMM[key].token1.symbol === tokenIn &&
      AMM[key].token2.symbol === tokenOut) ||
    (AMM[key].token2.symbol === tokenIn &&
      AMM[key].token1.symbol === tokenOut)
  );
  
  return address ? AMM[address].type : 'false';
};

/**
 * Returns the LP token symbol for given pair of tokens.
 * @param tokenOneSymbol - Symbol of token one of the pair.
 * @param tokenTwoSymbol - Symbol of token two of the pair.
 * @returns Symbol of the LP token.
 */
export const getLpTokenSymbol = (tokenOneSymbol: string, tokenTwoSymbol: string): string | undefined => {
  const state = store.getState();
  const AMMs = state.config.AMMs;

  const tokensAmm = Object.keys(AMMs).find(
    (ammAddress) =>
      (AMMs[ammAddress].token1.symbol === tokenOneSymbol &&
        AMMs[ammAddress].token2.symbol === tokenTwoSymbol) ||
      (AMMs[ammAddress].token2.symbol === tokenOneSymbol &&
        AMMs[ammAddress].token1.symbol === tokenTwoSymbol)
  );
  
  return tokensAmm ? AMMs[tokensAmm].lpToken.symbol : undefined;

};

/**
 * Check whether a given pair of tokens is volatile pair or not.
 * @param tokenOneSymbol - Symbol of the first token of the pair
 * @param tokenTwoSymbol - Symbol of the second token of the pair
 */
export const isVolatilePair = (
  tokenOneSymbol: string,
  tokenTwoSymbol: string
): boolean => {
  const dexType = getDexType(tokenOneSymbol, tokenTwoSymbol);
  return dexType !== "false" && dexType === AMM_TYPE.VOLATILE ? true : false;
};

/**
 * Check whether a given pair of tokens is general stable pair (excluding ctez-tez) or not.
 * @param tokenOneSymbol - Symbol of the first token of the pair
 * @param tokenTwoSymbol - Symbol of the second token of the pair
 */
 export const isGeneralStablePair = (
   tokenOneSymbol: string,
   tokenTwoSymbol: string
 ): boolean => {
   const dexType = getDexType(tokenOneSymbol, tokenTwoSymbol);
   return dexType !== "false" && dexType === AMM_TYPE.STABLE
     ? tokenOneSymbol !== "tez" && tokenTwoSymbol !== "tez"
       ? true
       : false
     : false;
 };

/**
 * Check whether a given pair of tokens is ctez-tez pair or not.
 * @param tokenOneSymbol - Symbol of the first token of the pair
 * @param tokenTwoSymbol - Symbol of the second token of the pair
 */
 export const isCtezTezPair = (
   tokenOneSymbol: string,
   tokenTwoSymbol: string
 ): boolean => {
   const dexType = getDexType(tokenOneSymbol, tokenTwoSymbol);
   return dexType !== "false" && dexType === AMM_TYPE.STABLE
     ? (tokenOneSymbol === "tez" && tokenTwoSymbol === "ctez") ||
       (tokenOneSymbol === "ctez" && tokenTwoSymbol === "tez")
       ? true
       : false
     : false;
 };