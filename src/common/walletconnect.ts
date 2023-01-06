import {
  AccountInfo,
  BlockExplorer,
  ColorMode,
  DAppClientOptions,
  Network,
  NetworkType,
} from "@airgap/beacon-sdk";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import Config from "../config/config";
import { store, useAppDispatch } from "../redux";

class TzktBlockExplorer extends BlockExplorer {
  constructor(
    public readonly rpcUrls: { [key in NetworkType]: string } = {
      [NetworkType.MAINNET]: "https://tzkt.io/",
      [NetworkType.DELPHINET]: "https://delphi.tzkt.io/",
      [NetworkType.EDONET]: "https://edo.tzkt.io/",
      [NetworkType.FLORENCENET]: "https://florence.tzkt.io/",
      [NetworkType.GRANADANET]: "https://granada.tzkt.io/",
      [NetworkType.HANGZHOUNET]: "https://hangzhou.tzkt.io/",
      [NetworkType.ITHACANET]: "https://ithacanet.tzkt.io/",
      [NetworkType.JAKARTANET]: "https://jakartanet.tzkt.io/",
      [NetworkType.CUSTOM]: "https://ghostnet.tzkt.io/",
      [NetworkType.GHOSTNET]: "https://ghostnet.tzkt.io/",
      [NetworkType.MONDAYNET]: "https://mondaynet.tzkt.io/",
      [NetworkType.DAILYNET]: "https://mondaynet.tzkt.io/",
      [NetworkType.KATHMANDUNET]: "https://kathmandunet.tzkt.io/",
    }
  ) {
    super(rpcUrls);
  }

  public async getAddressLink(address: string, network: Network): Promise<string> {
    const blockExplorer = await this.getLinkForNetwork(network);

    return `${blockExplorer}${address}/operations`;
  }
  public async getTransactionLink(transactionId: string, network: Network): Promise<string> {
    const blockExplorer = await this.getLinkForNetwork(network);

    return `${blockExplorer}${transactionId}`;
  }
}

export const connectedNetwork = Config.NETWORK;
export const walletNetwork = Config.WALLET_NETWORK;
export const configName = Config.NAME;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
// export const rpcNode = Config.RPC_NODES[connectedNetwork];
export const tzktNode = Config.TZKT_NODES[connectedNetwork];
export const publicTzktNode = Config.PUBLIC_TZKT_NODES[connectedNetwork];
export const voteEscrowAddress = Config.VOTE_ESCROW[connectedNetwork];
export const voterAddress = Config.VOTER[connectedNetwork];
export const veSwapAddress = Config.VE_SWAP[connectedNetwork];
export const faucetAddress = Config.FAUCET;
export const factoryAddress = Config.FACTORY[connectedNetwork];
export const routerAddress = Config.ROUTER[connectedNetwork];
export const tzktExplorer = Config.EXPLORER_LINKS.TEZOS[connectedNetwork];

export const getRpcNode = () =>
  store.getState().rpcData.rpcNode || Config.RPC_NODES[connectedNetwork];

export const dispatch = () => useAppDispatch();

export function dappClient() {
  let instance: BeaconWallet | undefined;

  async function init() {
    const { BeaconWallet } = await import("@taquito/beacon-wallet");
    const dAppInfo: DAppClientOptions = {
      name: "Plenty Network",
      preferredNetwork: walletNetwork,
      colorMode: ColorMode.DARK,
      blockExplorer: new TzktBlockExplorer() as any,
    };

    return new BeaconWallet(dAppInfo);
  }
  async function loadWallet() {
    if (!instance) instance = await init();
    return instance;
  }

  async function getDAppClient() {
    const wallet = await loadWallet();
    return wallet.client;
  }
  async function getDAppClientWallet() {
    const wallet = await loadWallet();
    return wallet;
  }

  async function connectAccount() {
    const client = await getDAppClient();

    await client.clearActiveAccount();
    return client.requestPermissions({
      network: {
        type: walletNetwork,
      },
    });
  }

  async function swapAccount(account: AccountInfo) {
    const client = await getDAppClient();

    await client.clearActiveAccount();
    await client.setActiveAccount(account);
    return account;
  }
  async function CheckIfWalletConnected() {
    try {
      const client = await getDAppClient();
      const activeAccount = await client.getActiveAccount();
      if (!activeAccount) {
        await client.requestPermissions({
          network: {
            type: walletNetwork,
            rpcUrl: getRpcNode(),
          },
        });
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  async function tezos() {
    const { TezosToolkit } = await import("@taquito/taquito");
    const Tezos = new TezosToolkit(getRpcNode());
    const wallet = await getDAppClientWallet();
    if (wallet) Tezos.setWalletProvider(wallet);
    return Tezos;
  }
  async function disconnectWallet() {
    const wallet = await getDAppClientWallet();
    try {
      await wallet.disconnect();
      return {
        success: true,
        wallet: null,
      };
    } catch (error) {
      return {
        success: false,
        wallet: null,
        error,
      };
    }
  }
  return {
    loadWallet,
    getDAppClient,
    connectAccount,
    swapAccount,
    CheckIfWalletConnected,
    tezos,
    disconnectWallet,
  };
}
