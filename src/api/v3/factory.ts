import { store } from "../../redux";

export const checkPoolExistence = async (
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<any> => {
  try {
    const state = store.getState();
    const AMM = state.config.V3_AMMs;

    let feeBPS: any[] = [];
    let tokenA = tokenXSymbol;
    let tokenB = tokenYSymbol;
    let poolExists = false;
    for (var key in AMM) {
      if (
        AMM.hasOwnProperty(key) &&
        ((AMM[key].tokenX?.symbol == tokenXSymbol && AMM[key].tokenY?.symbol == tokenYSymbol) ||
          (AMM[key].tokenX?.symbol == tokenYSymbol && AMM[key].tokenY?.symbol == tokenXSymbol))
      ) {
        feeBPS.push(AMM[key].feeBps);
        poolExists = true;
        tokenA = AMM[key].tokenX?.symbol as string;
        tokenB = AMM[key].tokenY?.symbol as string;
      }
    }

    return {
      poolExists: poolExists,
      feeTier: feeBPS,
      tokenA: tokenA,
      tokenB: tokenB,
    };
  } catch (error) {
    console.log("v3 error", error);
  }
};
