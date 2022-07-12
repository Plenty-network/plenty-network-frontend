import { NetworkType } from '@airgap/beacon-sdk';
import Config from '../../config/config';
import { wallet } from '../../common/wallet';

const connectedNetwork = Config.NETWORK;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
const rpcNode = Config.RPC_NODES[connectedNetwork];

export const ConnectWalletAPI = async () => {
  try {
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
    } else {
      return {
        success: false,
        wallet: null,
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
