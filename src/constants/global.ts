import { BigNumber } from "bignumber.js";
import { VolumeV1Data, VolumeVeData } from "../api/pools/types";
import { connectedNetwork } from "../common/walletconnect";

export const RPC_NODE = "rpcNode";
export const TOKEN_CONFIG = "tokenConfig";
export const AMM_CONFIG = "ammConfig";

/**
 * balance for these type1MapIds will be present in `response.data.args[0].args[1].int`
 */
export const type1MapIds = [3956, 4353];

/**
 * balance for these type2MapIds will be present in `response.data.args[1].int`
 */
export const type2MapIds = [3943, 162769];

/**
 * balance for these type3MapIds will be present in `response.data.args[0].int`
 */
export const type3MapIds = [199, 36, 6901, 44140, 176599];

/**
 * balance for these type4MapIds will be present in `response.data.int`
 */
export const type4MapIds = [
  1777, 1772, 515, 4178, 18153, 10978, 7706, 7715, 7654, 20920, 2809, 7250, 13802, 4666, 21182,
  134335, 175082, 89954, 90227, 195389,
];

/**
 * balance for these type5MapIds will be present in `response.data.args[0][0].args[1].int`
 */
export const type5MapIds = [12043];

export const EPOCH_DURATION_TESTNET: number = 604800000; // milliseconds
export const EPOCH_DURATION_MAINNET: number = 604800000; // milliseconds
export const VOTES_CHART_LIMIT: number = 9;
export const PLY_DECIMAL_MULTIPLIER: BigNumber = new BigNumber(10).pow(18); // 10 ** 18

const DAY_TESTNET = 86400;
const DAY_MAINNET = 86400;
export const DAY = connectedNetwork === "testnet" ? DAY_TESTNET : DAY_MAINNET;
export const WEEK = 7 * DAY;
export const YEAR = 52 * WEEK;
export const MAX_TIME = 4 * YEAR;

export const EMPTY_POOLS_OBJECT: VolumeVeData = {
  pool: "",
  volume24H: { value: "0", token1: "0", token2: "0" },
  volume7D: { value: "0", token1: "0", token2: "0" },
  fees24H: { value: "0", token1: "0", token2: "0" },
  fees7D: { value: "0", token1: "0", token2: "0" },
  feesEpoch: { value: "0", token1: "0", token2: "0" },
  tvl: { value: "0", token1: "0", token2: "0" },
};

export const EMPTY_VE_INDEXER_POOLS_OBJECT: VolumeV1Data = {
  pool: "",
  bribes: [],
  apr: "0",
  futureApr: "0",
}

export const API_RE_ATTEMPTS: number = 3;
export const API_RE_ATTAMPT_DELAY: number = 5000;
export const POOLS_PAGE_LIMIT: number = 10;
export const TWEET_CHARACTER_LIMIT: number = 280;
export const GAS_LIMIT_EXCESS: BigNumber = new BigNumber(30).dividedBy(100);
export const STORAGE_LIMIT_EXCESS: BigNumber = new BigNumber(50).dividedBy(100);
export const PROMISE_ALL_CONCURRENCY_LIMIT: number = 8;