import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import Config from '../config/config';

export const connectedNetwork = Config.NETWORK;
export const configName = Config.NAME;
// const rpcNode = localStorage.getItem(RPC_NODE) ?? Config.RPC_NODES[connectedNetwork];
export const rpcNode = Config.RPC_NODES[connectedNetwork];

// Beacon Wallet instance
// export const wallet = new BeaconWallet({
//   name: configName,
//   preferredNetwork: connectedNetwork as NetworkType,
// });

// Tezos instance
// export const tezos = new TezosToolkit(rpcNode);

// tezos.setWalletProvider(wallet);
// tezos.setRpcProvider(rpcNode);
//common tezos
// export function tezos() {
//   let tezosInstance: TezosToolkit
//   let rpcUrlInstance: string

//   async function initTezos(wallet: BeaconWallet) {
//     const { TezosToolkit } = await import('@taquito/taquito')
//     const Tezos = new TezosToolkit(rpcNode)

//     if (wallet) Tezos.setWalletProvider(wallet)
//     return Tezos
//   }

//   return {
//     loadTezos: async (rpcUrl: string, wallet: BeaconWallet) => {
//       if (!tezosInstance || rpcUrlInstance != rpcUrl) {
//         rpcUrlInstance = rpcUrl
//         tezosInstance = await initTezos(wallet)
//       }

//       return tezosInstance
//     },
//    // const dexContractInstance = await Tezos.contract.at(dexContractAddress);
//     dexContractInstance: async (dexContractAddress: string)=>{

//     }
//   }
// }

// Function to check if user wallet is already conneted
// export const CheckIfWalletConnected = async (wallet: BeaconWallet) => {
//   try {
//     const activeAccount = await wallet.client.getActiveAccount();
//     if (!activeAccount) {
//       await wallet.client.requestPermissions({
//         network: {
//           type: connectedNetwork as NetworkType,
//           rpcUrl: rpcNode,
//         },
//       });
//     }
//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error,
//     };
//   }
// };
