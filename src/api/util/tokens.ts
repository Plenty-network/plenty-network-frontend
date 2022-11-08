import { BigNumber } from "bignumber.js";
import axios from "axios";
import * as isIPFS from "is-ipfs";
import { validateContractAddress, ValidationResult } from "@taquito/utils";
import { getTzktTokenData } from "./storageProvider";
import { ITokenInterface, TokenType, TokenVariant } from "../../config/types";
import Config from "../../config/config";
import { ITzktTokensListResponse } from "./types";

export const getTokenDataFromTzkt = async (
  tokenContract: string
): Promise<ITzktTokensListResponse> => {
  try {
    if (!isValidContract(tokenContract)) {
      throw new Error("Invalid contract address");
    }
    const tzktTokenResponse = await getTzktTokenData(`?contract=${tokenContract}`);
    const tzktTokensData = tzktTokenResponse.data;
    // console.log(tzktTokensData);
    if (tzktTokensData.length <= 0) {
      throw new Error("Token data doesn't exist");
    }
    if (!metadataExists(tzktTokensData)) {
      throw new Error("No metadata found for the tokens");
    }
    if (isNFTContract(tzktTokensData)) {
      throw new Error("NFT contact found. Not allowed for pool creation");
    }
    const finalTokensDataList: ITokenInterface[] = [];
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

const isValidContract = (contract: string): boolean => {
  try {
    const validation = validateContractAddress(contract);
    return validation === ValidationResult.VALID;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

const metadataExists = (tzktTokensData: any): boolean => {
  try {
    const metadata = tzktTokensData.find((token: any) => Object.keys(token).includes("metadata"));
    return metadata ? true : false;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

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

const isValidToken = (tokenData: any): boolean => {
  try {
    if (
      tokenData.metadata.symbol &&
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

const createTokenData = async (tokenData: any): Promise<ITokenInterface | undefined> => {
  try {
    const finalTokenObject: ITokenInterface = {
      address: tokenData.contract.address,
      symbol: tokenData.metadata.symbol,
      variant: tokenData.standard === "fa2" ? TokenVariant.FA2 : TokenVariant.FA12,
      type: TokenType.STANDARD,
      tokenId: Number(tokenData.tokenId),
      decimals: Number(tokenData.metadata.decimals),
      pairs: [],
      iconUrl: await getIconUrl(tokenData.metadata),
    };
    return finalTokenObject;
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

const getIconUrl = async (tokenMetadata: any): Promise<string | undefined> => {
  try {
    let iconUri: string | undefined = undefined;
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
      const cid = getCIDFromIPFS(iconUri as string);
      if (isIPFS.cid(cid as string)) {
        const ipfsUri = `${Config.IPFS_LINKS.primary}${cid as string}`;
        const fallBackIpfsUri = `${Config.IPFS_LINKS.fallback}${cid as string}`;
        return isIPFS.ipfsUrl(ipfsUri)
          ? ipfsUri
          : isIPFS.ipfsUrl(fallBackIpfsUri)
          ? fallBackIpfsUri
          : undefined;
      } else {
        return undefined;
      }
    } else if (await isValidURL(iconUri as string)) {
      return iconUri as string;
    } else {
      return undefined;
    }
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

const isValidIPFSPath = (uri: string): boolean => {
  try {
    return uri.startsWith("ipfs://");
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

const getCIDFromIPFS = (ipfsUri: string): string | undefined => {
  try {
    let indexToSliceFrom = ipfsUri.lastIndexOf("/");
    if (indexToSliceFrom < 0) {
      return undefined;
    }
    // Increment the index by one to exclude / from return CID value
    indexToSliceFrom += 1;

    const cid = ipfsUri.slice(indexToSliceFrom);
    return cid.length > 0 ? cid : undefined;
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
};

const isValidURL = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
