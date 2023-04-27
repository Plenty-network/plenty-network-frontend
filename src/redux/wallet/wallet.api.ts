import { walletNetwork, getRpcNode } from "../../common/walletconnect";
import { dappClient } from "../../common/walletconnect";

export const ConnectWalletAPI = async () => {
  try {
    let walletClient = await dappClient().getDAppClient();
    let account = await walletClient.getActiveAccount();
    if (!account) {
      await walletClient.requestPermissions({
        network: {
          type: walletNetwork,
          rpcUrl: getRpcNode(),
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
  return await dappClient().disconnectWallet();
};

export const FetchWalletAPI = async () => {
  let walletClient = await dappClient().getDAppClient();
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

export const switchWalletAccountAPI = async () => {
  try {
    const walletClient = await dappClient().getDAppClient();
    let account = await walletClient.getActiveAccount();

    if (account) {
      await walletClient.requestPermissions({
        network: {
          type: walletNetwork,
          rpcUrl: getRpcNode(),
        },
      });
      account = await walletClient.getActiveAccount();
      
      return account ? account.address : null;
    } else {
      throw new Error("Not connected to wallet");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
