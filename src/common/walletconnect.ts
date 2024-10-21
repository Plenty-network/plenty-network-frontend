import { store } from "../redux";
import Config from "../config/config";
// import { NetworkType } from "@airgap/beacon-sdk";

class TzktBlockExplorer {
  constructor(
    public readonly rpcUrls: { [key in string]: string } = {
      ["mainnet"]: "https://tzkt.io/",
      ["delphinet"]: "https://delphi.tzkt.io/",
      ["edonet"]: "https://edo.tzkt.io/",
      ["florencenet"]: "https://florence.tzkt.io/",
      ["granadanet"]: "https://granada.tzkt.io/",
      ["hangzhounet"]: "https://hangzhou.tzkt.io/",
      ["ithacanet"]: "https://ithacanet.tzkt.io/",
      ["jakartanet"]: "https://jakartanet.tzkt.io/",
      ["custom"]: "https://ghostnet.tzkt.io/",
      ["ghostnet"]: "https://ghostnet.tzkt.io/",
      ["weeklynet"]: "https://weeklynet.tzkt.io/",
      ["oxfordnet"]: "https://oxfordnet.tzkt.io/",
      ["parisnet"]: "https://parisnet.tzkt.io/",
      ["dailynet"]: "https://dailynet.tzkt.io/",
      ["kathmandunet"]: "https://kathmandunet.tzkt.io/",
      ["limanet"]: "https://limanet.tzkt.io/",
      ["mumbainet"]: "https://mumbainet.tzkt.io/",
      ["nairobinet"]: "https://nairobinet.tzkt.io/",
    }
  ) {}

  async getAddressLink(address: string, network: string): Promise<string> {
    const blockExplorer = this.rpcUrls[network];
    return `${blockExplorer}${address}/operations`;
  }

  async getTransactionLink(transactionId: string, network: string): Promise<string> {
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
