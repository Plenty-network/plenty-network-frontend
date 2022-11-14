import { TezosMessageUtils, TezosParameterFormat } from "conseiljs";
import axios from "axios";
import {
  type1MapIds,
  type2MapIds,
  type3MapIds,
  type4MapIds,
  type5MapIds,
} from "../../constants/global";
import BigNumber from "bignumber.js";
import { ITokenInterface, TokenVariant } from "../../config/types";
import { packDataBytes, unpackDataBytes } from "@taquito/michel-codec";
import { store } from "../../redux";
import { dappClient, getRpcNode } from "../../common/walletconnect";
import {
  IBalanceResponse,
  IAllBalanceResponse,
  IPnlpBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "./types";
import { getDexAddress, getLpTokenSymbol, getTokenDataByAddress } from "./fetchConfig";
import { getBigMapData, getStorage, getTzktTokenData } from "./storageProvider";
import { gaugeStorageType } from "../rewards/data";

/**
 * Returns packed key (expr...) which will help to fetch user specific data from bigmap directly using rpc.
 * @param tokenId - Id of map from where you want to fetch data
 * @param address - address of the user for whom you want to fetch the data
 * @param type - FA1.2 OR FA2
 */
export const getPackedKey = (tokenId: number, address: string, type: TokenVariant): string => {
  const accountHex: string = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if (type === TokenVariant.FA2) {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `(Pair ${accountHex} ${tokenId})`,
          "",
          TezosParameterFormat.Michelson
        ),
        "hex"
      )
    );
  } else {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      Buffer.from(
        TezosMessageUtils.writePackedData(`${accountHex}`, "", TezosParameterFormat.Michelson),
        "hex"
      )
    );
  }
  return packedKey;
};

const getTzBtcBalance = async (address: string): Promise<IBalanceResponse> => {
  try {
    const tokenContractAddress: string = "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn";
    const tezos = await dappClient().tezos();
    const contract = await tezos.contract.at(tokenContractAddress);
    const storage: any = await contract.storage();
    let userBalance = new BigNumber(0);
    const packedAddress = packDataBytes({ string: address }, { prim: "address" });
    const ledgerKey: any = {
      prim: "Pair",
      args: [{ string: "ledger" }, { bytes: packedAddress.bytes.slice(12) }],
    };
    const ledgerKeyBytes = packDataBytes(ledgerKey);
    const ledgerInstance = storage[Object.keys(storage)[0]];
    const bigmapVal = await ledgerInstance.get(ledgerKeyBytes.bytes);
    if (bigmapVal) {
      const bigmapValData: any = unpackDataBytes({ bytes: bigmapVal });
      if (
        Object.prototype.hasOwnProperty.call(bigmapValData, "prim") &&
        bigmapValData.prim === "Pair"
      ) {
        userBalance = new BigNumber(bigmapValData.args[0].int).dividedBy(new BigNumber(10).pow(8));
      }
    }
    const userBal = new BigNumber(userBalance);
    return {
      success: true,
      balance: userBal,
      identifier: "tzBTC",
    };
  } catch (e) {
    return {
      success: false,
      balance: new BigNumber(0),
      identifier: "tzBTC",
      error: e,
    };
  }
};

const getTezBalance = async (address: string): Promise<IBalanceResponse> => {
  try {
    const { CheckIfWalletConnected } = dappClient();
    const WALLET_RESP = await CheckIfWalletConnected();
    if (!WALLET_RESP.success) {
      throw new Error("Wallet connection failed");
    }
    const tezos = await dappClient().tezos();
    const _balance = await tezos.tz.getBalance(address);
    const balance = _balance.dividedBy(new BigNumber(10).pow(6));
    return {
      success: true,
      balance,
      identifier: "tez",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      balance: new BigNumber(0),
      identifier: "tez",
      error: error,
    };
  }
};

/**
 * Gets balance of user of a particular token using RPC
 * @param identifier - Name of token, case-sensitive to CONFIG
 * @param address - tz1 address of user
 */
