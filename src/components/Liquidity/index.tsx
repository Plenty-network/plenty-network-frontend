import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';
import settings from '../../../src/assets/icon/swap/settings.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import TransactionSettingsLiquidity from '../TransactionSettings/TransactionSettingsLiq';
import { BigNumber } from 'bignumber.js';
import AddLiquidity from './AddLiquidity';
import Button from '../Button/Button';
import { SwitchWithIcon } from '../SwitchCheckbox/switchWithIcon';
import RemoveLiquidity from './RemoveLiquidity';
import { useAppSelector } from '../../redux';
import { ISwapData, tokenParameterLiquidity } from './types';

interface ILiquidityProps {
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  inputRef?: any;
  value?: string | '';
  onChange?: any;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: {
    [key: string]: string;
  };
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setIsAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  isAddLiquidity: boolean;
  swapData: ISwapData;
  pnlpBalance: string;
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
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
  slippage: string | number;
}
function Liquidity(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);

  const handleAddLiquidity = () => {
    props.setScreen('2');
  };
  const handleRemoveLiquidity = () => {
    props.setScreen('3');
  };

  return (
    <>
      <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative">
          <div className="flex">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                id="Addliquidity"
                isChecked={props.isAddLiquidity}
                onChange={() => props.setIsAddLiquidity(!props.isAddLiquidity)}
              />
            </span>
            <span className="ml-2 text-white font-title3 relative top-[12px]">
              {props.isAddLiquidity ? 'Add Liquidity' : 'Remove Liquidity'}
            </span>
          </div>
          <div
            ref={refSettingTab}
            className="py-1 ml-auto px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] ml-2"
            onClick={() => setSettingsShow(!settingsShow)}
          >
            <Image src={settings} height={'20px'} width={'20px'} />
            <span className="text-white font-body4 ml-0.5 relative -top-[3px]">
              {props.slippage}%
            </span>
          </div>
          <TransactionSettingsLiquidity
            show={settingsShow}
            setSlippage={props.setSlippage}
            slippage={Number(props.slippage)}
            setSettingsShow={setSettingsShow}
          />
        </div>
        {props.isAddLiquidity ? (
          <AddLiquidity
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            firstTokenAmount={props.firstTokenAmount}
            secondTokenAmount={props.secondTokenAmount}
            userBalances={props.userBalances}
            setSecondTokenAmount={props.setSecondTokenAmount}
            setFirstTokenAmount={props.setFirstTokenAmount}
            swapData={props.swapData}
            tokenPrice={tokenPrice}
          />
        ) : (
          <RemoveLiquidity
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            pnlpBalance={props.pnlpBalance}
            swapData={props.swapData}
            setBurnAmount={props.setBurnAmount}
            burnAmount={props.burnAmount}
            setRemoveTokenAmount={props.setRemoveTokenAmount}
            removeTokenAmount={props.removeTokenAmount}
            slippage={props.slippage}
          />
        )}
      </div>
      {props.isAddLiquidity ? (
        <div className="">
          <Button color={'primary'} onClick={handleAddLiquidity}>
            Add
          </Button>
        </div>
      ) : (
        <div className="">
          <Button color={'primary'} onClick={handleRemoveLiquidity}>
            Remove
          </Button>
        </div>
      )}
    </>
  );
}

export default Liquidity;
