import { NetworkType } from "@airgap/beacon-types";

export interface IConfig {
  // STANDARD_CONFIG: string;
  // LP_CONFIG: string;
  // TOKENS_CONFIG: string;
  // AMM_CONFIG: string;
  NAME: string;
  API: IApi;
  RPC_NODES: INodes;
  TZKT_NODES: INodes;
  PUBLIC_TZKT_NODES: INodes;
  FAUCET: string;
  CTEZ: INodes;
  EXPLORER_LINKS: IExplorerLinks;

  SERVERLESS_BASE_URL: INodes;
  SERVERLESS_REQUEST: {
    testnet: Record<string, string>;
    mainnet: Record<string, string>;
  };
  ROUTER: INodes;

  // WRAPPED_ASSETS: {
  //   testnet: Record<string, IWrappedToken>;
  //   mainnet: Record<string, IWrappedToken>;
  // };

  CONFIG_LINKS: {
    testnet: IConfigData;
    mainnet: IConfigData;
  };

  NETWORK: "mainnet" | "testnet";
  WALLET_NETWORK: NetworkType;
  ADMIN_ADDRESS: string;
  BURNER: string;
  VE_SWAP: { mainnet: string; testnet: string };
  VOTER: { mainnet: string; testnet: string };
  VOTE_ESCROW: { mainnet: string; testnet: string };
  VE_INDEXER: { mainnet: string; testnet: string };
  ANALYTICS_INDEXER: { mainnet: string; testnet: string };
  PLY_TOKEN: { mainnet: string; testnet: string };
  FACTORY: { mainnet: string; testnet: string };
  TEZ_DEPLOYER: { mainnet: string; testnet: string };
  EXCHANGE_TOKENS: { [key in MigrateToken]: IExchangeTokenData };
  IPFS_LINKS: { primary: string; fallback: string };
  AIRDROP_SERVER: { mainnet: string; testnet: string };
  AIRDROP: { mainnet: string; testnet: string };
  AIRDROP_ETH_MESSAGE_PREFIX: string;
  PLENTY_3ROUTE_URL: { mainnet: string; testnet: string };
}

interface IApi {
  url: string;
  API_KEY: string;
  tezToolTokenPrice: string;
}

interface INodes {
  testnet: string;
  mainnet: string;
}

interface IExplorerLinks {
  ETHEREUM: string;
  TEZOS: INodes;
  RINKEBY: string;
}

interface IWrappedToken {
  ICON: string;
  TOKEN_CONTRACT: string;
  mapId?: number;
  TOKEN_ID: number;
  TOKEN_DECIMAL: number;
  REF_TOKEN: string;
  READ_TYPE: TokenStandard;
}

// export interface IAmmContracts {
//   [key: string]: IAMM;
// }

// export interface ITokens {
//   [key: string]: ITokenInterface;
// }

// // export enum Chain {
// //   TEZOS = "TEZOS",
// //   ETHEREUM = "ETHEREUM",
// // }

// export interface Extras {
//   chain: Chain;
//   isNew?: boolean;
// }

// export interface ITokenInterface {
//   address?: string;
//   symbol: string;
//   variant: TokenVariant;
//   type: TokenType;
//   tokenId?: number;
//   decimals: number;
//   mapId?: number;
//   pairs: string[];
//   extras?: Extras;
//   iconUrl?: string;
// }

// export interface IAMM {
//   address: string;
//   token1: ITokenInterface;
//   token2: ITokenInterface;
//   type: AMM_TYPE;
//   gaugeAddress?: string;
//   bribeAddress?: string;
//   token1Precision?: string;
//   token2Precision?: string;
//   lpToken: ITokenInterface;
// }

// export enum AMM_TYPE {
//   VOLATILE = "VOLATILE",
//   STABLE = "STABLE",
// }

// export enum TokenType {
//   STANDARD = "STANDARD",
//   LP = "LP",
// }

// export enum TokenVariant {
//   TEZ = "TEZ",
//   FA12 = "FA1.2",
//   FA2 = "FA2",
// }

export interface IContractsConfig {
  // TOKEN: ITokens;
  // LP: ITokens;
  // STANDARD: ITokens;
  // AMM: IAmmContracts;
  TOKEN: IConfigTokens;
  AMM: IConfigPools;
}

export interface IGaugeConfigData {
  ammAddress: string;
  tokenOneSymbol: string;
  tokenTwoSymbol: string;
}

export interface IGaugeConfig {
  [key: string]: IGaugeConfigData;
}

export enum MigrateToken {
  PLENTY = "PLENTY",
  WRAP = "WRAP",
}

export interface IExchangeTokenData {
  exchangeRate: number;
  tokenDecimals: number;
  contractEnumValue: number;
  tokenMapid: number | undefined;
}

export enum PoolType {
  VOLATILE = "VOLATILE",
  STABLE = "STABLE",
  TEZ = "TEZ",
}

export enum Chain {
  ETHEREUM = "ETHEREUM",
  BSC = "BSC",
  POLYGON = "POLYGON",
  TEZOS = "TEZOS",
}

export enum TokenStandard {
  FA12 = "FA1.2",
  FA2 = "FA2",
  TEZ = "TEZ",
}

export interface IConfigToken {
  name: string;
  symbol: string;
  decimals: number;
  standard: TokenStandard;
  address?: string;
  tokenId?: number;
  thumbnailUri?: string;
  originChain: Chain;
  pairs: string[];
  iconUrl?: string;
}

export interface IConfigTokens {
  [tokenSymbol: string]: IConfigToken;
}

export interface IConfigLPToken {
  address: string;
  decimals: number;
}

export interface IConfigPool {
  address: string;
  token1: IConfigToken;
  token2: IConfigToken;
  lpToken: IConfigLPToken;
  type: PoolType;
  token1Precision?: string;
  token2Precision?: string;
  gauge?: string;
  bribe?: string;
  fees?: number;
}

export interface IConfigPools {
  [poolAddress: string]: IConfigPool;
}

export interface IConfigData {
  POOL: string;
  TOKEN: string;
}
