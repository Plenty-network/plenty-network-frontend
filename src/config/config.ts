import { IConfig, TokenStandard } from "./types";
import { NetworkType } from "@airgap/beacon-types";

const Config: IConfig = {
  NAME: "Plenty Network",
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
  V3_FACTORY: {
    mainnet: "",
    testnet: "KT1KEa3Pc3dpHfSCH4r1nCNsFXNL6Q1ctASS",
  },
  TEZ_DEPLOYER: {
    mainnet: "KT1JnpY4fUQ9DurUhb7uCQtKkunLiamgdzyc",
    testnet: "KT1Mr3fLViGYZCztpMUWxdGNSHjA8xPtczVA",
  },
  AIRDROP: {
    mainnet: "KT1HpNxd9RaeCwxrp1QX96DyocWURJXX8sZx",
    testnet: "KT1J3EQDZbLUR1Hp8TZKFwY5FLoekiPSgsmL",
  },

  VE_INDEXER: {
    mainnet: "api.plenty.network/ply/",
    testnet: "https://ply-indexer.ghostnet.plenty.network/v1/",
  },
  ANALYTICS_INDEXER: {
    mainnet: "https://api.plenty.network/analytics/",
    testnet: "https://api.plenty.network/analytics/",
  },
  VE_ANALYTICS_INDEXER: {
    mainnet: "https://api.plenty.network/ve/",
    testnet: "https://api.plenty.network/ve/",
  },

  FAUCET: "KT1RZREo5PFKCGSgtfoMUzXqisT6mFQ1qxhH",

  AIRDROP_SERVER: {
    mainnet: "https://airdrop.plenty.network/",
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
      POOL: {
        V2: "https://api.plenty.network/config/pools/v2",
        V3: "https://api.plenty.network/config/pools/v3",
      },
      TOKEN: "https://api.plenty.network/config/tokens",
    },
    mainnet: {
      POOL: {
        V2: "https://api.plenty.network/config/pools/v2",
        V3: "https://api.plenty.network/config/pools/v3",
      },
      TOKEN: "https://api.plenty.network/config/tokens",
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
    mainnet: "KT1Kg1yxbettARbgvBMNtZLT6GkZcZsDdZny",
    testnet: "KT1CWvM4nLoyHBGKkGBKjnPNTNLzoJ9JpAW3",
  },

  NETWORK: "testnet",
  WALLET_NETWORK: NetworkType.GHOSTNET,
  ADMIN_ADDRESS: "KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW",
  BURNER: "tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg",

  EXPLORER_LINKS: {
    RINKEBY: "https://rinkeby.etherscan.io/tx/",
    ETHEREUM: "https://etherscan.io/tx/",
    TEZOS: {
      mainnet: "https://tzkt.io/",
      testnet: "https://ghostnet.tzkt.io/",
    },
  },
  V3_CONFIG_URL: {
    testnet: "https://api.plenty.network/config/",
    mainnet: "https://api.plenty.network/config/",
  },
};

export default Config;
