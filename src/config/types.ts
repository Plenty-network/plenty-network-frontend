import { NetworkType } from "@airgap/beacon-types";

export interface IConfig {
  STANDARD_CONFIG: string;
  LP_CONFIG: string;
  TOKENS_CONFIG: string;
  AMM_CONFIG: string;
  NAME: string;
  API: IApi;
  RPC_NODES: INodes;
  TZKT_NODES: INodes;
  CTEZ: INodes;
  EXPLORER_LINKS: IExplorerLinks;

  SERVERLESS_BASE_URL: INodes;
  SERVERLESS_REQUEST: {
    testnet: Record<string, string>;
    mainnet: Record<string, string>;
  };
  ROUTER: { mainnet: string; testnet: string };
  
  WRAPPED_ASSETS: {
    testnet: Record<string, IWrappedToken>;
    mainnet: Record<string, IWrappedToken>;
  };

  NETWORK: 'mainnet' | 'testnet';
  WALLET_NETWORK: NetworkType;
  ADMIN_ADDRESS: string;
  BURNER: string;
  VOTER: { mainnet: string; testnet: string };
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
  TEZOS: string;
  RINKEBY: string;
}

interface IWrappedToken {
  ICON: string;
  TOKEN_CONTRACT: string;
  mapId?: number;
  TOKEN_ID: number;
  TOKEN_DECIMAL: number;
  REF_TOKEN: string;
  READ_TYPE: TokenVariant;
}

export interface IAmmContracts {
  [key: string]: IAMM;
}

export interface ITokens {
  [key: string]: ITokenInterface;
}

export enum Chain {
  TEZOS = "TEZOS",
  ETHEREUM = "ETHEREUM",
}

export interface Extras {
  chain: Chain;
  isNew?: boolean;
}

export interface ITokenInterface {
  address?: string;
  symbol: string;
  variant: TokenVariant;
  type: TokenVariant;
  tokenId?: number;
  decimals: number;
  mapId?: number;
  pairs: string[];
  extras?: Extras;
}

export interface IAMM {
  address: string;
  token1: ITokenInterface;
  token2: ITokenInterface;
  type: AMM_TYPE;
  gaugeAddress?: string;
  bribeAddress?: string;
  token1Precision?: string;
  token2Precision?: string;
  lpToken: ITokenInterface;
}

export enum AMM_TYPE {
  VOLATILE = 'VOLATILE',
  STABLE = 'STABLE',
}

export enum TokenType {
  STANDARD = 'STANDARD',
  LP = 'LP',
}

export enum TokenVariant {
  TEZ = 'TEZ',
  FA12 = 'FA1.2',
  FA2 = 'FA2',
}

export interface IContractsConfig {
  TOKEN: ITokens;
  LP: ITokens;
  STANDARD: ITokens;
  AMM: IAmmContracts;
}
