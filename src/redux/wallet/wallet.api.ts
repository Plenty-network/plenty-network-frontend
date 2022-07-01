import { BeaconWallet } from '@taquito/beacon-wallet';
import {
  fetchWallet,
  walletConnectionFailed,
  walletConnectionStart,
  walletConnectionSuccessfull,
  walletDisconnection,
} from './wallet';
import Config from '../../config/config';
import { NetworkType } from '@airgap/beacon-sdk';

export const connectWallet = () => {
  return (dispatch: any): void => {
    dispatch(walletConnectionStart());
    ConnectWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(walletConnectionSuccessfull(resp.wallet));
        } else {
          dispatch(walletConnectionFailed());
        }
      })
      .catch(() => {
        dispatch(walletConnectionFailed());
      });
  };
};
export const disconnectWallet = () => {
  return (dispatch: any) => {
    DisconnectWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(walletDisconnection());
        }
      })
      .catch(() => {});
  };
};

export const fetchWalletAddress = () => {
  return (dispatch: any) => {
    FetchWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(fetchWallet(resp.wallet));
        }
      })
      .catch(() => {});
  };
};
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
