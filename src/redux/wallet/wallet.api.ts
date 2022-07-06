import { BeaconWallet } from '@taquito/beacon-wallet';
import Config from '../../config/config';
import { NetworkType } from '@airgap/beacon-sdk';

export const ConnectWalletAPI = async () => {
  try {
    const options = {
      name: Config.NAME,
    };
    const wallet = new BeaconWallet(options);
    let account = await wallet.client.getActiveAccount();
    if (!account) {
      await wallet.client.requestPermissions({
        network: {
          type: NetworkType.MAINNET,
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
        success: true,
        wallet: account,
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
    const options = {
      name: 'mainnet',
    };
    const wallet = new BeaconWallet(options);
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
    const options = {
      name: 'Plenty Defi',
    };
    const wallet = new BeaconWallet(options);
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
