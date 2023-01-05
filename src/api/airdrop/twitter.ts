import axios from "axios";
import { connectedNetwork } from "../../common/walletconnect";
import Config from "../../config/config";
import { TWEET_CHARACTER_LIMIT } from "../../constants/global";
import { store } from "../../redux";
import { setHasTweeted } from "../../redux/airdrop/transactions";
import { TweetData } from "./types";

/**
 * Check if user is authenticated or not.
 * @param userTezosAddress - Tezos wallet address of user
 */
export const isUserAuthenticated = async (
  userTezosAddress: string
): Promise<{ authenticated: boolean; message: string }> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("MISSING_USER_ADDRESS");
    }
    const authCheckResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}twitter/check-auth?address=${userTezosAddress}`
    );
    const authCheckData: string = authCheckResponse.data;
    if (authCheckData === "AUTHORISED") {
      return {
        authenticated: true,
        message: authCheckData,
      };
    } else {
      return {
        authenticated: false,
        message: authCheckData,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      authenticated: false,
      message: error.message,
    };
  }
};

/**
 * Check if user has tweeted or not.
 * @param userTezosAddress - Tezos wallet address of user
 */
export const hasUserTweeted = async (
  userTezosAddress: string
): Promise<{ tweeted: boolean; message: string }> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("MISSING_USER_ADDRESS");
    }
    const hasTweeted: boolean = store.getState().airdropTransactions.hasTweeted;
    // Check if a user has already tweeted
    if(hasTweeted) {
      return {
        tweeted: true,
        message: "TWEETED",
      };
    }
    // Check if the selected user address was used to tweet or not
    const authCheckResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}twitter/check-tweet?address=${userTezosAddress}`
    );
    const authCheckData: string = authCheckResponse.data;
    if (authCheckData === "TWEETED") {
      // Set tweeted for that user irrespective of address if tweeted
      store.dispatch(setHasTweeted(true));
      return {
        tweeted: true,
        message: authCheckData,
      };
    } else {
      return {
        tweeted: false,
        message: authCheckData,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      tweeted: false,
      message: error.message,
    };
  }
};

/**
 * Authenticate a user to twitter
 * @param userTezosAddress - Tezos wallet address of user
 * @returns
 */
export const authenticateUser = async (
  userTezosAddress: string
): Promise<{ success: boolean; redirectUrl: string }> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("MISSING_USER_ADDRESS");
    }
    const authResponse = await axios.get(
      `${Config.AIRDROP_SERVER[connectedNetwork]}twitter/auth?address=${userTezosAddress}`
    );
    console.log(authResponse);
    return {
      success: true,
      redirectUrl: authResponse.data.redirectUrl,
    };
    // window.location.replace(authResponse.data.redirectUrl);
    // return authResponse.data;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      redirectUrl: "",
    };
  }
};

/**
 * Tweet a text on behalf of the user
 * @param userTezosAddress - Tezos wallet address of user
 * @param tweetText - Text to tweet limited to 280 characters currently
 * @returns
 */
export const tweetForUser = async (
  userTezosAddress: string,
  tweetText: string
): Promise<{ status: boolean; message: string }> => {
  try {
    if (!userTezosAddress || userTezosAddress.length <= 0) {
      throw new Error("MISSING_USER_ADDRESS");
    }
    if (!tweetText || tweetText.length <= 0) {
      throw new Error("MISSING_TWEET_DATA");
    }
    if (tweetText.length >= TWEET_CHARACTER_LIMIT) {
      throw new Error("TWEET_LIMIT_EXCEEDED");
    }

    const tweetData: TweetData = {
      text: tweetText,
    };

    const tweetResponse = await axios.post(
      `${Config.AIRDROP_SERVER[connectedNetwork]}twitter/tweet?address=${userTezosAddress}`,
      tweetData
    );
    const tweetResponseData: string = tweetResponse.data;

    if (tweetResponseData === "TWEETED") {
      return {
        status: true,
        message: tweetResponseData,
      };
    } else {
      return {
        status: false,
        message: tweetResponseData,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      status: false,
      message: error.message,
    };
  }
};