export const getUserBalanceByRpc = async (
  identifier: string,
  address: string
): Promise<IBalanceResponse> => {
  try {
    if (identifier === "tzBTC") {
      const res = await getTzBtcBalance(address);
      return {
        success: res.success,
        balance: res.balance,
        identifier: res.identifier,
      };
    } else if (identifier === "tez") {
      const res = await getTezBalance(address);
      return {
        success: res.success,
        balance: res.balance,
        identifier: res.identifier,
      };
    } else {
      const state = store.getState();
      const TOKEN = state.config.tokens;

      const token = TOKEN[`${identifier}`];
      const mapId = token.mapId;
      const type = token.variant;
      const decimal: number = token.decimals;
      const tokenId: number = token.tokenId ?? 0;
      const packedKey = getPackedKey(tokenId, address, type as TokenVariant);
      const url = `${getRpcNode()}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);

      const balance = (() => {
        let _balance;
        if (type1MapIds.includes(mapId as number)) {
          _balance = response.data.args[0].args[1].int;
        } else if (type2MapIds.includes(mapId as number)) {
          _balance = response.data.args[1].int;
        } else if (type3MapIds.includes(mapId as number)) {
          _balance = response.data.args[0].int;
        } else if (type4MapIds.includes(mapId as number)) {
          _balance = response.data.int;
        } else if (type5MapIds.includes(mapId as number)) {
          _balance = response.data.args[0][0].args[1].int;
        } else {
          _balance = response.data.args[1].int;
        }

        _balance = new BigNumber(_balance);
        _balance = _balance.dividedBy(Math.pow(10, decimal));
        return _balance;
      })();
      return {
        success: true,
        balance,
        identifier,
      };
    }
  } catch (error) {
    return {
      success: false,
      balance: new BigNumber(0),
      identifier,
      error: error,
    };
  }
};

export const getCompleteUserBalace = async (address: string): Promise<IAllBalanceResponse> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;
    const userBalance: { [id: string]: BigNumber } = {};
    Object.keys(TOKEN).forEach(async function (key) {
      const bal = await getUserBalanceByRpc(key, address);
      userBalance[key] = bal.balance;
    });
    return {
      success: true,
      userBalance,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      userBalance: {},
    };
  }
};

/**
 * Returns the symbol and user balance of the LP token for the given pair of tokens.
 * @param tokenOneSymbol - Symbol of token one of the pair.
 * @param tokenTwoSymbol - Symbol of token two of the pair.
 * @param userTezosAddress - Tezos wallet address of the user.
 * @param lpToken - (Optional) Symbol of the LP token for the given pair if known/available.
 */
export const getPnlpBalance = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string,
  lpToken?: string
): Promise<IPnlpBalanceResponse> => {
  try {
    const lpTokenSymbol = lpToken ? lpToken : getLpTokenSymbol(tokenOneSymbol, tokenTwoSymbol);
    if (lpTokenSymbol) {
      // TODO: Uncomment the commented lines and comment the uncommented one to get balance via tzkt and vice versa.
      // const TOKENS = store.getState().config.tokens;
      // const LP_TOKEN = TOKENS[lpTokenSymbol];
      const lpTokenBalance = await getUserBalanceByRpc(lpTokenSymbol, userTezosAddress);
      // const lpTokenBalance = await getBalanceFromTzkt(
      //   LP_TOKEN.address as string,
      //   LP_TOKEN.tokenId,
      //   LP_TOKEN.variant,
      //   userTezosAddress,
      //   LP_TOKEN.symbol
      // );
      if (lpTokenBalance.success) {
        return {
          success: true,
          lpToken: lpTokenSymbol,
          balance: lpTokenBalance.balance.toString(),
        };
      } else {
        throw new Error(lpTokenBalance.error?.message);
      }
    } else {
      throw new Error("LP token not found for the given pairs.");
    }
  } catch (err: any) {
    return {
      success: false,
      lpToken: "",
      balance: "0",
      error: err.message,
    };
  }
};

/**
 * Returns the symbol and user staked balance of the PNLP token for the given pair of tokens.
 * @param tokenOneSymbol - Symbol of token one of the pair.
 * @param tokenTwoSymbol - Symbol of token two of the pair.
 * @param userTezosAddress - Tezos wallet address of the user.
 */
export const getStakedBalance = async (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
  userTezosAddress: string
): Promise<IPnlpBalanceResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenOneSymbol, tokenTwoSymbol);
    if (dexContractAddress === "false") {
      throw new Error("AMM does not exist for the selected pair.");
    }
    const pnlpTokenDecimals: number = AMM[dexContractAddress].lpToken.decimals;
    const pnlpTokenSymbol: string = AMM[dexContractAddress].lpToken.symbol;
    const gaugeAddress: string | undefined = AMM[dexContractAddress].gaugeAddress;
    if (gaugeAddress === undefined) {
      throw new Error("Gauge does not exist for the selected pair.");
    }
    const gaugeStorage = await getStorage(gaugeAddress, gaugeStorageType);

    const balancesBigMapId: string = gaugeStorage.balances;

    const packedAddress: string = getPackedKey(0, userTezosAddress, TokenVariant.FA12);
    const stakedBalanceResponse = await getBigMapData(balancesBigMapId, packedAddress);
    const stakedBalance = new BigNumber(stakedBalanceResponse.data.int);
    const finalStakedBalance = stakedBalance.dividedBy(new BigNumber(10).pow(pnlpTokenDecimals));
    return {
      success: true,
      balance: finalStakedBalance.toString(),
      lpToken: pnlpTokenSymbol,
    };
  } catch (error: any) {
    return {
      success: false,
      balance: "0",
      lpToken: "",
      error: error.message,
    };
  }
};

/**
 * Returns the balance of the token held by the user in their wallet using tzkt api.
 * This function can be used for tokens that are present in config (mapId known),
 * as well as those not present and searched from chain.
 * @param tokenContract - Contract address of the token
 * @param tokenId - Token id of the token (undefined for FA1.2 tokens)
 * @param tokenStandard - Standard of token whether FA1.2 or FA2
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenSymbol - Symbol of the token (optional)
 */
export const getBalanceFromTzkt = async (
  tokenContract: string,
  tokenId: number | undefined,
  tokenStandard: TokenVariant,
  userTezosAddress: string,
  tokenSymbol?: string
): Promise<IBalanceResponse> => {
  try {
    if (
      !tokenContract ||
      tokenContract === "" ||
      !tokenStandard ||
      !userTezosAddress ||
      userTezosAddress === ""
    ) {
      throw new Error("Invalid or empty parameters");
    }
    let symbol: string = tokenSymbol || "";
    let userBalance = new BigNumber(0);

    const balanceResponse = await getTzktTokenData(
      `/balances?account=${userTezosAddress}&token.contract=${tokenContract}${
        tokenStandard === TokenVariant.FA2 ? `&token.tokenId=${tokenId || 0}` : ""
      }`
    );
    const balanceData = balanceResponse.data;
    if (balanceData.length <= 0) {
      return {
        success: true,
        identifier: symbol,
        balance: userBalance,
      };
    }

    const tokenDataFromConfig = getTokenDataByAddress(tokenContract);

    // First check if token metadata exists for the token in the response.
    if (balanceData[0].token.metadata && balanceData[0].token.metadata.decimals) {
      symbol = tokenSymbol || balanceData[0].token.metadata.symbol;
      const tokenDecimals = new BigNumber(balanceData[0].token.metadata.decimals);
      const decimalMultiplier = new BigNumber(10).pow(tokenDecimals);
      userBalance = new BigNumber(balanceData[0].balance || 0).dividedBy(decimalMultiplier);
    } else {
      // Check if token data exists in local config if not found in tzkt response.
      if (tokenDataFromConfig) {
        symbol = tokenSymbol || tokenDataFromConfig.symbol;
        const tokenDecimals = new BigNumber(tokenDataFromConfig.decimals);
        const decimalMultiplier = new BigNumber(10).pow(tokenDecimals);
        userBalance = new BigNumber(balanceData[0].balance || 0).dividedBy(decimalMultiplier);
      } else {
        throw new Error("Decimals not found for the selected token.");
      }
    }

    return {
      success: true,
      identifier: symbol,
      balance: userBalance,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      identifier: tokenSymbol || "",
      balance: new BigNumber(0),
      error: error.message,
    };
  }
};

/**
 * Returns the individual token balance of the requested list of tokens for a user using tzkt api.
 * @param tokens - Array of all tokens
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getAllTokensBalanceFromTzkt = async (
  tokens: ITokenInterface[],
  userTezosAddress: string
): Promise<IAllTokensBalanceResponse> => {
  try {
    const allTokensBalances: IAllTokensBalance = {};
    const allTokensBalanceResponse = await Promise.all(
      tokens.map((token) => {
        if (!token.address && token.variant === TokenVariant.TEZ) {
          // Get the XTZ balance from wallet as it's a native token to TEZOS
          return getTezBalance(userTezosAddress);
        } else {
          return getBalanceFromTzkt(
            token.address as string,
            token.tokenId,
            token.variant,
            userTezosAddress,
            token.symbol
          );
        }
      })
    );
    allTokensBalanceResponse.forEach((tokenBalance) => {
      if (tokenBalance.identifier !== "") {
        allTokensBalances[tokenBalance.identifier] = tokenBalance;
      }
    });
    return {
      success: true,
      allTokensBalances,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allTokensBalances: {},
      error: error.message,
    };
  }
};
