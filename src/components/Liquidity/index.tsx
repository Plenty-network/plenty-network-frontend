import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';
import settings from '../../../src/assets/icon/swap/settings.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import TransactionSettingsLiquidity from '../TransactionSettings/TransactionSettingsLiq';

import info from '../../../src/assets/icon/swap/info.svg';
import { BigNumber } from 'bignumber.js';
import AddLiquidity from './AddLiquidity';
import Button from '../Button/Button';
import { SwitchWithIcon } from '../SwitchCheckbox/switchWithIcon';
import RemoveLiquidity from './RemoveLiquidity';

import wallet from '../../../src/assets/icon/pools/wallet.svg';
import { AppDispatch, useAppSelector } from '../../redux';
import { ISwapData, tokenParameterLiquidity } from './types';
import { useDispatch } from 'react-redux';
import { walletConnection } from '../../redux/wallet/wallet';

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
  lpTokenPrice: BigNumber;

  isLoading: boolean;
}
function Liquidity(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);

  const handleAddLiquidity = () => {
    props.setScreen('2');
  };
  const handleRemoveLiquidity = () => {
    props.setScreen('3');
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const AddButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={'primary'}>
          Connect Wallet
        </Button>
      );
    } else if (
      Number(props.firstTokenAmount) <= 0 ||
      Number(props.secondTokenAmount) <= 0
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Add
        </Button>
      );
    } else if (
      walletAddress &&
      ((props.firstTokenAmount &&
        props.firstTokenAmount > props.userBalances[props.tokenIn.name]) ||
        (props.secondTokenAmount && props.secondTokenAmount) >
          props.userBalances[props.tokenOut.name])
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button color={'primary'} onClick={handleAddLiquidity}>
          Add
        </Button>
      );
    }
  }, [props]);
  const RemoveButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={'primary'}>
          Connect Wallet
        </Button>
      );
    } else if (Number(props.burnAmount) <= 0) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Remove
        </Button>
      );
    } else if (
      walletAddress &&
      props.burnAmount &&
      props.burnAmount > props.pnlpBalance
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button color={'primary'} onClick={handleRemoveLiquidity}>
          Remove
        </Button>
      );
    }
  }, [props]);

  return (
    <>
      <div className="border rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative">
          <div className="flex">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                id="Addliquidity"
                isChecked={!props.isAddLiquidity}
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
            <span className="text-white font-body4 ml-2 relative -top-[3px]">
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
            lpTokenPrice={props.lpTokenPrice}
          />
        )}
      </div>
      {props.isAddLiquidity ? (
        <div className="">{AddButton}</div>
      ) : (
        <div className="">{RemoveButton}</div>
      )}
      {!props.isAddLiquidity && (
        <div className="mt-4 border border-text-800 rounded-2xl bg-card-300 flex items-center h-[48px] pr-3 pl-5">
          {Number(props.pnlpBalance) > 0 ? (
            <>
              <div className="flex">
                <span>
                  <Image src={info} width={'14px'} height={'14px'} />
                </span>
                <span className="font-subtitle1 relative top-[1.5px] ml-2">
                  Your position
                </span>
              </div>

              <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] items-center flex px-3">
                <div>
                  <Image src={wallet} width={'32px'} height={'32px'} />
                </div>
                <div className="ml-1 text-primary-500 font-body2">
                  {Number(props.pnlpBalance).toFixed(4)} PNLP
                </div>
              </div>
            </>
          ) : (
            <div className="font-body2 text-white">No Liquidity positions</div>
          )}
        </div>
      )}
    </>
  );
}

export default Liquidity;
