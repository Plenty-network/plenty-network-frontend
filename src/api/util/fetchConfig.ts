import axios from 'axios';
import { connectedNetwork, voterAddress as voterContractAddress } from '../../common/walletconnect';
import Config from '../../config/config';
import { AMM_TYPE, IAmmContracts, IContractsConfig, ITokenInterface, ITokens } from '../../config/types';
import { store } from '../../redux';
import { getTzktBigMapData, getTzktStorageData } from './storageProvider';
import { IGaugeExistsResponse } from './types';

export const fetchConfig = async (): Promise<IContractsConfig> => {
  try {
    const tokensUrl: string = `${Config.TOKENS_CONFIG}${
      connectedNetwork === "testnet" ? "?network=testnet" : ""
    }`;
    const ammsUrl: string = `${Config.AMM_CONFIG}${
      connectedNetwork === "testnet" ? "?network=testnet" : ""
    }`;
    const lpTokensUrl: string = `${Config.LP_CONFIG}${
      connectedNetwork === "testnet" ? "&network=testnet" : ""
    }`;
    const standardTokensUrl: string = `${Config.STANDARD_CONFIG}${
      connectedNetwork === "testnet" ? "&network=testnet" : ""
    }`;
    const configResult = await Promise.all([
      axios.get(tokensUrl),
      axios.get(lpTokensUrl),
      axios.get(standardTokensUrl),
      axios.get(ammsUrl),
    ]);
    if (configResult.find((result) => result.status !== 200)) {
      throw new Error("Failed to fetch the config from server.");
    } else {
      const TOKEN: ITokens = configResult[0].data;
      const LP: ITokens = configResult[1].data;
      const STANDARD: ITokens = configResult[2].data;
      const AMM: IAmmContracts = configResult[3].data;
      return {
        TOKEN,
        LP,
        STANDARD,
        AMM,
      };
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
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
 * Check whether a given pair of tokens is a tez pair(tez - other_token) or not.
 * @param tokenOneSymbol - Symbol of the first token of the pair
 * @param tokenTwoSymbol - Symbol of the second token of the pair
 */
 export const isTezPair = (
   tokenOneSymbol: string,
   tokenTwoSymbol: string
 ): boolean => {
   return tokenOneSymbol === "tez" || tokenTwoSymbol === "tez" ? true : false;
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
    return (tokenOneSymbol === "tez" && tokenTwoSymbol === "ctez") ||
    (tokenOneSymbol === "ctez" && tokenTwoSymbol === "tez")
    ? true
    : false;
  };

  /**
   * Search the config for the the token by token contract address and return the token data if found.
   * @param tokenContract - Contract address of the token to be searched in the config
   */
  export const getTokenDataByAddress = (tokenContract: string): ITokenInterface | undefined => {
    try {
      const state = store.getState();
      const TOKENS = state.config.tokens;
      const tokenSymbol = Object.keys(TOKENS).find(
        (tokenSymbol) => TOKENS[tokenSymbol].address === tokenContract
      );
      const tokenData = tokenSymbol ? TOKENS[tokenSymbol as string] : undefined;
      return tokenData;
    } catch (error: any) {
      return undefined;
    }
  };

  
  /**
   * Check if gauge exists for given pool via tzkt.
   * @param ammAddress - Contract address of the pool
   */
  export const gaugeExistsForAPool = async (ammAddress: string): Promise<IGaugeExistsResponse> => {
    try {
      const voterStorageResponse = await getTzktStorageData(voterContractAddress);
      const ammToGaugeBribeMapId = Number(voterStorageResponse.data.amm_to_gauge_bribe).toString();
      const ammToGaugeBribeResponse = await getTzktBigMapData(
        ammToGaugeBribeMapId,
        `active=true&key=${ammAddress}`
      );
      const ammToGaugeBribeData = ammToGaugeBribeResponse.data;

      if (ammToGaugeBribeData.length <= 0) {
        return {
          gaugeExists: false,
          gaugeAddress: undefined,
        };
      } else {
        const gaugeAddress =
          ammToGaugeBribeData[0].value && ammToGaugeBribeData[0].value.gauge
            ? String(ammToGaugeBribeData[0].value.gauge)
            : undefined;
        return {
          gaugeExists: gaugeAddress ? true : false,
          gaugeAddress: gaugeAddress,
        };
      }
    } catch (error: any) {
      console.log(error);
      return {
        gaugeExists: false,
        gaugeAddress: undefined,
        error: error.message,
      };
    }
  };