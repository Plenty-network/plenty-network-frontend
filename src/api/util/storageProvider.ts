import { Schema } from "@taquito/michelson-encoder";
import axios from "axios";
import { getRpcNode, publicTzktNode, tzktNode } from "../../common/walletconnect";

export const getStorage = async (
  contractAddress: string,
  storageType: any
): Promise<any> => {
  try {
    const storageResponse = await axios.get(`${getRpcNode()}chains/main/blocks/head/context/contracts/${contractAddress}/storage`);
    return getReadableStorage(storageResponse.data, storageType);
  } catch (error: any) {
    throw error;
  }
};

export const getBigMapData = async (
  mapId: string,
  packedAddress: string
): Promise<any> => {
  try {
    const bigMapResponse = await axios.get(`${getRpcNode()}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`);
    return bigMapResponse;
  } catch(error: any) {
    throw error;
  }
};

export const getTzktBigMapData = async (
  mapId: string,
  filters: string | undefined
): Promise<any> => {
  try {
    const bigMapResponse = await axios.get(`${tzktNode}v1/bigmaps/${mapId}/keys?${filters === undefined ? '' : filters}`);
    return bigMapResponse;
  } catch(error: any) {
    throw error;
  }
};

export const getTzktStorageData = async (contractAddress: string): Promise<any> => {
  try {
    const storageResponse = await axios.get(`${tzktNode}v1/contracts/${contractAddress}/storage`);
    return storageResponse;
  } catch (error: any) {
    throw error;
  }
};

export const getTzktTokenData = async (filters: string | undefined): Promise<any> => {
  try {
    const tokenResponse = await axios.get(`${publicTzktNode}v1/tokens${filters ? filters : ""}`);
    return tokenResponse;
  } catch (error: any) {
    throw error;
  }
};

const getReadableStorage = (
  storageData: any,
  storageType: any
): any => {
  const schema = new Schema(storageType);
  const readableStorage = schema.Execute(storageData);
  return readableStorage;
}