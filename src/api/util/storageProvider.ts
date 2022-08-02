import { Schema } from "@taquito/michelson-encoder";
import axios from "axios";
import { rpcNode } from "../../common/walletconnect";

export const getStorage = async (
  contractAddress: string,
  storageType: any
): Promise<any> => {
  try {
    const storageResponse = await axios.get(`${rpcNode}chains/main/blocks/head/context/contracts/${contractAddress}/storage`);
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
    const bigMapResponse = await axios.get(`${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`);
    return bigMapResponse;
  } catch(error: any) {
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