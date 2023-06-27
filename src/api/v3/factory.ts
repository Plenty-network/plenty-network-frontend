import { store } from "../../redux";
import { getV3DexAddress } from "../../api/util/fetchConfig";

export const checkPoolExistence = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
): Promise<any> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;

    let feeBPS;

    let v3ContractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    if(v3ContractAddress) {
        feeBPS = Number(AMM[v3ContractAddress].feeBps);
        feeBPS = feeBPS / 100;
    } 
    else {
        return {   
            poolExists: false 
        }
    }
    console.log("v3 new pool",feeBPS );


    return {
        poolExists: true,
        feeTier : feeBPS,
    }  
    } catch (error) {
    console.log("v3 error",error );
  }
};