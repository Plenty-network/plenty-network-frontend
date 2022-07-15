import CONFIG from '../../config/config';
import BigNumber from 'bignumber.js';
import { useAppSelector } from '../../redux';
import axios from 'axios';
import { connectedNetwork ,tezos as Tezos , rpcNode } from '../../common/wallet';
import { getDexAddress } from '../util/fetchConfig';



const util = (x: BigNumber, y: BigNumber): { first: BigNumber, second: BigNumber } => {
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
        second: new BigNumber(8).multipliedBy((minus_7.plus(plus_7))),
    };
};

const newton = (x: BigNumber, y: BigNumber, dx: BigNumber, dy: BigNumber, u: BigNumber, n: number): BigNumber => {
    let dy1 = dy;
    let new_util = util(x.plus(dx), y.minus(dy));
    let new_u = new_util.first;
    let new_du_dy = new_util.second;
    while (n !== 0) {
        new_util = util(x.plus(dx), y.minus(dy1));
        new_u = new_util.first;
        new_du_dy = new_util.second;
        dy1 = dy1.plus((new_u.minus(u)).dividedBy(new_du_dy));
        n = n - 1;
    }
    return dy1;
};

export const newton_dx_to_dy = (x: BigNumber, y: BigNumber, dx: BigNumber, rounds: number): BigNumber => {
    const utility = util(x, y);
    const u = utility.first;
    const dy = newton(x, y, dx, new BigNumber(0), u, rounds);
    return dy;
};
export const getGeneralExchangeRate = (tokenA_supply: BigNumber, tokenB_supply: BigNumber): { tokenAexchangeRate: BigNumber, tokenBexchangeRate: BigNumber } => {

    const tokenAexchangeRate = tokenA_supply.dividedBy(tokenB_supply);
    const tokenBexchangeRate = tokenB_supply.dividedBy(tokenA_supply);

    return {
        tokenAexchangeRate,
        tokenBexchangeRate,
    };
};


