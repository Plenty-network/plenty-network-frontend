import axios from "axios";
// import * as isIPFS from "is-ipfs";
import { validateContractAddress, ValidationResult } from "@taquito/utils";
import { getTzktTokenData } from "./storageProvider";
import { Chain, IConfigToken, TokenStandard } from "../../config/types";
import Config from "../../config/config";
import { ITzktTokensListResponse } from "./types";

/**
 * Returns the list of token(s) for a given contract address.
 * @param tokenContract - Valid tezos token contract address
 */
export const getTokenDataFromTzkt = async (
  tokenContract: string
): Promise<ITzktTokensListResponse> => {
  try {
    // Check if entered value is a valid tezos contract address
    if (!isValidContract(tokenContract)) {
      throw new Error("Invalid contract address");
    }
    const tzktTokenResponse = await getTzktTokenData(`?contract=${tokenContract}`);
    const tzktTokensData = tzktTokenResponse.data;
    // Return empty array if token response length is 0
    if (tzktTokensData.length <= 0) {
      return {
        success: true,
        allTokensList: [],
      };
    }
    // Check if metadata key exists for one or more tokens in the contract. Ignore if exists for none.
    if (!metadataExists(tzktTokensData)) {
      throw new Error("No metadata found for the tokens");
    }
    // Check if any of the token in contract is NFT. Ignore if found.
    if (isNFTContract(tzktTokensData)) {
      throw new Error("NFT contact found. Not allowed for pool creation");
    }
    const finalTokensDataList: IConfigToken[] = [];
    for (const tokenData of tzktTokensData) {
      console.log(tokenData);
      if (
        Object.keys(tokenData).includes("metadata") &&
        !Object.keys(tokenData.metadata).includes("artifactUri") &&
        !Object.keys(tokenData.metadata).includes("artifact_uri") &&
        isValidToken(tokenData)
      ) {
        const finalTokenData = await createTokenData(tokenData);
        if (finalTokenData) {
          finalTokensDataList.push(finalTokenData);
        }
      }
    }
    console.log(finalTokensDataList);
    return {
      success: true,
      allTokensList: finalTokensDataList,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      allTokensList: [],
      error: error.message,
    };
  }
};

/**
 * Check if the given contract address is a valid tezos token contract using taquito api
 * @param contract - Tezos contract address
 */
