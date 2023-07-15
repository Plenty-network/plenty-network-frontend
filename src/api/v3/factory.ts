import { store } from "../../redux";

export const checkPoolExistence = async (
  tokenXSymbol: string,
  tokenYSymbol: string,
): Promise<any> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;

    let feeBPS : any[] = [];

    for (var key in AMM) {
      if (AMM.hasOwnProperty(key) && AMM[key].tokenX?.symbol == tokenXSymbol && AMM[key].tokenY?.symbol == tokenYSymbol) {
        feeBPS.push(AMM[key].feeBps);
      }
    }

    return {
        poolExists: true,
        feeTier : feeBPS,
    }  
    } catch (error) {
    console.log("v3 error",error );
  }
};