export const calculateTokensOutTezCtez =(
    tezSupply: BigNumber,
    ctezSupply: BigNumber,
    tokenIn_amount: BigNumber,
    pair_fee_denom: BigNumber,
    slippage: BigNumber,
    target: BigNumber,
    tokenIn: string,
): { tokenOut: BigNumber, fee: BigNumber, minimumOut: BigNumber, exchangeRate: BigNumber, priceImpact: BigNumber, error?: any } => {
    tokenIn_amount = tokenIn_amount.multipliedBy(10 ** 6);
    try {
        if (tokenIn === 'ctez') {
            const dy =
                newton_dx_to_dy(target.multipliedBy(ctezSupply), tezSupply.multipliedBy(2 ** 48), tokenIn_amount.multipliedBy(target), 5).dividedBy(2 ** 48);
            let fee = dy.dividedBy(pair_fee_denom);
            let tokenOut = dy.minus(fee);
            let minimumOut = tokenOut.minus((slippage.multipliedBy(tokenOut)).dividedBy(100));
            minimumOut = minimumOut.dividedBy(10 ** 6);
            const exchangeRate = tokenOut.dividedBy(tokenIn_amount); // 1 tokenIn = x tokenOut

            const updated_Ctez_Supply = ctezSupply.plus(tokenIn_amount);
            const updated_Tez_Supply = tezSupply.minus(tokenOut);

            const next_dy =
                newton_dx_to_dy(
                    target.multipliedBy(updated_Ctez_Supply),
                    updated_Tez_Supply.multipliedBy(2 ** 48),
                    tokenIn_amount.multipliedBy(target),
                    5,
                ).dividedBy(2 ** 48);

            const next_fee = next_dy.dividedBy(pair_fee_denom);
            const next_tokenOut = next_dy.minus(next_fee);
            let priceImpact = (tokenOut.minus(next_tokenOut)).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
            tokenOut = tokenOut.dividedBy(10 ** 6);
            fee = fee.dividedBy(10 ** 6);

            return {
                tokenOut,
                fee,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        } else if (tokenIn === 'tez') {
            const dy =
                newton_dx_to_dy(tezSupply.multipliedBy(2 ** 48), target.multipliedBy(ctezSupply), tokenIn_amount.multipliedBy(2 ** 48), 5).dividedBy(target);
            let fee = dy.dividedBy(pair_fee_denom);
            let tokenOut = dy.minus(fee);
            let minimumOut = tokenOut.minus((slippage.multipliedBy(tokenOut)).dividedBy(100));
            minimumOut = minimumOut.dividedBy(10 ** 6);
            const exchangeRate = tokenOut.dividedBy(tokenIn_amount); // 1 tokenIn = x tokenOut

            const updated_Ctez_Supply = ctezSupply.minus(tokenOut);
            const updated_Tez_Supply = tezSupply.plus(tokenIn_amount);

            const next_dy =
                newton_dx_to_dy(
                    updated_Tez_Supply.multipliedBy(2 ** 48),
                    target.multipliedBy(updated_Ctez_Supply),
                    tokenIn_amount.multipliedBy(2 ** 48),
                    5,
                ).dividedBy(target);
            const next_fee = next_dy.dividedBy(pair_fee_denom);
            const next_tokenOut = next_dy.minus(next_fee);
            let priceImpact = (tokenOut.minus(next_tokenOut)).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
            tokenOut = tokenOut.dividedBy(10 ** 6);
            fee = fee.dividedBy(10 ** 6);
            return {
                tokenOut,
                fee,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        }
        return {
            tokenOut: new BigNumber(0),
            fee: new BigNumber(0),
            minimumOut: new BigNumber(0),
            exchangeRate: new BigNumber(0),
            priceImpact: new BigNumber(0),
        };
    } catch (error) {
        return {
            tokenOut: new BigNumber(0),
            fee: new BigNumber(0),
            minimumOut: new BigNumber(0),
            exchangeRate: new BigNumber(0),
            priceImpact: new BigNumber(0),
            error,
        };
    }
};

export const loadSwapDataTezCtez = async (tokenIn : string, tokenOut : string) : Promise<{success: boolean,
    tezPool : BigNumber,
    ctezPool : BigNumber,
    tokenIn : string,
    tokenOut : string,
    exchangeFee : BigNumber,
    lpTokenSupply : BigNumber,
    lpToken : any,
    dexContractInstance : any,
    target : BigNumber}> => {
    try {
      const AMM = useAppSelector((state) => state.config.AMMs);
      const dexContractAddress = getDexAddress(tokenIn, tokenOut);
      if (dexContractAddress === 'false') {
          throw 'No dex found';
      }
      const dexContractInstance = await Tezos.contract.at(dexContractAddress);
      const dexStorage : any = await dexContractInstance.storage();
      const tezPool : BigNumber = new BigNumber(await dexStorage.tezPool);
      const ctezPool : BigNumber = new BigNumber(await dexStorage.ctezPool);
      const lpTokenSupply : BigNumber = new BigNumber(await dexStorage.lqtTotal);
      const lpFee = await dexStorage.lpFee;
      const exchangeFee = new BigNumber(lpFee);
      const lpToken = AMM[dexContractAddress].lpToken;
      const ctezAddress = CONFIG.CTEZ[connectedNetwork];
      const ctezStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/${ctezAddress}/storage`;
      const ctezStorage = await axios.get(ctezStorageUrl);
      const target = ctezStorage.data.args[2].int;
      
      return {
        success: true,
        tezPool,
        ctezPool,
        tokenIn,
        tokenOut,
        exchangeFee,
        lpTokenSupply,
        lpToken,
        dexContractInstance,
        target,
      };
    } catch (error) {
      console.log({ message: 'Tez-Ctez swap data error', error });
      return {
        success: false,
        tezPool : new BigNumber(0),
        ctezPool : new BigNumber(0),
        tokenIn,
        tokenOut,
        exchangeFee : new BigNumber(0),
        lpTokenSupply : new BigNumber(0),
        lpToken : null,
        dexContractInstance : null,
        target : new BigNumber(0),
      };
    }
  };



/**
 * Returns tokensOut from the given amountIn and pool values.
 * @param tokenIn_supply - Pool value of tokenIn
 * @param tokenOut_supply - Pool value of tokenOut
 * @param tokenIn_amount - Amount of tokenIn
 * @param pair_fee_denom - Denominator of pair fee (Ex: for 0.5% pass 2000)
 * @param slippage - Slippage which the user can tolerate in percentage
 * @param target- Target price of the pair in bitwise right 48
 * @param tokenIn- TokenIn
 */
export const calculateTokensOutGeneralStable =  (
    tokenIn_supply: BigNumber,
    tokenOut_supply: BigNumber,
    tokenIn_amount: BigNumber,
    Exchangefee: BigNumber,
    slippage: BigNumber,
    tokenIn: string,
    tokenOut: string,
    tokenIn_precision: BigNumber,
    tokenOut_precision: BigNumber,
): {
    tokenOut_amount: BigNumber,
    fees: BigNumber,
    minimum_Out: BigNumber,
    exchangeRate: BigNumber,
    priceImpact: BigNumber,
    error?: any
} => {
    const TOKEN = useAppSelector((state) => state.config.standard);
    tokenIn_amount = tokenIn_amount.multipliedBy(10 ** TOKEN[tokenIn].decimals);
    try {
        tokenIn_supply = tokenIn_supply.multipliedBy(tokenIn_precision);
        tokenOut_supply = tokenOut_supply.multipliedBy(tokenOut_precision);

        const dy = newton_dx_to_dy(
            tokenIn_supply,
            tokenOut_supply,
            tokenIn_amount.multipliedBy(tokenIn_precision),
            5,
        );
        let fee = dy.dividedBy(Exchangefee);
        let tokenOut_amt = (dy.minus(fee)).dividedBy(tokenOut_precision);
        let minimumOut = tokenOut_amt.minus((slippage.multipliedBy(tokenOut_amt)).dividedBy(100));
        minimumOut = minimumOut.dividedBy(10 ** TOKEN[tokenOut].decimals);

        const updated_tokenIn_pool = tokenIn_supply.plus(tokenIn_amount);
        const updated_tokenOut_pool = tokenOut_supply.minus(tokenOut_amt);

        const next_dy = newton_dx_to_dy(
            updated_tokenIn_pool,
            updated_tokenOut_pool,
            tokenIn_amount.multipliedBy(tokenIn_precision),
            5,
        );
        const next_fee = next_dy.dividedBy(Exchangefee);
        const next_tokenOut = (next_dy.minus(next_fee)).dividedBy(tokenOut_precision);
        let priceImpact = (tokenOut_amt.minus(next_tokenOut)).dividedBy(tokenOut_amt);
        priceImpact = priceImpact.multipliedBy(100);
        priceImpact = new BigNumber(Math.abs(Number(priceImpact)));
        tokenOut_amt = tokenOut_amt.dividedBy(10 ** TOKEN[tokenOut].decimals);
        fee = fee.dividedBy(tokenOut_precision);
        fee = fee.dividedBy((10 ** TOKEN[tokenOut].decimals));
        const tokenOut_amount = tokenOut_amt;
        const minimum_Out = minimumOut;
        const fees = fee;
        const exchangeRate = (tokenOut_amount).dividedBy((tokenIn_amount.dividedBy(10 ** TOKEN[tokenIn].decimals)));

        console.log(tokenOut_amount.toNumber(),
            fees.toString(),
            minimum_Out.toString(),
            exchangeRate.toString(),
            priceImpact.toString(),);
        return {
            tokenOut_amount,
            fees,
            minimum_Out,
            exchangeRate,
            priceImpact,
        };
    } catch (error) {
        return {
            tokenOut_amount: new BigNumber(0),
            fees: new BigNumber(0),
            minimum_Out: new BigNumber(0),
            exchangeRate: new BigNumber(0),
            priceImpact: new BigNumber(0),
            error,
        };
    }
};

export const loadSwapDataGeneralStable = async (tokenIn: string, tokenOut: string) : Promise<{
    success: boolean,
    tokenIn : string,
    tokenIn_supply : BigNumber,
    tokenOut: string,
    tokenOut_supply : BigNumber ,
    exchangeFee : BigNumber,
    tokenOutPerTokenIn : BigNumber,
    lpTokenSupply: BigNumber,
    lpToken : any,
    tokenIn_precision : BigNumber,
    tokenOut_precision : BigNumber ,
    dexContractInstance: any,}> => {
    try {

        const TOKEN = useAppSelector((state) => state.config.standard);
        const AMM = useAppSelector((state) => state.config.AMMs);
        const dexContractAddress = getDexAddress(tokenIn, tokenOut);
        if (dexContractAddress === 'false') {
            throw 'No dex found';
        }

        const dexContractInstance = await Tezos.contract.at(dexContractAddress);
        const dexStorage: any = await dexContractInstance.storage();
        const token1_pool = new BigNumber(await dexStorage.token1Pool);
        // GET PRECISION FROM CONFIG
        const token1_precision = new BigNumber(await dexStorage.token1Precision);

        const token2_pool = new BigNumber(await dexStorage.token2Pool);
        const token2_precision = new BigNumber(await dexStorage.token2Precision);

        let tokenIn_supply = new BigNumber(0);
        let tokenOut_supply= new BigNumber(0);
        let tokenIn_precision= new BigNumber(0);
        let tokenOut_precision= new BigNumber(0);
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
        const lpFee = await dexStorage.lpFee;
        const exchangeFee = new BigNumber(lpFee);
        let lpTokenSupply = new BigNumber(await dexStorage.lqtTotal);
        const lpToken = AMM[dexContractAddress].lpToken;
        const lpTokenDecimal = lpToken.decimals;
        const tokenIn_Decimal = TOKEN[tokenIn].decimals;
        const tokenOut_Decimal = TOKEN[tokenOut].decimals;
        tokenIn_supply = tokenIn_supply?.dividedBy(Math.pow(10, tokenIn_Decimal));
        tokenOut_supply = tokenOut_supply?.dividedBy(Math.pow(10, tokenOut_Decimal));
        lpTokenSupply = lpTokenSupply.dividedBy(Math.pow(10, lpTokenDecimal));
        const tokenOutPerTokenIn = tokenOut_supply?.dividedBy(tokenIn_supply ?? 1);
        return {
            success: true,
            tokenIn,
            tokenIn_supply,
            tokenOut,
            tokenOut_supply,
            exchangeFee,
            tokenOutPerTokenIn,
            lpTokenSupply,
            lpToken,
            tokenIn_precision,
            tokenOut_precision,
            dexContractInstance,
        };
    } catch (error) {
        console.log({ message: 'Stableswap data error', error });
        return {
            success: false,
            tokenIn,
            tokenIn_supply : new BigNumber(0),
            tokenOut,
            tokenOut_supply : new BigNumber(0),
            exchangeFee : new BigNumber(0),
            tokenOutPerTokenIn : new BigNumber(0),
            lpTokenSupply: new BigNumber(0),
            lpToken : null,
            tokenIn_precision : new BigNumber(0),
            tokenOut_precision : new BigNumber(0),
            dexContractInstance : null
        };
    }
};

