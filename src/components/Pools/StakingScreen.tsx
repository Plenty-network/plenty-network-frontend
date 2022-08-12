import { ISimpleButtonProps, SimpleButton } from './Component/SimpleButton';
import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { SwitchWithIcon } from '../SwitchCheckbox/switchWithIcon';
import { InputText } from './Component/InputText';
import {
  BtnWithStakeIcon,
  BtnWithUnStakeIcon,
  BtnWithWalletIcon,
} from './Component/BtnWithWalletIcon';

import { BigNumber } from 'bignumber.js';
import Button from '../Button/Button';
import { CircularImageInfo } from './Component/CircularImageInfo';
import stake from '../../assets/icon/pools/stake.svg';
import token from '../../assets/Tokens/plenty.png';
import token2 from '../../assets/Tokens/ctez.png';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { Dropdown } from '../DropDown/Dropdown';
import { AppDispatch, store } from '../../redux';
import { useDispatch } from 'react-redux';
import { walletConnection } from '../../redux/wallet/wallet';

export enum StakingScreenType {
  Staking = 'Staking',
  Unstaking = 'Unstaking',
  ConfirmStake = 'ConfirmStake',
  ConfirmUnStake = 'ConfirmUnStake',
}
export interface IStakingScreenProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  stakingScreen: StakingScreenType;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  unStakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
  setStakingScreen: React.Dispatch<React.SetStateAction<StakingScreenType>>;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<string>>;
  selectedDropDown: string;
}
export interface IStakingProps {
  setStakingScreen: Function;
  stakingScreen: StakingScreenType;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<string>>;
  selectedDropDown: string;
}

