import { store } from "../redux";
import Config from "../config/config";
import { NETWORK_TYPE } from "../config/types";
// import { NetworkType } from "@airgap/beacon-sdk";

class TzktBlockExplorer {
  constructor(
    public readonly rpcUrls: { [key in NETWORK_TYPE]: string } = {
      [NETWORK_TYPE.MAINNET]: "https://tzkt.io/",
      [NETWORK_TYPE.DELPHINET]: "https://delphi.tzkt.io/",
      [NETWORK_TYPE.EDONET]: "https://edo.tzkt.io/",
      [NETWORK_TYPE.FLORENCENET]: "https://florence.tzkt.io/",
      [NETWORK_TYPE.GRANADANET]: "https://granada.tzkt.io/",
      [NETWORK_TYPE.HANGZHOUNET]: "https://hangzhou.tzkt.io/",
      [NETWORK_TYPE.ITHACANET]: "https://ithacanet.tzkt.io/",
      [NETWORK_TYPE.JAKARTANET]: "https://jakartanet.tzkt.io/",
      [NETWORK_TYPE.CUSTOM]: "https://ghostnet.tzkt.io/",
      [NETWORK_TYPE.GHOSTNET]: "https://ghostnet.tzkt.io/",
      [NETWORK_TYPE.WEEKLYNET]: "https://weeklynet.tzkt.io/",
      [NETWORK_TYPE.OXFORDNET]: "https://oxfordnet.tzkt.io/",
      [NETWORK_TYPE.PARISNET]: "https://parisnet.tzkt.io/",
      [NETWORK_TYPE.DAILYNET]: "https://dailynet.tzkt.io/",
      [NETWORK_TYPE.KATHMANDUNET]: "https://kathmandunet.tzkt.io/",
      [NETWORK_TYPE.LIMANET]: "https://limanet.tzkt.io/",
      [NETWORK_TYPE.MUMBAINET]: "https://mumbainet.tzkt.io/",
      [NETWORK_TYPE.NAIROBINET]: "https://nairobinet.tzkt.io/",
    }
  ) {}
  async getAddressLink(address: string, network: NETWORK_TYPE): Promise<string> {
    const blockExplorer = this.rpcUrls[network];
    return `${blockExplorer}${address}/operations`;
  }

  async getTransactionLink(transactionId: string, network: NETWORK_TYPE): Promise<string> {
    const blockExplorer = this.rpcUrls[network];
    return `${blockExplorer}${transactionId}`;
  }
}

export const connectedNetwork = Config.NETWORK;
export const walletNetwork = Config.WALLET_NETWORK;
export const configName = Config.NAME;
export const tzktNode = Config.TZKT_NODES[connectedNetwork];
export const publicTzktNode = Config.PUBLIC_TZKT_NODES[connectedNetwork];
export const voteEscrowAddress = Config.VOTE_ESCROW[connectedNetwork];
export const voterAddress = Config.VOTER[connectedNetwork];
export const veSwapAddress = Config.VE_SWAP[connectedNetwork];
export const faucetAddress = Config.FAUCET;
export const factoryAddress = Config.FACTORY[connectedNetwork];
export const v3factoryAddress = Config.V3_FACTORY[connectedNetwork];
export const tezDeployerAddress = Config.TEZ_DEPLOYER[connectedNetwork];
export const routerAddress = Config.ROUTER[connectedNetwork];
export const tzktExplorer = Config.EXPLORER_LINKS.TEZOS[connectedNetwork];

export const getRpcNode = () =>
  store.getState().rpcData.rpcNode || Config.RPC_NODES[connectedNetwork];

// The dappClient function
export const dappClient = () => {
  let instance: any;

  const init = async () => {
    if (typeof window === "undefined") return undefined;
    const { ColorMode } = await import("@airgap/beacon-sdk");
    const { BeaconWallet } = await import("@taquito/beacon-wallet");
    const dAppInfo = {
      name: "Plenty Network",
      iconUrl: "https://app.plenty.network/assets/icon/plentyLogo1000.svg",
      preferredNetwork: walletNetwork,
      colorMode: ColorMode.DARK, // You can safely use this inside the async import
      blockExplorer: new TzktBlockExplorer(),
      appUrl: "https://app.plenty.network",
      featuredWallets: ["temple", "plenty", "kukai", "trust"],
    };

    return new BeaconWallet(dAppInfo as any);
  };

  const loadWallet = async () => {
    if (typeof window === "undefined") return undefined;
    if (!instance) instance = await init();
    return instance;
  };

  const getDAppClient = async () => {
    const wallet = await loadWallet();
    return wallet ? wallet.client : null;
  };

  const getDAppClientWallet = async () => {
    const wallet = await loadWallet();
    return wallet;
  };

  const connectAccount = async () => {
    const client = await getDAppClient();
    if (!client) return null;
    await client.clearActiveAccount();
    return client.requestPermissions({
      network: {
        type: walletNetwork,
      },
    });
  };

  const swapAccount = async (account: any) => {
    const client = await getDAppClient();
    if (!client) return null;
    await client.clearActiveAccount();
    await client.setActiveAccount(account);
    return account;
  };

  const CheckIfWalletConnected = async () => {
    try {
      const client = await getDAppClient();
      if (!client) return { success: false, error: "No client available" };
      const activeAccount = await client.getActiveAccount();
      if (!activeAccount) {
        await client.requestPermissions({
          network: {
            type: walletNetwork,
            rpcUrl: getRpcNode(),
          },
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const tezos = async () => {
    if (typeof window === "undefined") return undefined;
    const { TezosToolkit } = await import("@taquito/taquito");
    const Tezos = new TezosToolkit(getRpcNode());
    const wallet = await getDAppClientWallet();
    if (wallet) Tezos.setWalletProvider(wallet);
    return Tezos;
  };

  const disconnectWallet = async () => {
    const wallet = await getDAppClient();
    if (!wallet) return { success: false, error: "No wallet to disconnect" };
    try {
      await wallet.disconnect();
      return { success: true, wallet: null };
    } catch (error) {
      return { success: false, wallet: null, error };
    }
  };

  return {
    getDAppClient,
    connectAccount,
    swapAccount,
    CheckIfWalletConnected,
    tezos,
    disconnectWallet,
  };
};
