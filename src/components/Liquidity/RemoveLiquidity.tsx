import clsx from 'clsx';
import Image from 'next/image';
import { BigNumber } from 'bignumber.js';
import wallet from '../../../src/assets/icon/pools/wallet.svg';
import { ISwapData, tokenParameterLiquidity } from './types';
import { getOutputTokensAmount } from '../../api/liquidity';
import { useAppSelector } from '../../redux';

interface IRemoveLiquidityProps {
  swapData: ISwapData;
  pnlpBalance: string;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setBurnAmount: React.Dispatch<React.SetStateAction<string | number>>;
  burnAmount: string | number;
  setRemoveTokenAmount: React.Dispatch<
    React.SetStateAction<{
      tokenOneAmount: string;
      tokenTwoAmount: string;
    }>
  >;
  removeTokenAmount: {
    tokenOneAmount: string;
    tokenTwoAmount: string;
  };

  slippage: string | number;
  lpTokenPrice: BigNumber;
}
function RemoveLiquidity(props: IRemoveLiquidityProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const handleInputPercentage = (value: number) => {
    props.setBurnAmount(value * Number(props.pnlpBalance));
    handleRemoveLiquidityInput(value * Number(props.pnlpBalance));
  };
  const handleRemoveLiquidityInput = async (input: string | number) => {
    props.setBurnAmount(input);

    if (input === '' || isNaN(Number(input))) {
      props.setBurnAmount('');
      props.setRemoveTokenAmount({
        tokenOneAmount: '',
        tokenTwoAmount: '',
      });
      return;
    } else {
      const res = getOutputTokensAmount(
        input.toString(),
        props.tokenIn.symbol,
        props.tokenOut.symbol,
        props.swapData.tokenInSupply as BigNumber,
        props.swapData.tokenOutSupply as BigNumber,
        props.swapData.lpTokenSupply,
        props.slippage.toString()
      );
      props.setRemoveTokenAmount({
        tokenOneAmount: res.tokenOneAmount,
        tokenTwoAmount: res.tokenTwoAmount,
      });
    }
  };
  return (
    <>
      <div className="flex items-end mt-[10px]">
        <div className="font-body4 ml-2 text-text-500">
          How much PNLP to remove?{' '}
        </div>
        <div className="ml-auto flex">
          <p
            className="cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex"
            onClick={() => handleInputPercentage(0.25)}
          >
            25%
          </p>
          <p
            className="cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex"
            onClick={() => handleInputPercentage(0.5)}
          >
            50%
          </p>
          <p
            className="cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex"
            onClick={() => handleInputPercentage(0.75)}
          >
            75%
          </p>
        </div>
      </div>
      <div className="border pl-4 pr-5 mt-[10px] items-center flex border-text-800/[0.5] rounded-2xl h-[86px]">
        <div className="w-[50%]">
          <p>
            <input
              type="text"
              className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
              placeholder="0.0"
              value={props.burnAmount}
              onChange={(e) => handleRemoveLiquidityInput(e.target.value)}
            />
          </p>
          <p>
            <span className="mt-2 ml-1 font-body4 text-text-400">
              ~$
              {props.lpTokenPrice
                ? Number(
                    Number(props.burnAmount) * Number(props.lpTokenPrice)
                  ).toFixed(2)
                : '0.00'}
            </span>
          </p>
        </div>
        {walletAddress && (
          <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image src={wallet} width={'32px'} height={'32px'} />
            </div>
            <div className="ml-1 text-primary-500 font-body2">
              {Number(props.pnlpBalance).toFixed(4)} PNLP
            </div>
          </div>
        )}
      </div>

      <div className="border mt-3 flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] ">
          <div className="ml-5 font-body4 text-white">You will receive</div>
        </div>
        <div className="px-5 w-[100%]  items-center  flex ">
          <div className="border border-text-800/[0.5] flex  items-center rounded-2xl w-[166px] pl-[10px] h-[66px] bg-cardBackGround">
            <div>
              <Image src={props.tokenIn.image} width={'34px'} height={'34px'} />
            </div>
            <div className="ml-2.5">
              <p>
                {props.removeTokenAmount.tokenOneAmount
                  ? props.removeTokenAmount.tokenOneAmount
                  : '--'}
              </p>
              <p>
                <span className="mt-2  font-body4 text-text-400">
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}
                </span>
              </p>
            </div>
          </div>
          <div className="border border-text-800/[0.5] ml-3 flex  items-center rounded-2xl w-[166px] pl-[10px] h-[66px] bg-cardBackGround">
            <div>
              <Image
                src={props.tokenOut.image}
                width={'34px'}
                height={'34px'}
              />
            </div>
            <div className="ml-2.5">
              <p>
                {props.removeTokenAmount.tokenTwoAmount
                  ? props.removeTokenAmount.tokenTwoAmount
                  : '--'}
              </p>
              <p>
                <span className="mt-2  font-body4 text-text-400">
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RemoveLiquidity;
