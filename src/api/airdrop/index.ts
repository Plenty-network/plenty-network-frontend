import { BigNumber } from "bignumber.js";
import axios from "axios";
import {
  IClaimAPIData,
  IClaimDataResponse,
  IEvmEligibleCheckResponse,
  Mission,
  TClaimAPIResponseData,
} from "./types";
import Config from "../../config/config";
import { connectedNetwork, tzktNode } from "../../common/walletconnect";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";
import { getTzktAccountData } from "../util/storageProvider";

/**
 * Returns whether the selected tezos wallet is eligible for airdrop or not,
 * and the claimable data if eligible.
 * @param userTezosAddress - Tezos wallet address of the user
 */
export const getTezosClaimData = async (userTezosAddress: string): Promise<IClaimDataResponse> => {
  try {
    if (userTezosAddress === "" || userTezosAddress.length <= 0 || !userTezosAddress) {
      return {
        success: false,
        eligible: false,
        message: "INVALID_TEZOS_ADDRESS",
        perMissionAmount: new BigNumber(0),
        totalClaimableAmount: new BigNumber(0),
        pendingClaimableAmount: new BigNumber(0),
        claimData: [],
      };
    }
    const tezosClaimApiResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}tezos?address=${userTezosAddress}`
    );
    const tezosClaimApiData: TClaimAPIResponseData = tezosClaimApiResponse.data;
    // Create the final claim data response
    const finalClaimData: IClaimDataResponse = getClaimData(tezosClaimApiData);

    return finalClaimData;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      eligible: false,
      message: "INTERNAL_SERVER_ERROR",
      perMissionAmount: new BigNumber(0),
      totalClaimableAmount: new BigNumber(0),
      pendingClaimableAmount: new BigNumber(0),
      claimData: [],
      error: error.message,
    };
  }
};

/**
 * @deprecated Returns whether the selected evm wallet is eligible for airdrop or not,
 * and the claimable data if eligible.
 * @param ethMessage - Pre-set ETH message
 * @param ethSignature - Signed ETH message
 */
export const getEvmClaimData = async (
  ethMessage: string,
  ethSignature: string
): Promise<IClaimDataResponse> => {
  try {
    if (ethMessage === "" || ethMessage.length <= 0 || !ethMessage) {
      return {
        success: false,
        eligible: false,
        message: "INVALID_MESSAGE",
        perMissionAmount: new BigNumber(0),
        totalClaimableAmount: new BigNumber(0),
        pendingClaimableAmount: new BigNumber(0),
        claimData: [],
      };
    }
    if (ethSignature === "" || ethSignature.length <= 0 || !ethSignature) {
      return {
        success: false,
        eligible: false,
        message: "MISSING_SIGNATURE",
        perMissionAmount: new BigNumber(0),
        totalClaimableAmount: new BigNumber(0),
        pendingClaimableAmount: new BigNumber(0),
        claimData: [],
      };
    }
    const evmClaimApiResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}ethereum?ethMessage=${ethMessage}&signature=${ethSignature}`
    );
    const evmClaimApiData: TClaimAPIResponseData = evmClaimApiResponse.data;
    // Create the final claim data response
    const finalClaimData: IClaimDataResponse = getClaimData(evmClaimApiData);

    return finalClaimData;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      eligible: false,
      message: "INTERNAL_SERVER_ERROR",
      perMissionAmount: new BigNumber(0),
      totalClaimableAmount: new BigNumber(0),
      pendingClaimableAmount: new BigNumber(0),
      claimData: [],
      error: error.message,
    };
  }
};

/**
 * Checks if the selected tezos wallet address has airdrop or not.
 * @param userTezosAddress - Tezos user wallet address
 */
export const tezosWalletHasAirdrop = async (userTezosAddress: string): Promise<boolean> => {
  try {
    if (userTezosAddress === "" || userTezosAddress.length <= 0 || !userTezosAddress) {
      throw new Error("Missing Tezos user address");
    }
    const tezosClaimApiResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}tezos?address=${userTezosAddress}`
    );
    const tezosClaimApiData: TClaimAPIResponseData = tezosClaimApiResponse.data;
    // Check if api response is a JSON data or string. It's string only in case of error or not eligible.
    if (Array.isArray(tezosClaimApiData)) {
      // Considering that if airdrop is available for any user then by default it will have one mission.
      if (tezosClaimApiData.find((missionData) => missionData.mission === Mission.ELIGIBLE)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Returns if the selected user evm wallet is eligible for airdrop along with the total claimable value if yes.
 * @param evmWalletAddress - Wallet address of user for EVM chains
 */
export const isEvmWalletEligible = async (
  evmWalletAddress: string
): Promise<IEvmEligibleCheckResponse> => {
  try {
    if (evmWalletAddress === "" || evmWalletAddress.length <= 0 || !evmWalletAddress) {
      throw new Error("Invalid or missing evm wallet address");
    }
    // Forcing lower casing as required by server api
    const eligibilityAPIResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}ethereum/${evmWalletAddress.toLocaleLowerCase()}`
    );
    const eligibilityData = eligibilityAPIResponse.data;

    return {
      eligible: Boolean(eligibilityData.eligible),
      value: new BigNumber(eligibilityData.value).isFinite()
        ? new BigNumber(eligibilityData.value).dividedBy(PLY_DECIMAL_MULTIPLIER)
        : new BigNumber(0),
      tzAddress: eligibilityData.tezosAddress,
    };
  } catch (error: any) {
    console.log(error);
    return {
      eligible: false,
      value: new BigNumber(0),
      tzAddress: undefined,
      error: error.message,
    };
  }
};

