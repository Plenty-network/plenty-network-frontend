import { BigNumber } from "bignumber.js";
import axios from "axios";
import { IClaimAPIData, IClaimDataResponse, Mission, TClaimAPIResponseData } from "./types";
import Config from "../../config/config";
import { connectedNetwork } from "../../common/walletconnect";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";

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

    // Check if api response is a JSON data or string. It's string only in case of error or not eligible.
    if (Array.isArray(tezosClaimApiData)) {
      const finalClaimData: IClaimAPIData[] = [];
      let totalClaimableAmount = new BigNumber(0);
      let pendingClaimableAmount = new BigNumber(0);
      const perMissionAmount = new BigNumber(tezosClaimApiData[0].message.value).isFinite()
        ? new BigNumber(tezosClaimApiData[0].message.value).dividedBy(PLY_DECIMAL_MULTIPLIER)
        : new BigNumber(0);

      tezosClaimApiData.forEach((missionData) => {
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
    } else if (typeof tezosClaimApiData === "string") {
      return {
        success: false,
        eligible: false,
        message: tezosClaimApiData,
        perMissionAmount: new BigNumber(0),
        totalClaimableAmount: new BigNumber(0),
        pendingClaimableAmount: new BigNumber(0),
        claimData: [],
      };
    } else {
      throw new Error("Invalid response type");
    }
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
