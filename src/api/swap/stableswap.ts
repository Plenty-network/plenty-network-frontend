import CONFIG from '../../config/config';
import BigNumber from 'bignumber.js';
import { store } from '../../redux';
import axios from 'axios';
import { connectedNetwork, rpcNode } from '../../common/wallet';
import { getDexAddress } from '../util/fetchConfig';
import { ISwapDataResponse , ICalculateTokenResponse } from './types';

const util = (
  x: BigNumber,
  y: BigNumber
): { first: BigNumber; second: BigNumber } => {
  const plus = x.plus(y);
  const minus = x.minus(y);
  const plus_2 = plus.multipliedBy(plus);
  const plus_4 = plus_2.multipliedBy(plus_2);
  const plus_8 = plus_4.multipliedBy(plus_4);
  const plus_7 = plus_4.multipliedBy(plus_2).multipliedBy(plus);
  const minus_2 = minus.multipliedBy(minus);
  const minus_4 = minus_2.multipliedBy(minus_2);
  const minus_8 = minus_4.multipliedBy(minus_4);
  const minus_7 = minus_4.multipliedBy(minus_2).multipliedBy(minus);
  return {
    first: plus_8.minus(minus_8),
    second: new BigNumber(8).multipliedBy(minus_7.plus(plus_7)),
  };
};

const newton = (
  x: BigNumber,
  y: BigNumber,
  dx: BigNumber,
  dy: BigNumber,
  u: BigNumber,
  n: number
): BigNumber => {
  let dy1 = dy;
  let new_util = util(x.plus(dx), y.minus(dy));
  let new_u = new_util.first;
  let new_du_dy = new_util.second;
  while (n !== 0) {
    new_util = util(x.plus(dx), y.minus(dy1));
    new_u = new_util.first;
    new_du_dy = new_util.second;
    dy1 = dy1.plus(new_u.minus(u).dividedBy(new_du_dy));
    n = n - 1;
  }
  return dy1;
};

export const newton_dx_to_dy = (
  x: BigNumber,
  y: BigNumber,
  dx: BigNumber,
  rounds: number
): BigNumber => {
  const utility = util(x, y);
  const u = utility.first;
  const dy = newton(x, y, dx, new BigNumber(0), u, rounds);
  return dy;
};
export const getGeneralExchangeRate = (
  tokenA_supply: BigNumber,
  tokenB_supply: BigNumber
): { tokenAexchangeRate: BigNumber; tokenBexchangeRate: BigNumber } => {
  const tokenAexchangeRate = tokenA_supply.dividedBy(tokenB_supply);
  const tokenBexchangeRate = tokenB_supply.dividedBy(tokenA_supply);

  return {
    tokenAexchangeRate,
    tokenBexchangeRate,
  };
};

export const calculateTokensOutTezCtez = (
  tezSupply: BigNumber,
  ctezSupply: BigNumber,
  tokenIn_amount: BigNumber,
  pair_fee_denom: BigNumber,
  slippage: BigNumber,
  target: BigNumber,
  tokenIn: string
): ICalculateTokenResponse => {

  const feePerc = new BigNumber(0.1);
  tokenIn_amount = tokenIn_amount.multipliedBy(new BigNumber(10).pow(6));
  tezSupply = tezSupply.multipliedBy(new BigNumber(10).pow(6));
  ctezSupply = ctezSupply.multipliedBy(new BigNumber(10).pow(6));
  try {
    if (tokenIn === 'ctez') {
      const dy = newton_dx_to_dy(
        target.multipliedBy(ctezSupply),
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        tokenIn_amount.multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));
      let fee = dy.dividedBy(pair_fee_denom);
      let tokenOut = dy.minus(fee);
      let minimumOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minimumOut = minimumOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenIn_amount); 

      const updated_Ctez_Supply = ctezSupply.plus(tokenIn_amount);
      const updated_Tez_Supply = tezSupply.minus(tokenOut);

      const next_dy = newton_dx_to_dy(
        target.multipliedBy(updated_Ctez_Supply),
        updated_Tez_Supply.multipliedBy(new BigNumber(2).pow(48)),
        tokenIn_amount.multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));

      const next_fee = next_dy.dividedBy(pair_fee_denom);
      const next_tokenOut = next_dy.minus(next_fee);
      let priceImpact = tokenOut.minus(next_tokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOut_amount = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimum_Out = new BigNumber(minimumOut.decimalPlaces(6));

      return {
        tokenOut_amount,
        fees,
        feePerc,
        minimum_Out,
        exchangeRate,
        priceImpact,
      };
    } else if (tokenIn === 'tez') {
      const dy = newton_dx_to_dy(
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(ctezSupply),
        tokenIn_amount.multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      let fee = dy.dividedBy(pair_fee_denom);
      let tokenOut = dy.minus(fee);
      let minimumOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minimumOut = minimumOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenIn_amount);

      const updated_Ctez_Supply = ctezSupply.minus(tokenOut);
      const updated_Tez_Supply = tezSupply.plus(tokenIn_amount);

      const next_dy = newton_dx_to_dy(
        updated_Tez_Supply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(updated_Ctez_Supply),
        tokenIn_amount.multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      const next_fee = next_dy.dividedBy(pair_fee_denom);
      const next_tokenOut = next_dy.minus(next_fee);
      let priceImpact = tokenOut.minus(next_tokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOut_amount  = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimum_Out = new BigNumber(minimumOut.decimalPlaces(6));
      return {
        tokenOut_amount,
        fees,
        feePerc,
        minimum_Out,
        exchangeRate,
        priceImpact,
      };
    }
    return {
      tokenOut_amount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimum_Out: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
    };
  } catch (error) {
    return {
      tokenOut_amount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimum_Out: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error,
    };
  }
};

