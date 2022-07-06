
import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import Config from '../../config/config';

 const connectedNetwork = Config.NETWORK;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
 const rpcNode = Config.RPC_NODES[connectedNetwork];



export const ConnectWalletAPI = async () => {
  try {
    const wallet = new BeaconWallet({
      name: Config.NAME,
      preferredNetwork: connectedNetwork as NetworkType,
    });
    let account = await wallet.client.getActiveAccount();
    if (!account) {
      await wallet.client.requestPermissions({
        network: {
          type: connectedNetwork as NetworkType,
          rpcUrl: rpcNode,
        },
      });
      account = await wallet.client.getActiveAccount();
    }
    if (account) {
      return {
        success: true,
        wallet: account.address,
      };
    } 
  } catch (error) {
    return {
      success: false,
      wallet: null,
      error,
    };
  }
};

export const DisconnectWalletAPI = async () => {
  try {
    const wallet = new BeaconWallet({
      name: Config.NAME,
      preferredNetwork: connectedNetwork as NetworkType,
    });
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
};

export const FetchWalletAPI = async () => {
  try {
    const wallet = new BeaconWallet({
      name: Config.NAME,
      preferredNetwork: connectedNetwork as NetworkType,
    });
    const account = await wallet.client.getActiveAccount();
    if (!account) {
      return {
        success: false,
        wallet: null,
      };
    }
    return {
      success: true,
      wallet: account.address,
    };
  } catch (error) {
    return {
      success: false,
      wallet: null,
    };
  }
};
