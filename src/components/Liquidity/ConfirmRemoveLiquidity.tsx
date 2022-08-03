import clsx from 'clsx';
import Image from 'next/image';
import arrowLeft from '../../../src/assets/icon/pools/arrowLeft.svg';
import info from '../../../src/assets/icon/common/infoIcon.svg';
import ctez from '../../../src/assets/Tokens/ctez.png';
import add from '../../../src/assets/icon/pools/addIcon.svg';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';
import { tokenParameterLiquidity } from './types';

interface IConfirmRemoveLiquidityProps {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;

  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;
  handleRemoveLiquidityOperation: () => void;
  burnAmount: string | number;
  removeTokenAmount: {
    tokenOneAmount: string;
    tokenTwoAmount: string;
  };
}
function ConfirmRemoveLiquidity(props: IConfirmRemoveLiquidityProps) {
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen('1')}>
          <Image src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">
          Confirm Remove liquidity{' '}
        </div>
        <div className="relative top-[2px]">
          <Image src={info} />
        </div>
      </div>
      <div className="mt-5 text-text-500 font-body4">
        Output is estimated. If the price changes by more than 0.5% your
        transaction will revert
      </div>
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5">
        <p className="text-text-250 font-body4 px-5">Your removing</p>
        <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <Image src={props.tokenIn.image} width={'24px'} height={'24px'} />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {props.removeTokenAmount.tokenOneAmount}{' '}
              {props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.removeTokenAmount.tokenOneAmount) *
                Number(props.tokenPrice[props.tokenIn.name])
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
              <Image src={ctez} width={'24px'} height={'24px'} />
            </span>
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {props.removeTokenAmount.tokenTwoAmount}{' '}
              {props.tokenOut.name === 'tez'
                ? 'TEZ'
                : props.tokenOut.name === 'ctez'
                ? 'CTEZ'
                : props.tokenOut.name}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.removeTokenAmount.tokenTwoAmount) *
                Number(props.tokenPrice[props.tokenIn.name])
            ).toFixed(2)}
          </div>
        </div>
        <div className="mt-4 px-5 text-text-250 font-body4 ">
          You will receive (atleast)
        </div>
        <div className="mt-1 px-5 text-white font-title2 ">
          {props.burnAmount} PNLP
        </div>
        <div className="mt-5 border-t border-text-800/[0.5]"></div>
        <div className="px-5 mt-[18px] flex justify-between">
          <p className="text-text-250 font-body2">Share of pool</p>
          <p className="font-body4 text-white">
            {Number(props.sharePool).toFixed(6)}%{' '}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          color={'primary'}
          onClick={props.handleRemoveLiquidityOperation}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

export default ConfirmRemoveLiquidity;