export const loadSwapDataTezCtez = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const state = store.getState();

    const AMM = state.config.AMMs;
    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    if (dexContractAddress === 'false') {
      throw 'No dex found';
    }
    const storageResponse = await axios.get(
      `${rpcNode}chains/main/blocks/head/context/contracts/${dexContractAddress}/storage`,
    );

    let tezSupply: BigNumber = new BigNumber(storageResponse.data.args[2].args[1].int);
    let ctezSupply: BigNumber = new BigNumber(storageResponse.data.args[0].args[1].args[0].int);
    let lpTokenSupply: BigNumber = new BigNumber(storageResponse.data.args[0].args[4].int);
    const exchangeFee = new BigNumber(storageResponse.data.args[0].args[2].int);
    const lpToken = AMM[dexContractAddress].lpToken;
    const ctezAddress = CONFIG.CTEZ[connectedNetwork];
    const ctezStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/${ctezAddress}/storage`;
    const ctezStorage = await axios.get(ctezStorageUrl);
    const target = new BigNumber(ctezStorage.data.args[2].int);

    tezSupply = tezSupply.dividedBy(new BigNumber(10).pow(6));
    ctezSupply = ctezSupply.dividedBy(new BigNumber(10).pow(6));
    lpTokenSupply = lpTokenSupply.dividedBy(new BigNumber(10).pow(6));


    return {
      success: true,
      tezSupply,
      ctezSupply,
      tokenIn,
      tokenOut,
      exchangeFee,
      lpTokenSupply,
      lpToken,
      target,
    };
  } catch (error) {
    console.log({ message: 'Tez-Ctez swap data error', error });
    return {
      success: false,
      tezSupply: new BigNumber(0),
      ctezSupply: new BigNumber(0),
      tokenIn,
      tokenOut,
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
      target: new BigNumber(0),
    };
  }
};

export const calculateTokensOutGeneralStable = (
  tokenIn_supply: BigNumber,
  tokenOut_supply: BigNumber,
  tokenIn_amount: BigNumber,
  Exchangefee: BigNumber,
  slippage: BigNumber,
  tokenIn: string,
  tokenOut: string,
  tokenIn_precision: BigNumber,
  tokenOut_precision: BigNumber
): ICalculateTokenResponse => {
  const state = store.getState();
  const TOKEN = state.config.standard;
  const feePerc = new BigNumber(0.1);

  tokenIn_amount = tokenIn_amount.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenIn_supply = tokenIn_supply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenOut_supply = tokenOut_supply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));

  try {
    tokenIn_supply = tokenIn_supply.multipliedBy(tokenIn_precision);
    tokenOut_supply = tokenOut_supply.multipliedBy(tokenOut_precision);

    const dy = newton_dx_to_dy(
      tokenIn_supply,
      tokenOut_supply,
      tokenIn_amount.multipliedBy(tokenIn_precision),
      5
    );
    let fee = dy.dividedBy(Exchangefee);
    let tokenOut_amt = dy.minus(fee).dividedBy(tokenOut_precision);
    let minimumOut = tokenOut_amt.minus(
      slippage.multipliedBy(tokenOut_amt).dividedBy(100)
    );
    minimumOut = minimumOut.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));

    const updated_tokenIn_pool = tokenIn_supply.plus(tokenIn_amount);
    const updated_tokenOut_pool = tokenOut_supply.minus(tokenOut_amt);

    const next_dy = newton_dx_to_dy(
      updated_tokenIn_pool,
      updated_tokenOut_pool,
      tokenIn_amount.multipliedBy(tokenIn_precision),
      5
    );
    const next_fee = next_dy.dividedBy(Exchangefee);
    const next_tokenOut = next_dy.minus(next_fee).dividedBy(tokenOut_precision);
    let priceImpact = tokenOut_amt.minus(next_tokenOut).dividedBy(tokenOut_amt);
    priceImpact = priceImpact.multipliedBy(100);
    priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
    tokenOut_amt = tokenOut_amt.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    fee = fee.dividedBy(tokenOut_precision);
    fee = fee.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    const tokenOut_amount = new BigNumber(tokenOut_amt.decimalPlaces(TOKEN[tokenOut].decimals));
    const minimum_Out = new BigNumber(minimumOut.decimalPlaces(TOKEN[tokenOut].decimals));
    const fees = fee;
    const exchangeRate = tokenOut_amount.dividedBy(
      tokenIn_amount.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals))
    );
    return {
      tokenOut_amount,
      fees,
      feePerc,
      minimum_Out,
      exchangeRate,
      priceImpact,
    };
  } catch (error) {
    return {
      tokenOut_amount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimum_Out: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error,
    };
  }
};

export const loadSwapDataGeneralStable = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const state = store.getState();
    const AMM = state.config.AMMs;
    const TOKEN = state.config.standard;

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    if (dexContractAddress === 'false') {
      throw 'No dex found';
    }

    const storageResponse = await axios.get(
      `${rpcNode}chains/main/blocks/head/context/contracts/${dexContractAddress}/storage`,
    );

    const token1_pool = new BigNumber(storageResponse.data.args[1].args[0].args[1].int);
    const token2_pool = new BigNumber(storageResponse.data.args[3].int);  
    const token1_precision = new BigNumber(AMM[dexContractAddress].token1Precision as string);
    const token2_precision = new BigNumber(AMM[dexContractAddress].token2Precision as string);

    let tokenIn_supply = new BigNumber(0);
    let tokenOut_supply = new BigNumber(0);
    let tokenIn_precision = new BigNumber(0);
    let tokenOut_precision = new BigNumber(0);
    if (tokenOut === AMM[dexContractAddress].token2.symbol) {
      tokenOut_supply = token2_pool;
      tokenOut_precision = token2_precision;
      tokenIn_supply = token1_pool;
      tokenIn_precision = token1_precision;
    } else if (tokenOut === AMM[dexContractAddress].token1.symbol) {
      tokenOut_supply = token1_pool;
      tokenOut_precision = token1_precision;
      tokenIn_supply = token2_pool;
      tokenIn_precision = token2_precision;
    }
    const exchangeFee = new BigNumber(storageResponse.data.args[0].args[0].args[0].args[1].int);
    let lpTokenSupply = new BigNumber(storageResponse.data.args[0].args[0].args[2].int);
    const lpToken = AMM[dexContractAddress].lpToken;

    tokenIn_supply = tokenIn_supply.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
    tokenOut_supply = tokenOut_supply.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    lpTokenSupply = lpTokenSupply.dividedBy(lpToken.decimals);

    return {
      success: true,
      tokenIn,
      tokenIn_supply,
      tokenOut,
      tokenOut_supply,
      exchangeFee,
      lpTokenSupply,
      lpToken,
      tokenIn_precision,
      tokenOut_precision,
    };
  } catch (error) {
    console.log({ message: 'Stableswap data error', error });
    return {
      success: false,
      tokenIn,
      tokenIn_supply: new BigNumber(0),
      tokenOut,
      tokenOut_supply: new BigNumber(0),
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
      tokenIn_precision: new BigNumber(0),
      tokenOut_precision: new BigNumber(0),
    };
  }
};