/**
 * Returns whether the selected tezos wallet address is revealed or not.
 * @param userTezosAddress - Tezos user wallet address
 */
export const isTezosAddressRevealed = async (userTezosAddress: string): Promise<boolean> => {
  try {
    if (userTezosAddress === "" || userTezosAddress.length <= 0 || !userTezosAddress) {
      throw new Error("Invalid user address");
    }
    const accountResponse = await getTzktAccountData(userTezosAddress);
    const accountData = accountResponse.data;
    return Boolean(accountData.revealed);
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Returns whether the selected tezos user account has any transactions or not.
 * @param userTezosAddress - Tezos user wallet address
 */
export const tezosAccountHasTransactions = async (userTezosAddress: string): Promise<boolean> => {
  try {
    if (userTezosAddress === "" || userTezosAddress.length <= 0 || !userTezosAddress) {
      throw new Error("Invalid user address");
    }
    const transactionsResponse = await axios.get(
      `${tzktNode}v1/operations/transactions?target=${userTezosAddress}&limit=1`
    );

    return !transactionsResponse.data || transactionsResponse.data.length <= 0 ? false : true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Returns whether the selected tezos user account was already used for confirming or not.
 * @param userTezosAddress - Tezos user wallet address
 */
/* export const tzAddressAlreadyConfirmed = (userTezosAddress: string): boolean => {
  try {
    let addressConfirmed = false;
    const signaturesData = store.getState().airdropTransactions.signaturesData;

    for (const data of Object.values(signaturesData)) {
      if (data.message && data.message.length !== 0) {
        const tezosAddress = data.message.slice(Config.AIRDROP_ETH_MESSAGE_PREFIX.length);
        if (tezosAddress === userTezosAddress) {
          addressConfirmed = true;
          break;
        }
      }
    }

    return addressConfirmed;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}; */

/**
 * Submits the signature data after signing and returns the response message string.
 * "SUBMITED_TEZOS_ADDRESS" for success for now. Changes in api needs changes to this function
 * @param ethMessage - Pre-set ETH message
 * @param ethSignature - Signed ETH message
 */
 export const submitSignatureData = async (ethMessage: string, ethSignature: string): Promise<string> => {
   try {
     if (ethMessage === "" || ethMessage.length <= 0 || !ethMessage) {
       return "INVALID_MESSAGE";
     }
     if (ethSignature === "" || ethSignature.length <= 0 || !ethSignature) {
       return "MISSING_SIGNATURE";
     }
     const sigSubmissionResponse = await axios.get(
       `${Config.AIRDROP_SERVER[connectedNetwork]}ethereum?ethMessage=${ethMessage}&signature=${ethSignature}`
     );
     return sigSubmissionResponse.data;
   } catch (error: any) {
     console.log(error);
     return "INTERNAL_SERVER_ERROR";
   }
 };


/**
 * Returns the claim data created from server api response.
 * @param apiResponseData - Tezos and Eth receipts response data
 */
const getClaimData = (apiResponseData: TClaimAPIResponseData): IClaimDataResponse => {
  try {
    // Check if api response is a JSON data or string. It's string only in case of error or not eligible.
    if (Array.isArray(apiResponseData)) {
      if(apiResponseData.length <= 0) {
        return {
          success: false,
          eligible: false,
          message: "NOT_ELIGIBLE",
          perMissionAmount: new BigNumber(0),
          totalClaimableAmount: new BigNumber(0),
          pendingClaimableAmount: new BigNumber(0),
          claimData: [],
        };
      }
      const finalClaimData: IClaimAPIData[] = [];
      let totalClaimableAmount = new BigNumber(0);
      let pendingClaimableAmount = new BigNumber(0);
      const perMissionAmount = new BigNumber(apiResponseData[0].message.value).isFinite()
        ? new BigNumber(apiResponseData[0].message.value).dividedBy(PLY_DECIMAL_MULTIPLIER)
        : new BigNumber(0);

      apiResponseData.forEach((missionData) => {
        totalClaimableAmount = totalClaimableAmount.plus(missionData.message.value);
        if (!missionData.claimed) {
          pendingClaimableAmount = pendingClaimableAmount.plus(missionData.message.value);
        }
        finalClaimData.push({
          ...missionData,
          message: {
            ...missionData.message,
            value: new BigNumber(missionData.message.value).dividedBy(PLY_DECIMAL_MULTIPLIER),
          },
        });
      });
      totalClaimableAmount = totalClaimableAmount.dividedBy(PLY_DECIMAL_MULTIPLIER);
      pendingClaimableAmount = pendingClaimableAmount.dividedBy(PLY_DECIMAL_MULTIPLIER);

      return {
        success: true,
        eligible: true,
        message: "",
        perMissionAmount,
        totalClaimableAmount,
        pendingClaimableAmount,
        claimData: finalClaimData,
      };
    } else if (typeof apiResponseData === "string") {
      return {
        success: false,
        eligible: false,
        message: apiResponseData,
        perMissionAmount: new BigNumber(0),
        totalClaimableAmount: new BigNumber(0),
        pendingClaimableAmount: new BigNumber(0),
        claimData: [],
      };
    } else {
      throw new Error("Invalid response type");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};