const isValidContract = (contract: string): boolean => {
  try {
    const validation = validateContractAddress(contract);
    return validation === ValidationResult.VALID;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Check if any of the tokens in the list of token under a contract has metadata.
 * Returns true if atleast one of the tokens has metadata.
 * @param tzktTokensData - List of tokens data received from tzkt as response
 */
const metadataExists = (tzktTokensData: any): boolean => {
  try {
    const metadata = tzktTokensData.find((token: any) => Object.keys(token).includes("metadata"));
    return metadata ? true : false;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Check if any of the tokens in the list of tokens under a contract is a NFT.
 * It's based on an assumption that every valid NFT will have an artifactUri key within metadata.
 * @param tzktTokensData - List of tokens data received from tzkt as response
 */
const isNFTContract = (tzktTokensData: any): boolean => {
  try {
    const metadata = tzktTokensData.find((token: any) =>
      Object.keys(token).includes("metadata")
        ? Object.keys(token.metadata).includes("artifactUri") ||
          Object.keys(token.metadata).includes("artifact_uri")
        : false
    );
    return metadata ? true : false;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Checks if a token is valid, i.e. it has a symbol, name, standard, token_id and decimals,
 * which are mandatory for further processing.
 * @param tokenData - Individual token data object from the list of tokens data received from tzkt as response
 */
const isValidToken = (tokenData: any): boolean => {
  try {
    if (
      tokenData.metadata.symbol &&
      tokenData.metadata.name &&
      (tokenData.standard === "fa2" || tokenData.standard === "fa1.2") &&
      tokenData.tokenId &&
      tokenData.metadata.decimals
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Create the token data structure required for further processing from raw tzkt data.
 * @param tokenData - Individual token data object from the list of tokens data received from tzkt as response
 */
const createTokenData = async (tokenData: any): Promise<IConfigToken | undefined> => {
  try {
    const finalTokenObject: IConfigToken = {
      address: tokenData.contract.address,
      symbol: tokenData.metadata.symbol,
      name: tokenData.metadata.name,
      standard: tokenData.standard === "fa2" ? TokenStandard.FA2 : TokenStandard.FA12,
      tokenId: Number(tokenData.tokenId),
      decimals: Number(tokenData.metadata.decimals),
      originChain: Chain.TEZOS,
      pairs: [],
      iconUrl: await getIconUrl(tokenData.metadata),
    };
    return finalTokenObject;
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

/**
 * Creates a valid token image url for getting the token icon,
 * from the ipfs data or http url data provided in a token metadata. 
 * Returns undefined if no valid icon data exists.
 * @param tokenMetadata - Metadata object of the individual token data object from the list oftokens data received from tzkt as response
 */
export const getIconUrl = async (tokenMetadata: any): Promise<string | undefined> => {
  try {
    let iconUri: string | undefined = undefined;
    // Check under which key an icon uri exists in the metadata. It can possibly be under these three keys.
    // Return undefined if not found under any of them.
    if (Object.keys(tokenMetadata).includes("thumbnailUri")) {
      iconUri = tokenMetadata.thumbnailUri;
    } else if (Object.keys(tokenMetadata).includes("thumbnail_uri")) {
      iconUri = tokenMetadata.thumbnail_uri;
    } else if (Object.keys(tokenMetadata).includes("icon")) {
      iconUri = tokenMetadata.icon;
    } else {
      return undefined;
    }

    if (isValidIPFSPath(iconUri as string)) {
      const path = getPathFromIPFS(iconUri as string);
      // Check if the path of ipfs url is valid or not
      /* if (isIPFS.ipfsPath(`/ipfs/${path as string}`)) {
        const ipfsUri = `${Config.IPFS_LINKS.primary}${path as string}`;
        // Fallback ipfs viewing service if first one fails.
        const fallBackIpfsUri = `${Config.IPFS_LINKS.fallback}${path as string}`;
        // Check if the final ipfs url is a valid one.
        return isIPFS.ipfsUrl(ipfsUri)
          ? ipfsUri
          : isIPFS.ipfsUrl(fallBackIpfsUri)
          ? fallBackIpfsUri
          : undefined;
      } else {
        return undefined;
      } */
      const ipfsUri = `${Config.IPFS_LINKS.primary}${path as string}`;
      return await isValidHttpURL(ipfsUri as string) ? ipfsUri : undefined;
      // If not a valid IPFS it can be a nomal http url to icon, check and confirm
    } else if (await isValidHttpURL(iconUri as string)) {
      return iconUri as string;
    } else {
      return undefined;
    }
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

/**
 * Checks if the IPFS path received from token metadata is a valid one.
 * Currently works for any ipfs of format - ipfs://{cid}
 * @param path - ipfs path string from token metadata
 */
const isValidIPFSPath = (path: string): boolean => {
  try {
    return path.startsWith("ipfs://");
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

/**
 * Fetch the cid part of the ipfs uri received from the token metadata.
 * Currently works for any ipfs of format - ipfs://{cid}
 * @param ipfsUri - ipfs path string from token metadata
 */
const getPathFromIPFS = (ipfsUri: string): string | undefined => {
  try {
    // let indexToSliceFrom = ipfsUri.lastIndexOf("/");
    const indexToSliceFrom = String("ipfs://").length;
    // if (indexToSliceFrom < 0) {
    //   return undefined;
    // }
    // Increment the index by one to exclude / from return CID value
    // indexToSliceFrom += 1;

    const path = ipfsUri.slice(indexToSliceFrom);
    return path.length > 0 ? path : undefined;
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

/**
 * Checks if the provided http/https url is valid and working.
 * @param url - A http/https url string
 */
const isValidURL = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};


/**
 * Validates the URL string for http/https.
 * @param url - A http/https url string
 */
const isValidHttpURL = async (url: string): Promise<boolean> => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
};
