import { rpcNode} from '../../common/walletconnect';
import { getDexAddress } from '../util/fetchConfig';
import { BigNumber } from 'bignumber.js';
import { store } from '../../redux';
import axios from 'axios';
import { ISwapDataResponse , ICalculateTokenResponse, volatileSwapStorageType} from './types';
import { getStorage } from '../util/storageProvider';

export const loadSwapDataVolatile = async (
  tokenIn: string,
  tokenOut: string
): Promise<ISwapDataResponse> => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;
    const AMM = state.config.AMMs;

    const dexContractAddress = getDexAddress(tokenIn, tokenOut);
    if (dexContractAddress === 'false') {
      throw new Error('No dex found');
    }

    const storageResponse = await getStorage(dexContractAddress , volatileSwapStorageType);

    const token1Pool = new BigNumber(storageResponse.token1_pool);
    const token2Pool = new BigNumber(storageResponse.token2_pool);
    let lpTokenSupply = new BigNumber(storageResponse.totalSupply);
    const lpFee = new BigNumber(storageResponse.lpFee);
 
    const lpToken = AMM[dexContractAddress].lpToken;

    let tokenInSupply = new BigNumber(0);
    let tokenOutSupply = new BigNumber(0);
    if (tokenOut === AMM[dexContractAddress].token2.symbol) {
      tokenOutSupply = token2Pool;
      tokenInSupply = token1Pool;
    } else if (tokenOut === AMM[dexContractAddress].token1.symbol) {
      tokenOutSupply = token1Pool;
      tokenInSupply = token2Pool;
    }

    tokenInSupply = tokenInSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenIn].decimals));
    tokenOutSupply = tokenOutSupply.dividedBy(new BigNumber(10).pow(TOKEN[tokenOut].decimals));
    lpTokenSupply = lpTokenSupply.dividedBy(new BigNumber(10).pow(lpToken.decimals));
    const exchangeFee = new BigNumber(1).dividedBy(lpFee);
    return {
      success: true,
      tokenIn,
      tokenInSupply,
      tokenOut,
      tokenOutSupply,
      exchangeFee,
      lpTokenSupply,
      lpToken,
    };
  } catch (error) {
    console.log({ message: 'Volatileswap data error', error });
    return {
      success: true,
      tokenIn,
      tokenInSupply: new BigNumber(0),
      tokenOut,
      tokenOutSupply: new BigNumber(0),
      exchangeFee: new BigNumber(0),
      lpTokenSupply: new BigNumber(0),
      lpToken: undefined,
    };
  }
};

export const calculateTokenOutputVolatile = (
  tokenInAmount: BigNumber,
  tokenInSupply: BigNumber,
  tokenOutSupply: BigNumber,
  exchangeFee: BigNumber,
  slippage: BigNumber,
  tokenOut: string
): ICalculateTokenResponse => {
  try {
    const state = store.getState();
    const TOKEN = state.config.standard;

    const feePerc = new BigNumber(0.35);
    let tokenOutAmount = new BigNumber(0);
    tokenOutAmount = new BigNumber(1)
      .minus(exchangeFee)
      .multipliedBy(tokenOutSupply)
      .multipliedBy(tokenInAmount);
    tokenOutAmount = tokenOutAmount.dividedBy(
      tokenInSupply.plus(
        new BigNumber(1).minus(exchangeFee).multipliedBy(tokenInAmount)
      )
    );

    tokenOutAmount = new BigNumber(
      tokenOutAmount.decimalPlaces(TOKEN[tokenOut].decimals , 1)
    );

    const fees = tokenInAmount.multipliedBy(exchangeFee);
    let minimumOut = tokenOutAmount.minus(
      slippage.multipliedBy(tokenOutAmount).dividedBy(100)
    );

    minimumOut = new BigNumber(
      minimumOut.decimalPlaces(TOKEN[tokenOut].decimals , 1)
    );

    const updatedTokenInSupply = tokenInSupply.minus(tokenInAmount);
    const updatedTokenOutSupply = tokenOutSupply.minus(tokenOutAmount);
    let nextTokenOutAmount = new BigNumber(1)
      .minus(exchangeFee)
      .multipliedBy(updatedTokenOutSupply)
      .multipliedBy(tokenInAmount);
    nextTokenOutAmount = nextTokenOutAmount.dividedBy(
      updatedTokenInSupply.plus(
        new BigNumber(1).minus(exchangeFee).multipliedBy(tokenInAmount)
      )
    );
    let priceImpact = tokenOutAmount
      .minus(nextTokenOutAmount)
      .dividedBy(tokenOutAmount);
    priceImpact = priceImpact.multipliedBy(100);
    priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
    priceImpact = priceImpact.multipliedBy(100);
    const exchangeRate = tokenOutAmount.dividedBy(tokenInAmount);

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
      feePerc: new BigNumber(0),
      minimumOut: new BigNumber(0),
      exchangeRate: new BigNumber(0),
      priceImpact: new BigNumber(0),
      error
    };
  }
};
