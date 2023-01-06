import { IConfig, TokenStandard } from './types';
import { NetworkType } from "@airgap/beacon-types";

const Config: IConfig = {
  NAME: "Plenty Network",
  // STANDARD_CONFIG : 'https://config.plenty.network/v1/config/token?type=standard' ,
  // LP_CONFIG : "https://config.plenty.network/v1/config/token?type=lp",
  // TOKENS_CONFIG : "https://config.plenty.network/v1/config/token",
  // AMM_CONFIG : 'https://config.plenty.network/v1/config/amm' ,
  API: {
    url: "https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false",
    API_KEY: "4824FE50-DB6E-4316-B099-72283C964891",
    tezToolTokenPrice: "https://api.teztools.io/token/prices",
  },
  RPC_NODES: {
    testnet: process.env.NEXT_PUBLIC_RPC_TESTNET || "https://rpc.tzkt.io/ghostnet/",
    mainnet: process.env.NEXT_PUBLIC_RPC_MAINNET || "https://rpc.tzkt.io/mainnet/",
  },
  TZKT_NODES: {
    mainnet: process.env.NEXT_PUBLIC_TZKT_MAINNET || "https://api.tzkt.io/",
    testnet: process.env.NEXT_PUBLIC_TZKT_GHOSTNET || "https://api.ghostnet.tzkt.io/",
  },
  PUBLIC_TZKT_NODES: {
    mainnet: "https://api.tzkt.io/",
    testnet: "https://api.ghostnet.tzkt.io/",
  },
  VE_SWAP: {
    mainnet: "KT1RX4fN5FDPcfidbDm6mFwh26fSAMgbE98M",
    testnet: "KT1Fo6JuwYce2JgdnuGd7GhLC2aBkkaXKmRS",
  },
  VOTER: {
    mainnet: "KT1Xa92Nf6evFcEbxMXencfGPmS4urNyn5wd",
    testnet: "KT1M7Qq8bLzKDB7Ax1Az86pBouQe3pFhf5pm",
  },
  VOTE_ESCROW: {
    mainnet: "KT18kkvmUoefkdok5mrjU6fxsm7xmumy1NEw",
    testnet: "KT1Lxzr5KiLsnKS9APYcWjREEy27AS6zD8wm",
  },
  PLY_TOKEN: {
    mainnet: "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX",
    testnet: "KT1RxghJRnQ3UKbqZ9Mbg4Vjs29Yi1YsGFKW",
  },
  FACTORY: {
    mainnet: "KT1ECkj846eLwRSexCKagq8FfkBBxqhsNhkD",
    testnet: "KT1UmJmgNvy7sGztaFkr598Lj7JxiWbTFbQp",
  },
  AIRDROP: {
    mainnet: "",
    testnet: "KT1J3EQDZbLUR1Hp8TZKFwY5FLoekiPSgsmL",
  },

  VE_INDEXER: {
    mainnet: "https://ply-indexer.mainnet.plenty.network/v1/",
    testnet: "https://ply-indexer.ghostnet.plenty.network/v1/",
  },
  PLY_INDEXER: {
    mainnet: "https://api.analytics.plenty.network/",
    testnet: "https://analytics-indexer.ghostnet.plenty.network/",
  },

  FAUCET: "KT1RZREo5PFKCGSgtfoMUzXqisT6mFQ1qxhH",

  AIRDROP_SERVER: {
    mainnet: "",
    // testnet: "http://localhost:3000/",
    testnet: "https://airdrop.plenty.network/",
  },

  AIRDROP_ETH_MESSAGE_PREFIX: "Confirming Tezos address for claiming airdrop: ",

  EXCHANGE_TOKENS: {
    PLENTY: {
      exchangeRate: 5.714,
      tokenDecimals: 18,
      contractEnumValue: 0,
      tokenMapid: 3943,
    },
    WRAP: {
      exchangeRate: 3.092,
      tokenDecimals: 8,
      contractEnumValue: 1,
      tokenMapid: 1777,
    },
  },

  IPFS_LINKS: {
    primary: "https://cloudflare-ipfs.com/ipfs/",
    fallback: "https://ipfs.io/ipfs/",
  },

  CONFIG_LINKS: {
    testnet: {
      POOL: "https://config.ghostnet.plenty.network/pools",
      TOKEN: "https://config.ghostnet.plenty.network/tokens",
    },
    mainnet: {
      POOL: "https://config.mainnet.plenty.network/pools",
      TOKEN: "https://config.mainnet.plenty.network/tokens",
    },
  },

  CTEZ: {
    mainnet: "KT1GWnsoFZVHGh7roXEER3qeCcgJgrXT3de2",
    testnet: "KT1P7eP7gGuHgPVNWRLs1p4uRhc9Wbyku8B2",
  },

  SERVERLESS_BASE_URL: {
    mainnet: "https://w0sujgfj39.execute-api.us-east-2.amazonaws.com/v1",
    testnet: "https://testnet.dummy-api.us-east-10.amazonaws.com/v1",
  },
  SERVERLESS_REQUEST: {
    mainnet: {
      "HOME-PAGE-TVL": "/tvl",
      "PLENTY-STATS": "/homestats",
    },
    testnet: {},
  },
  ROUTER: {
    mainnet: "KT1FNc7k9Exsz4jKp5K16p2B9L2Hfq2QcB2D",
    testnet: "KT1MsMSjppFUxHHhzY8XKqdwBKS8HV1roaWf",
  },

  NETWORK: "mainnet",
  WALLET_NETWORK: NetworkType.MAINNET,
  ADMIN_ADDRESS: "KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW",
  BURNER: "tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg",


  EXPLORER_LINKS: {
    RINKEBY: "https://rinkeby.etherscan.io/tx/",
    ETHEREUM: "https://etherscan.io/tx/",
    TEZOS: { 
      mainnet: "https://tzkt.io/",
      testnet: "https://ghostnet.tzkt.io/"
    },
  },
};

export default Config;
