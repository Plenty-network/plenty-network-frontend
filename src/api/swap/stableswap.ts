import CONFIG from '../../config/config';
import BigNumber from 'bignumber.js';
import { store } from '../../redux';
import axios from 'axios';
import { connectedNetwork, rpcNode } from '../../common/walletconnect';
import { getDexAddress } from '../util/fetchConfig';
import { ISwapDataResponse , ICalculateTokenResponse, tezCtezStorageType, stableswapStorageType } from './types';
import { getStorage } from '../util/storageProvider';

const util = (
  x: BigNumber,
  y: BigNumber
): { first: BigNumber; second: BigNumber } => {
  const plus = x.plus(y);
  const minus = x.minus(y);
  const plus2 = plus.multipliedBy(plus);
  const plus4 = plus2.multipliedBy(plus2);
  const plus8 = plus4.multipliedBy(plus4);
  const plus7 = plus4.multipliedBy(plus2).multipliedBy(plus);
  const minus2 = minus.multipliedBy(minus);
  const minus4 = minus2.multipliedBy(minus2);
  const minus8 = minus4.multipliedBy(minus4);
  const minus7 = minus4.multipliedBy(minus2).multipliedBy(minus);
  return {
    first: plus8.minus(minus8),
    second: new BigNumber(8).multipliedBy(minus7.plus(plus7)),
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
  let newUtil = util(x.plus(dx), y.minus(dy));
  let newU = newUtil.first;
  let newDuDy = newUtil.second;
  while (n !== 0) {
    newUtil = util(x.plus(dx), y.minus(dy1));
    newU = newUtil.first;
    newDuDy = newUtil.second;
    dy1 = dy1.plus(newU.minus(u).dividedBy(newDuDy));
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
  tokenASupply: BigNumber,
  tokenBSupply: BigNumber
): { tokenAexchangeRate: BigNumber; tokenBexchangeRate: BigNumber } => {
  const tokenAexchangeRate = tokenASupply.dividedBy(tokenBSupply);
  const tokenBexchangeRate = tokenBSupply.dividedBy(tokenASupply);

  return {
    tokenAexchangeRate,
    tokenBexchangeRate,
  };
};

export const calculateTokensOutTezCtez = (
  tezSupply: BigNumber,
  ctezSupply: BigNumber,
  tokenInAmount: BigNumber,
  pairFeeDenom: BigNumber,
  slippage: BigNumber,
  target: BigNumber,
  tokenIn: string
): ICalculateTokenResponse => {

  const feePerc = new BigNumber(0.1);
  tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(6));
  tezSupply = tezSupply.multipliedBy(new BigNumber(10).pow(6));
  ctezSupply = ctezSupply.multipliedBy(new BigNumber(10).pow(6));
  try {
    if (tokenIn === 'ctez') {
      const dy = newton_dx_to_dy(
        target.multipliedBy(ctezSupply),
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        tokenInAmount.multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));
      let fee = dy.dividedBy(pairFeeDenom);
      let tokenOut = dy.minus(fee);
      let minOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minOut = minOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenInAmount); 

      const updatedCtezSupply = ctezSupply.plus(tokenInAmount);
      const updatedTezSupply = tezSupply.minus(tokenOut);

      const nextDy = newton_dx_to_dy(
        target.multipliedBy(updatedCtezSupply),
        updatedTezSupply.multipliedBy(new BigNumber(2).pow(48)),
        tokenInAmount.multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));

      const nextFee = nextDy.dividedBy(pairFeeDenom);
      const nextTokenOut = nextDy.minus(nextFee);
      let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOutAmount = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6 , 1));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimumOut = new BigNumber(minOut.decimalPlaces(6 , 1));

      return {
        tokenOutAmount,
        fees,
        feePerc,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    } else if (tokenIn === 'tez') {
      const dy = newton_dx_to_dy(
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(ctezSupply),
        tokenInAmount.multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      let fee = dy.dividedBy(pairFeeDenom);
      let tokenOut = dy.minus(fee);
      let minOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minOut = minOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenInAmount);

      const updatedCtezSupply = ctezSupply.minus(tokenOut);
      const updatedTezSupply = tezSupply.plus(tokenInAmount);

      const nextDy = newton_dx_to_dy(
        updatedTezSupply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(updatedCtezSupply),
        tokenInAmount.multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      const nextFee = nextDy.dividedBy(pairFeeDenom);
      const nextTokenOut = nextDy.minus(nextFee);
      let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOutAmount  = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6 , 1));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimumOut = new BigNumber(minOut.decimalPlaces(6 , 1));
      return {
        tokenOutAmount,
        fees,
        feePerc,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    }
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
    };
  } catch (error) {
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error,
    };
  }
};