export interface IUnstakingProps {
  setStakingScreen: Function;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  stakingScreen: StakingScreenType;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  unStakeInput: string | number;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
}
export function StakingScreen(props: IStakingScreenProps) {
  return (
    <>
      {props.stakingScreen === StakingScreenType.Staking && (
        <Staking
          setStakingScreen={props.setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          stakeInput={props.stakeInput}
          setStakeInput={props.setStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
          stakingScreen={props.stakingScreen}
          setSelectedDropDown={props.setSelectedDropDown}
          selectedDropDown={props.selectedDropDown}
        />
      )}
      {props.stakingScreen === StakingScreenType.Unstaking && (
        <Unstaking
          setStakingScreen={props.setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          unStakeInput={props.unStakeInput}
          setUnStakeInput={props.setUnStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
          stakingScreen={props.stakingScreen}
        />
      )}
    </>
  );
}

export function Staking(props: IStakingProps) {
  const walletAddress = store.getState().wallet.address;
  const handleInputPercentage = (value: number) => {
    props.setStakeInput(value * Number(props.pnlpBalance));
  };
  const handleStakeInput = async (input: string | number) => {
    if (input === '' || isNaN(Number(input))) {
      props.setStakeInput('');

      return;
    } else {
      props.setStakeInput(input);
    }
  };
  const onClickAmount = () => {
    handleStakeInput(props.pnlpBalance);
  };

  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const stakeButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={'primary'}>
          Connect Wallet
        </Button>
      );
    } else if (Number(props.stakeInput) <= 0) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Stake
        </Button>
      );
    } else if (
      walletAddress &&
      props.stakeInput &&
      Number(props.stakeInput) > Number(props.pnlpBalance)
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button
          color={'primary'}
          onClick={() => {
            props.setScreen('2');
          }}
        >
          Stake
        </Button>
      );
    }
  }, [props]);
  return (
    <div className="flex flex-col">
      <div className="border rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative ">
          <div className="flex gap-2 items-center">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                isChecked={false}
                onChange={() =>
                  props.setStakingScreen(StakingScreenType.Unstaking)
                }
              />
            </span>
            <p className="text-f16 text-white">Stake Liquidity</p>
          </div>
        </div>
        {/* dropDown And InfoTab */}
        <div className="flex py-2 px-2 md:px-4 justify-between">
          <Dropdown
            Options={['one', 'two', 'three']}
            selectedText={props.selectedDropDown}
            onClick={props.setSelectedDropDown}
          />
          <div className="font-mobile-f9 md:text-f12 text-text-400 ml-2 max-w-[300px] text-center">
            Based on how much vePLY a user owns, they may be able to receive up
            to 2.5x more PLY rewards.
          </div>
        </div>
        {/* End of dropDown info */}

        {/* Start Of text and btn */}
        <div className="flex justify-between items-center py-2 md:px-4">
          <div className="font-body2 md:font-body4  text-text-500">
            How much PNLP to stake?
          </div>
          <div className="ml-auto flex font-body2">
            <p
              className={clsx(
                'cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex',
                props.stakeInput === 0.25 * Number(props.pnlpBalance) &&
                  'border-primary-500 bg-primary-500/[0.20]'
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.25) })}
            >
              25%
            </p>
            <p
              className={clsx(
                'cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex',
                props.stakeInput === 0.5 * Number(props.pnlpBalance) &&
                  'border-primary-500 bg-primary-500/[0.20]'
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.5) })}
            >
              50%
            </p>
            <p
              className={clsx(
                'cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md: h-[32px] px-[8.5px] md:px-[13px] items-center flex',
                props.stakeInput === 0.75 * Number(props.pnlpBalance) &&
                  'border-primary-500 bg-primary-500/[0.20]'
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.75) })}
            >
              75%
            </p>
          </div>
        </div>
        {/* end of text and btn */}

        {/* Start of Wallet app section */}
        <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 rounded-2xl">
          <div className="w-[50%] flex flex-col py-3.5 px-4">
            <InputText value={props.stakeInput} onChange={handleStakeInput} />
            <div className="font-body2 md:font-body4 text-text-400">
              ~$
              {props.lpTokenPrice
                ? Number(
                    Number(props.stakeInput) * Number(props.lpTokenPrice)
                  ).toFixed(2)
                : '0.00'}
            </div>
          </div>
          {walletAddress && (
            <div className="pr-2 md:pr-5">
              <BtnWithWalletIcon
                text={`${Number(props.pnlpBalance).toFixed(4)} PNLP`}
                onClick={onClickAmount}
              />
            </div>
          )}
        </div>
        {/* end of Waller app section */}
      </div>
      {/* Button Stake */}
      {stakeButton}
      {/* end of Button Stake */}

      {/* start of notification panel */}

      <div className="border mt-4 rounded-2xl flex justify-between items-center pr-2 py-1.5 border-border-500 bg-card-300">
        <div className="flex gap-2 items-center pl-4">
          <CircularImageInfo
            imageArray={[props.tokenIn.image, props.tokenOut.image]}
          />
          <span className="text-f14 text-white ">
            {props.tokenIn.symbol} / {props.tokenOut.symbol}
          </span>
        </div>
        <BtnWithStakeIcon
          text={`${Number(props.stakedToken).toFixed(4)} PNLP`}
        />
      </div>

      {/* end of notification panel */}
    </div>
  );
}
export function Unstaking(props: IUnstakingProps) {
  const walletAddress = store.getState().wallet.address;
  const handleInputPercentage = (value: number) => {
    props.setUnStakeInput(value * Number(props.stakedToken));
  };
  const handleUnStakeInput = async (input: string | number) => {
    if (input === '' || isNaN(Number(input))) {
      props.setUnStakeInput('');

      return;
    } else {
      props.setUnStakeInput(input);
    }
  };
  const onClickAmount = () => {
    handleUnStakeInput(props.stakedToken);
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const UnstakeButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={'primary'}>
          Connect Wallet
        </Button>
      );
    } else if (Number(props.unStakeInput) <= 0) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Unstake
        </Button>
      );
    } else if (
      walletAddress &&
      props.unStakeInput &&
      Number(props.unStakeInput) > Number(props.stakedToken)
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button
          color={'primary'}
          onClick={() => {
            props.setScreen('3');
          }}
        >
          Unstake
        </Button>
      );
    }
  }, [props]);
  return (
    <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
      {/* staking UnStaking Switch */}
      <div className="flex items-center justify-between flex-row  relative">
        <div className="flex gap-2 items-center">
          <span className="relative ml-2 top-[3px]">
            <SwitchWithIcon
              isChecked={true}
              onChange={() => props.setStakingScreen(StakingScreenType.Staking)}
            />
          </span>
          <p className="text-f16 text-white">Unstake Liquidity</p>
        </div>
      </div>
      {/* end of switch */}

      {/* Start Of text and btn */}
      <div className="flex justify-between items-center py-2 md:px-4">
        <div className="font-body2 md:font-body4 text-text-500">
          How much PNLP to unstake?
        </div>
        <div className="ml-auto flex font-body2">
          <p
            className={clsx(
              'cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex',
              props.unStakeInput === 0.25 * Number(props.stakedToken) &&
                'border-primary-500 bg-primary-500/[0.20]'
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.25) })}
          >
            25%
          </p>
          <p
            className={clsx(
              'cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex',
              props.unStakeInput === 0.5 * Number(props.stakedToken) &&
                'border-primary-500 bg-primary-500/[0.20]'
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.5) })}
          >
            50%
          </p>
          <p
            className={clsx(
              'cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md: h-[32px] px-[8.5px] md:px-[13px] items-center flex',
              props.unStakeInput === 0.75 * Number(props.stakedToken) &&
                'border-primary-500 bg-primary-500/[0.20]'
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.75) })}
          >
            75%
          </p>
        </div>
      </div>
      {/* end of text and btn */}

      {/* Start of Wallet app section */}
      <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 mb-5 rounded-2xl">
        <div className="w-[50%] flex flex-col py-3.5 px-4">
          <InputText value={props.unStakeInput} onChange={handleUnStakeInput} />
          <div className="font-body2 md:font-body4 text-text-400">
            ~$
            {props.lpTokenPrice
              ? Number(
                  Number(props.unStakeInput) * Number(props.lpTokenPrice)
                ).toFixed(2)
              : '0.00'}
          </div>
        </div>
        {walletAddress && (
          <div className="pr-2 md:pr-5">
            <BtnWithUnStakeIcon
              text={`${Number(props.stakedToken).toFixed(4)} PNLP`}
              onClick={onClickAmount}
            />
          </div>
        )}
      </div>
      {/* end of Waller app section */}

      {UnstakeButton}
    </div>
  );
}
