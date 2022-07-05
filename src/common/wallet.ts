import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";
import Config from '../config/config'

// Import local storage
const connectedNetwork = Config.NETWORK;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
const rpcNode = Config.RPC_NODES[connectedNetwork];

// Beacon Wallet instance
export const wallet = new BeaconWallet({
  name: Config.NAME,
  preferredNetwork: connectedNetwork as NetworkType,
});

// Tezos instance
export const tezos = new TezosToolkit(rpcNode);
tezos.setRpcProvider(rpcNode);
tezos.setWalletProvider(wallet);

// Function to check if user wallet is already conneted
export const CheckIfWalletConnected = async (wallet : BeaconWallet) => {
    try {
      const activeAccount = await wallet.client.getActiveAccount();
      if (!activeAccount) {
        await wallet.client.requestPermissions({
            network: {
              type: connectedNetwork as NetworkType,
              rpcUrl: rpcNode,
            },
          })
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