export const calculateTokensInTezCtez = (
  tezSupply: BigNumber,
  ctezSupply: BigNumber,
  tokenInAmount: BigNumber,
  pairFeeDenom: BigNumber,
  slippage: BigNumber,
  target: BigNumber,
  tokenIn: string
): ICalculateTokenResponse => {

  const feePerc = new BigNumber(0.1);
  tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(6));
  tezSupply = tezSupply.multipliedBy(new BigNumber(10).pow(6));
  ctezSupply = ctezSupply.multipliedBy(new BigNumber(10).pow(6));
  try {
    if (tokenIn === 'ctez') {
      const dy = newton_dx_to_dy(
        target.multipliedBy(ctezSupply),
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));
      let fee = dy.dividedBy(pairFeeDenom);
      // let tokenOut = dy.minus(fee);
      let tokenOut = dy.plus(dy.multipliedBy(0.001));
      let minOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minOut = minOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenInAmount); 

      const updatedCtezSupply = ctezSupply.plus(tokenInAmount);
      const updatedTezSupply = tezSupply.minus(tokenOut);

      const nextDy = newton_dx_to_dy(
        target.multipliedBy(updatedCtezSupply),
        updatedTezSupply.multipliedBy(new BigNumber(2).pow(48)),
        tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(target),
        5
      ).dividedBy(new BigNumber(2).pow(48));

      const nextFee = nextDy.dividedBy(pairFeeDenom);
      const nextTokenOut = nextDy.minus(nextFee);
      let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOutAmount = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6 , 1));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimumOut = new BigNumber(minOut.decimalPlaces(6 , 1));

      return {
        tokenOutAmount,
        fees,
        feePerc,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    } else if (tokenIn === 'tez') {
      const dy = newton_dx_to_dy(
        tezSupply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(ctezSupply),
        tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      let fee = dy.dividedBy(pairFeeDenom);
      // let tokenOut = dy.minus(fee);
      let tokenOut = dy.plus(dy.multipliedBy(0.001));
      let minOut = tokenOut.minus(
        slippage.multipliedBy(tokenOut).dividedBy(100)
      );
      minOut = minOut.dividedBy(new BigNumber(10).pow(6));
      const exchangeRate = tokenOut.dividedBy(tokenInAmount);

      const updatedCtezSupply = ctezSupply.minus(tokenOut);
      const updatedTezSupply = tezSupply.plus(tokenInAmount);

      const nextDy = newton_dx_to_dy(
        updatedTezSupply.multipliedBy(new BigNumber(2).pow(48)),
        target.multipliedBy(updatedCtezSupply),
        tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(new BigNumber(2).pow(48)),
        5
      ).dividedBy(target);
      const nextFee = nextDy.dividedBy(pairFeeDenom);
      const nextTokenOut = nextDy.minus(nextFee);
      let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      const tokenOutAmount  = new BigNumber(tokenOut.dividedBy(new BigNumber(10).pow(6)).decimalPlaces(6 , 1));
      const fees = fee.dividedBy(new BigNumber(10).pow(6));
      const minimumOut = new BigNumber(minOut.decimalPlaces(6 , 1));
      return {
        tokenOutAmount,
        fees,
        feePerc,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    }
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
    };
  } catch (error) {
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
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
      throw new Error('No dex found');
    }

    const storageResponse = await getStorage(dexContractAddress , tezCtezStorageType);

    let tezSupply: BigNumber = new BigNumber(storageResponse.tezPool);
    let ctezSupply: BigNumber = new BigNumber(storageResponse.ctezPool);
    let lpTokenSupply: BigNumber = new BigNumber(storageResponse.lqtTotal);
    const exchangeFee = new BigNumber(storageResponse.lpFee);
    const lpToken = AMM[dexContractAddress].lpToken;
    const ctezAddress = CONFIG.CTEZ[connectedNetwork];
    const ctezStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/${ctezAddress}/storage`;
    const ctezStorage = await axios.get(ctezStorageUrl);
    const target = new BigNumber(ctezStorage.data.args[2].int);

    tezSupply = tezSupply.dividedBy(new BigNumber(10).pow(6));
    ctezSupply = ctezSupply.dividedBy(new BigNumber(10).pow(6));
    lpTokenSupply = lpTokenSupply.dividedBy(new BigNumber(10).pow(6));

    let tokenInSupply = new BigNumber(0);
    let tokenOutSupply = new BigNumber(0);
    if (tokenOut === AMM[dexContractAddress].token2.symbol) {
      tokenOutSupply = ctezSupply;
      tokenInSupply = tezSupply;
    } else if (tokenOut === AMM[dexContractAddress].token1.symbol) {
      tokenOutSupply = tezSupply;
      tokenInSupply = ctezSupply;
    }

    return {
      success: true,
      tokenInSupply,
      tokenOutSupply,
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
      tokenInSupply: new BigNumber(0),
      tokenOutSupply: new BigNumber(0),
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
  tokenInSupply: BigNumber,
  tokenOutSupply: BigNumber,
  tokenInAmount: BigNumber,
  Exchangefee: BigNumber,
  slippage: BigNumber,
  tokenIn: string,
  tokenOut: string,
  tokenInPrecision: BigNumber,
  tokenOutPrecision: BigNumber
): ICalculateTokenResponse => {
  const state = store.getState();
  const TOKEN = state.config.standard;
  const feePerc = new BigNumber(0.1);

  tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenInSupply = tokenInSupply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenOutSupply = tokenOutSupply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));

  try {
    tokenInSupply = tokenInSupply.multipliedBy(tokenInPrecision);
    tokenOutSupply = tokenOutSupply.multipliedBy(tokenOutPrecision);

    const dy = newton_dx_to_dy(
      tokenInSupply,
      tokenOutSupply,
      tokenInAmount.multipliedBy(tokenInPrecision),
      5
    );

    let fee = dy.dividedBy(Exchangefee);
    let tokenOutAmt = dy.minus(fee).dividedBy(tokenOutPrecision);

    let minOut = tokenOutAmt.minus(
      slippage.multipliedBy(tokenOutAmt).dividedBy(100)
    );
    minOut = minOut.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));

    const updatedTokenInPool = tokenInSupply.plus(tokenInAmount);
    const updatedTokenOutPool = tokenOutSupply.minus(tokenOutAmt);

    const nextDy = newton_dx_to_dy(
      updatedTokenInPool,
      updatedTokenOutPool,
      tokenInAmount.multipliedBy(tokenInPrecision),
      5
    );
    const nextFee = nextDy.dividedBy(Exchangefee);
    const nextTokenOut = nextDy.minus(nextFee).dividedBy(tokenOutPrecision);
    let priceImpact = tokenOutAmt.minus(nextTokenOut).dividedBy(tokenOutAmt);
    priceImpact = priceImpact.multipliedBy(100);
    priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
    tokenOutAmt = tokenOutAmt.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    fee = fee.dividedBy(tokenOutPrecision);
    fee = fee.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    const tokenOutAmount = new BigNumber(tokenOutAmt.decimalPlaces(TOKEN[tokenOut].decimals , 1));
    const minimumOut = new BigNumber(minOut.decimalPlaces(TOKEN[tokenOut].decimals , 1));
    const fees = fee;
    const exchangeRate = tokenOutAmount.dividedBy(
      tokenInAmount.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals))
    );
    return {
      tokenOutAmount,
      fees,
      feePerc,
      minimumOut,
      exchangeRate,
      priceImpact,
    };
  } catch (error) {
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error,
    };
  }
};

export const calculateTokensInGeneralStable = (
  tokenInSupply: BigNumber,
  tokenOutSupply: BigNumber,
  tokenInAmount: BigNumber,
  Exchangefee: BigNumber,
  slippage: BigNumber,
  tokenIn: string,
  tokenOut: string,
  tokenInPrecision: BigNumber,
  tokenOutPrecision: BigNumber
): ICalculateTokenResponse => {
  const state = store.getState();
  const TOKEN = state.config.standard;
  const feePerc = new BigNumber(0.1);

  tokenInAmount = tokenInAmount.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenInSupply = tokenInSupply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
  tokenOutSupply = tokenOutSupply.multipliedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));

  try {
    tokenInSupply = tokenInSupply.multipliedBy(tokenInPrecision);
    tokenOutSupply = tokenOutSupply.multipliedBy(tokenOutPrecision);

    const dy = newton_dx_to_dy(
      tokenInSupply,
      tokenOutSupply,
      tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(tokenInPrecision),
      5
    );
      console.log(dy.toString());


      let fee = dy.dividedBy(Exchangefee);
      // let tokenOutAmt = dy.minus(fee).dividedBy(tokenOutPrecision);
      let tokenOutAmt = dy.dividedBy(tokenOutPrecision);
      tokenOutAmt = tokenOutAmt.plus(tokenOutAmt.multipliedBy(0.001));
  
      let minOut = tokenOutAmt.minus(
        slippage.multipliedBy(tokenOutAmt).dividedBy(100)
      );
      minOut = minOut.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
  
      const updatedTokenInPool = tokenInSupply.plus(tokenInAmount);
      const updatedTokenOutPool = tokenOutSupply.minus(tokenOutAmt);
  
      const nextDy = newton_dx_to_dy(
        updatedTokenInPool,
        updatedTokenOutPool,
        tokenInAmount.multipliedBy(new BigNumber(1000).dividedBy(999)).multipliedBy(tokenInPrecision),
        5
      );
      const nextFee = nextDy.dividedBy(Exchangefee);
      const nextTokenOut = nextDy.minus(nextFee).dividedBy(tokenOutPrecision);
      let priceImpact = tokenOutAmt.minus(nextTokenOut).dividedBy(tokenOutAmt);
      priceImpact = priceImpact.multipliedBy(100);
      priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
      tokenOutAmt = tokenOutAmt.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
      fee = fee.dividedBy(tokenOutPrecision);
      fee = fee.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
      const tokenOutAmount = new BigNumber(tokenOutAmt.decimalPlaces(TOKEN[tokenOut].decimals , 1));
      const minimumOut = new BigNumber(minOut.decimalPlaces(TOKEN[tokenOut].decimals , 1));
      const fees = fee;
      const exchangeRate = tokenOutAmount.dividedBy(
        tokenInAmount.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals))
      );
    console.log(tokenOutAmount.toString(),
      fees.toString(),
      feePerc.toString(),
      minimumOut.toString(),
      exchangeRate.toString(),
      priceImpact.toString(),);

    return {
      tokenOutAmount,
      fees,
      feePerc,
      minimumOut,
      exchangeRate,
      priceImpact,
    };
  } catch (error) {
    return {
      tokenOutAmount: new BigNumber(0),
      fees: new BigNumber(0),
      feePerc : new BigNumber(0),
      minimumOut: new BigNumber(0),
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
      throw new Error('No dex found');
    }

    const storageResponse = await getStorage(dexContractAddress , stableswapStorageType);

    const token1Pool = new BigNumber(storageResponse.token1Pool);
    const token2Pool = new BigNumber(storageResponse.token2Pool);  
    const token1Precision = new BigNumber(AMM[dexContractAddress].token1Precision as string);
    const token2Precision = new BigNumber(AMM[dexContractAddress].token2Precision as string);

    let tokenInSupply = new BigNumber(0);
    let tokenOutSupply = new BigNumber(0);
    let tokenInPrecision = new BigNumber(0);
    let tokenOutPrecision = new BigNumber(0);
    if (tokenOut === AMM[dexContractAddress].token2.symbol) {
      tokenOutSupply = token2Pool;
      tokenOutPrecision = token2Precision;
      tokenInSupply = token1Pool;
      tokenInPrecision = token1Precision;
    } else if (tokenOut === AMM[dexContractAddress].token1.symbol) {
      tokenOutSupply = token1Pool;
      tokenOutPrecision = token1Precision;
      tokenInSupply = token2Pool;
      tokenInPrecision = token2Precision;
    }
    const exchangeFee = new BigNumber(storageResponse.lpFee);
    let lpTokenSupply = new BigNumber(storageResponse.lqtTotal);
    const lpToken = AMM[dexContractAddress].lpToken;

    tokenInSupply = tokenInSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
    tokenOutSupply = tokenOutSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    lpTokenSupply = lpTokenSupply.dividedBy(new BigNumber(10).pow(lpToken.decimals));

    return {
      success: true,
      tokenIn,
      tokenInSupply,
      tokenOut,
      tokenOutSupply,
      exchangeFee,
      lpTokenSupply,
      lpToken,
      tokenInPrecision,
      tokenOutPrecision,
    };
  } catch (error) {
    console.log({ message: 'Stableswap data error', error });
    return {
      success: false,
      tokenIn,
      tokenInSupply: new BigNumber(0),
      tokenOut,
      tokenOutSupply: new BigNumber(0),
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
      tokenInPrecision: new BigNumber(0),
      tokenOutPrecision: new BigNumber(0),
    };
  }
};
