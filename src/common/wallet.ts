import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import Config from '../config/config';

export const connectedNetwork = Config.NETWORK;
export const configName = Config.NAME;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
export const rpcNode = Config.RPC_NODES[connectedNetwork];

// Beacon Wallet instance
function useWallet() {
  const wallet = new BeaconWallet({
    name: configName,
    preferredNetwork: connectedNetwork as NetworkType,
  });
  return wallet;
}

// Tezos instance
export const tezos = new TezosToolkit(rpcNode);
export const wallet = useWallet();
tezos.setWalletProvider(wallet);
tezos.setRpcProvider(rpcNode);

// Function to check if user wallet is already conneted
export const CheckIfWalletConnected = async (wallet: BeaconWallet) => {
  try {
    const activeAccount = await wallet.client.getActiveAccount();
    if (!activeAccount) {
      await wallet.client.requestPermissions({
        network: {
          type: connectedNetwork as NetworkType,
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
