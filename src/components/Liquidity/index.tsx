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
import { useLocationStateInLiquidity } from '../../hooks/useLocationStateInLiquidity';
import { store, useAppSelector } from '../../redux';
import { getUserBalanceByRpc } from '../../api/util/balance';
import { loadSwapDataWrapper } from '../../api/swap/wrappers';
import { ISwapData, tokenParameterLiquidity } from './types';
import { getDexType } from '../../api/util/fetchConfig';
import { AMM_TYPE } from '../../config/types';
import {
  FIRST_TOKEN_AMOUNT_LIQ,
  PNLP_ADD,
  SECOND_TOKEN_AMOUNT_LIQ,
  SHARE_OF_POOL,
  TOKEN_A_LIQ,
  TOKEN_B_LIQ,
} from '../../constants/localStorage';
import {
  getPnlpOutputEstimate,
  getPoolShareForPnlp,
} from '../../api/liquidity';

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
}
function Liquidity(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);
  const [slippage, setSlippage] = useState(0.5);

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
              {slippage}%
            </span>
          </div>
          <TransactionSettingsLiquidity
            show={settingsShow}
            setSlippage={setSlippage}
            slippage={slippage}
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
          <RemoveLiquidity />
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
