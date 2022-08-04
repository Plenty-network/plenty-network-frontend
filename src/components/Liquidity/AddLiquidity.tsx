import clsx from 'clsx';
import Image from 'next/image';
import wallet from '../../../src/assets/icon/pools/wallet.svg';
import { BigNumber } from 'bignumber.js';
import add from '../../../src/assets/icon/pools/addIcon.svg';
import { ISwapData, tokenParameterLiquidity } from './types';
import { estimateOtherTokenAmount } from '../../api/liquidity';
import { getDexType } from '../../api/util/fetchConfig';
import { TokenType } from '../../config/types';

interface IAddLiquidityProps {
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: {
    [key: string]: string;
  };
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  swapData: ISwapData;
  tokenPrice: {
    [id: string]: number;
  };
}
function AddLiquidity(props: IAddLiquidityProps) {
  const handleLiquidityInput = async (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => {
    if (input === '' || isNaN(Number(input))) {
      props.setSecondTokenAmount('');
      props.setFirstTokenAmount('');
      return;
    } else if (tokenType === 'tokenIn') {
      props.setFirstTokenAmount(input);
      const res = estimateOtherTokenAmount(
        input.toString(),
        props.swapData.tokenInSupply as BigNumber,
        props.swapData.tokenOutSupply as BigNumber,
        props.tokenOut.symbol
      );
      props.setSecondTokenAmount(res.otherTokenAmount);
    } else if (tokenType === 'tokenOut') {
      props.setSecondTokenAmount(input);

      const res = estimateOtherTokenAmount(
        input.toString(),
        props.swapData.tokenOutSupply as BigNumber,
        props.swapData.tokenInSupply as BigNumber,
        props.tokenIn.symbol
      );
      props.setFirstTokenAmount(res.otherTokenAmount);
    }
  };
  return (
    <>
      <div className="border mt-[10px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-5">
            <Image src={props.tokenIn.image} width={'42px'} height={'42px'} />
          </div>
          <div className="ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-title2 text-white">
              {props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}
            </p>
          </div>
        </div>
        <div className="pl-[25px] w-[100%] pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-[50%]">
            <p>
              {props.swapData.isloading ? (
                <p className=" my-[4px] h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
                  value={props.firstTokenAmount}
                  placeholder="0.0"
                  onChange={(e) =>
                    handleLiquidityInput(e.target.value, 'tokenIn')
                  }
                />
              )}
            </p>
            <p>
              <span className="mt-2 ml-1 font-body4 text-text-400">
                {' '}
                ~$
                {props.firstTokenAmount && props.tokenPrice[props.tokenIn.name]
                  ? Number(
                      Number(props.firstTokenAmount) *
                        Number(props.tokenPrice[props.tokenIn.name])
                    ).toFixed(2)
                  : '0.00'}
              </span>
            </p>
          </div>
          <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image src={wallet} width={'32px'} height={'32px'} />
            </div>
            <div className="ml-1 text-primary-500 font-body2">
              {props.userBalances[props.tokenIn.name]}{' '}
              {props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}
            </div>
          </div>
        </div>
      </div>
      <div className="relative -top-[9px] left-[138.5px]">
        <Image src={add} width={'24px'} height={'24px'} />
      </div>
      <div className="border -mt-[25px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-5">
            <Image src={props.tokenOut.image} width={'42px'} height={'42px'} />
          </div>
          <div className="ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-title2 text-white">
              {props.tokenOut.name === 'tez'
                ? 'TEZ'
                : props.tokenOut.name === 'ctez'
                ? 'CTEZ'
                : props.tokenOut.name}
            </p>
          </div>
        </div>
        <div className="pl-[25px] w-[100%] pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-[50%]">
            <p>
              {props.swapData.isloading ? (
                <p className=" my-[4px] h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
                  value={props.secondTokenAmount}
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
                  placeholder="0.0"
                  onChange={(e) =>
                    handleLiquidityInput(e.target.value, 'tokenOut')
                  }
                />
              )}
            </p>
            <p>
              <span className="mt-2 ml-1 font-body4 text-text-400">
                ~$
                {props.secondTokenAmount &&
                props.tokenPrice[props.tokenOut.name]
                  ? Number(
                      Number(props.secondTokenAmount) *
                        Number(props.tokenPrice[props.tokenOut.name])
                    ).toFixed(2)
                  : '0.00'}
              </span>
            </p>
          </div>
          <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image src={wallet} width={'32px'} height={'32px'} />
            </div>
            <div className="ml-1 text-primary-500 font-body2">
              {props.userBalances[props.tokenOut.name]}{' '}
              {props.tokenOut.name === 'tez'
                ? 'TEZ'
                : props.tokenOut.name === 'ctez'
                ? 'CTEZ'
                : props.tokenOut.name}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddLiquidity;
