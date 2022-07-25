import { NetworkType } from '@airgap/beacon-sdk';
import {   connectedNetwork , rpcNode } from '../../common/wallet';
import { dappClient } from '../../common/walletconnect';

export const ConnectWalletAPI = async () => {
  try {
    let walletClient= await dappClient().getDAppClient();
    let account = await walletClient.getActiveAccount();
    if (!account) {
      await walletClient.requestPermissions({
        network: {
          type: connectedNetwork as NetworkType,
          rpcUrl: rpcNode,
        },
      });
      account = await walletClient.getActiveAccount();
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
  return await dappClient().disconnectWallet()
};

export const FetchWalletAPI = async () => {
  let walletClient= await dappClient().getDAppClient();
  try {
    const account = await walletClient.getActiveAccount();

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
