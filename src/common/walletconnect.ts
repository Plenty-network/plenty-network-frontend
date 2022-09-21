import {
  AccountInfo,
  ColorMode,
  DAppClientOptions,
} from '@airgap/beacon-sdk'
import type { BeaconWallet } from '@taquito/beacon-wallet'
import Config from '../config/config';

export const connectedNetwork = Config.NETWORK;
export const walletNetwork = Config.WALLET_NETWORK;
export const configName = Config.NAME;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
export const rpcNode = Config.RPC_NODES[connectedNetwork];
export const tzktNode = Config.TZKT_NODES[connectedNetwork];
export const voteEscrowAddress = Config.VOTE_ESCROW[connectedNetwork];
export const voterAddress = Config.VOTER[connectedNetwork];
export const veSwapAddress = Config.VE_SWAP[connectedNetwork];
export const feeDistributorAddress = Config.FEE_DISTRIBUTOR[connectedNetwork];

export function dappClient() {
  let instance: BeaconWallet | undefined

  async function init() {
    const { BeaconWallet } = await import('@taquito/beacon-wallet')
    const dAppInfo: DAppClientOptions = {
      name: 'Plenty Network',
      preferredNetwork: walletNetwork,
      colorMode: ColorMode.DARK,
    }

    return new BeaconWallet(dAppInfo)
  }
  async function loadWallet() {
    if (!instance) instance = await init()
    return instance
  }

  async function getDAppClient() {
    const wallet = await loadWallet()
    return wallet.client
  }
  async function getDAppClientWallet() {
    const wallet = await loadWallet()
    return wallet;
  }

  async function connectAccount() {
    const client = await getDAppClient()

    await client.clearActiveAccount()
    return client.requestPermissions({
      network: {
        type: walletNetwork,
      },
    })
  }

  async function swapAccount(account: AccountInfo) {
    const client = await getDAppClient()

    await client.clearActiveAccount()
    await client.setActiveAccount(account)
    return account
  }
  async function  CheckIfWalletConnected(){
  
    try {
    const client = await getDAppClient()
      const activeAccount = await client.getActiveAccount();
      if (!activeAccount) {
        await client.requestPermissions({
          network: {
            type: walletNetwork,
            rpcUrl: rpcNode,
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
  };
  async function tezos() {

    const { TezosToolkit } = await import('@taquito/taquito')
    const Tezos = new TezosToolkit(rpcNode)
    const wallet=await getDAppClientWallet();
    if (wallet) Tezos.setWalletProvider(wallet)
    return Tezos
  }
  async function disconnectWallet() {
    const wallet=await getDAppClientWallet();
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
    disconnectWallet
  }
}
