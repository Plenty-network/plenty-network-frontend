import { IConfig, TokenVariant } from './types';
import { NetworkType } from "@airgap/beacon-types";

const Config: IConfig = {
  NAME: 'Plenty Network',
  STANDARD_CONFIG : 'https://config.plenty.network/v1/config/token?type=standard' ,
  LP_CONFIG : "https://config.plenty.network/v1/config/token?type=lp",
  TOKENS_CONFIG : "https://config.plenty.network/v1/config/token",
  AMM_CONFIG : 'https://config.plenty.network/v1/config/amm' ,
  API: {
    url: 'https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
    API_KEY: '4824FE50-DB6E-4316-B099-72283C964891',
    tezToolTokenPrice: 'https://api.teztools.io/token/prices',
  },
  RPC_NODES: {
    testnet: 'https://rpc.tzkt.io/ghostnet/',
    mainnet: 'https://mifx20dfsr.windmill.tools/',
  },
  TZKT_NODES: {
    mainnet: 'https://api.tzkt.io/',
    testnet: 'https://api.ghostnet.tzkt.io/',
  },
  VE_SWAP : {
    mainnet: '',
    testnet: 'KT1AmKUCCB9VBtx56emgQfx5GA9RR2nGBANK',
  },
  VOTER: {
    mainnet: '',
    testnet: 'KT1RER85G1S1QJyjViSuTJMizNbtzG9z7Jes',
  },
  VOTE_ESCROW : {
    mainnet : '',
    testnet : 'KT1SJubny9Y6xsgDakqYSEofqodgbnxHCSMu',
  },
  PLY_TOKEN : {
    mainnet : '',
    testnet : 'KT1BxKvsSCKTJ9XrmkjQRDQfh5mZBb14ue8D',
  },
  FACTORY : {
    mainnet : '',
    testnet : 'KT1HtkELyuAd2tCxcvQ9DtGPRQ7cm26wE6su',
  },

  VE_INDEXER : 'https://ply-indexer.ghostnet.plenty.network/v1/',
  PLY_INDEXER : 'https://analytics-indexer.ghostnet.plenty.network/',

  FAUCET : 'KT1EsCTuMzG5oh7C2R6h3STuEJ3SAfjiVVpb',

  EXCHANGE_TOKENS: {
    PLENTY: {
      exchangeRate: 6,
      tokenDecimals: 18,
      contractEnumValue: 0,
      tokenMapid: 195403,
    },
    WRAP: {
      exchangeRate: 3,
      tokenDecimals: 8,
      contractEnumValue: 1,
      tokenMapid: 195389,
    }
  },

  IPFS_LINKS: {
    primary: "https://cloudflare-ipfs.com/ipfs/",
    fallback: "https://ipfs.io/ipfs/",
  },

  CTEZ: {
    mainnet: 'KT1GWnsoFZVHGh7roXEER3qeCcgJgrXT3de2',
    testnet: 'KT1P7eP7gGuHgPVNWRLs1p4uRhc9Wbyku8B2',
  },

  SERVERLESS_BASE_URL: {
    mainnet: 'https://w0sujgfj39.execute-api.us-east-2.amazonaws.com/v1',
    testnet: 'https://testnet.dummy-api.us-east-10.amazonaws.com/v1',
  },
  SERVERLESS_REQUEST: {
    mainnet: {
      'HOME-PAGE-TVL': '/tvl',
      'PLENTY-STATS': '/homestats',
    },
    testnet: {},
  },
  ROUTER: {
    mainnet: 'KT1MEVCrGRCsoERXf6ahNLC4ik6J2vRH7Mm6',
    testnet: 'KT1VFVoR11dNoFwSnxLgFRknsTexEZsfiP8T',
  },

  NETWORK: 'testnet',
  WALLET_NETWORK: NetworkType.GHOSTNET,
  ADMIN_ADDRESS: 'KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW',
  BURNER: 'tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg',

  WRAPPED_ASSETS: {
    testnet: {
      wWBTC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 19,
        TOKEN_DECIMAL: 8,
        REF_TOKEN: 'WBTC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wWETH: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 20,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'WETH.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wBUSD: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 1,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'BUSD.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wUSDC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1FcWdvGqggfaY4AuepEj2GjHBmk5jP33jE',
        mapId: 84170,
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'USDC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wUSDT: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 18,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'USDT.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wMATIC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1FcWdvGqggfaY4AuepEj2GjHBmk5jP33jE',
        mapId: 84170,
        TOKEN_ID: 2,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'MATIC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wLINK: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 10,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'LINK.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wDAI: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1VoHhkb6wXnoPDvcpbnPFYGTcpJaPfRoEh',
        mapId: 162869,
        TOKEN_ID: 5,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'DAI.e',
        READ_TYPE: TokenVariant.FA2,
      },
      'WBTC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 4,
        TOKEN_DECIMAL: 8,
        REF_TOKEN: 'wWBTC',
        READ_TYPE: TokenVariant.FA2,
      },
      'WETH.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 5,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wWETH',
        READ_TYPE: TokenVariant.FA2,
      },
      'BUSD.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wBUSD',
        READ_TYPE: TokenVariant.FA2,
      },
      'USDC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1AXQ7BgYgi8KBVhF3NmcdBNNTwyqXDC2vT',
        mapId: 84183,
        TOKEN_ID: 1,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wUSDC',
        READ_TYPE: TokenVariant.FA2,
      },
      'USDT.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 3,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'wUSDT',
        READ_TYPE: TokenVariant.FA2,
      },
      'MATIC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1AXQ7BgYgi8KBVhF3NmcdBNNTwyqXDC2vT',
        mapId: 84183,
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wMATIC',
        READ_TYPE: TokenVariant.FA2,
      },
      'LINK.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 6,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wLINK',
        READ_TYPE: TokenVariant.FA2,
      },
      'DAI.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1EZBn43coqL6xfT5xL6e49nhEPLp9B8m4n',
        mapId: 162915,
        TOKEN_ID: 7,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wDAI',
        READ_TYPE: TokenVariant.FA2,
      },
    },
    mainnet: {
      wWBTC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 19,
        TOKEN_DECIMAL: 8,
        REF_TOKEN: 'WBTC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wWETH: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 20,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'WETH.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wBUSD: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 1,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'BUSD.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wUSDC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 17,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'USDC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wUSDT: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 18,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'USDT.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wMATIC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 11,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'MATIC.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wLINK: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 10,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'LINK.e',
        READ_TYPE: TokenVariant.FA2,
      },
      wDAI: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        TOKEN_ID: 5,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'DAI.e',
        READ_TYPE: TokenVariant.FA2,
      },
      'WBTC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 1,
        TOKEN_DECIMAL: 8,
        REF_TOKEN: 'wWBTC',
        READ_TYPE: TokenVariant.FA2,
      },
      'WETH.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wWETH',
        READ_TYPE: TokenVariant.FA2,
      },
      'BUSD.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 7,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wBUSD',
        READ_TYPE: TokenVariant.FA2,
      },
      'USDC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 2,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'wUSDC',
        READ_TYPE: TokenVariant.FA2,
      },
      'USDT.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 3,
        TOKEN_DECIMAL: 6,
        REF_TOKEN: 'wUSDT',
        READ_TYPE: TokenVariant.FA2,
      },
      'MATIC.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 4,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wMATIC',
        READ_TYPE: TokenVariant.FA2,
      },
      'LINK.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 5,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wLINK',
        READ_TYPE: TokenVariant.FA2,
      },
      'DAI.e': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY',
        mapId: 175082,
        TOKEN_ID: 6,
        TOKEN_DECIMAL: 18,
        REF_TOKEN: 'wDAI',
        READ_TYPE: TokenVariant.FA2,
      },
    },
  },

  EXPLORER_LINKS: {
    RINKEBY: 'https://rinkeby.etherscan.io/tx/',
    ETHEREUM: 'https://etherscan.io/tx/',
    TEZOS: 'https://tzkt.io/',
  },
};

export default Config;
