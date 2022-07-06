import { wallet ,rpcNode , connectedNetwork} from '../../common/wallet';
import { NetworkType } from '@airgap/beacon-sdk';

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
