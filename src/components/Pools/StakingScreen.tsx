import { ISimpleButtonProps, SimpleButton } from './Component/SimpleButton';
import React, { useState } from 'react';
import { SwitchWithIcon } from '../SwitchCheckbox/switchWithIcon';
import { InputText } from './Component/InputText';
import {
  BtnWithStakeIcon,
  BtnWithWalletIcon,
} from './Component/BtnWithWalletIcon';

import { BigNumber } from 'bignumber.js';
import Button from '../Button/Button';
import { CircularImageInfo } from './Component/CircularImageInfo';
import token from '../../assets/Tokens/plenty.png';
import token2 from '../../assets/Tokens/ctez.png';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { Dropdown } from '../DropDown/Dropdown';

export enum StakingScreenType {
  Staking = 'Staking',
  Unstaking = 'Unstaking',
  ConfirmStake = 'ConfirmStake',
  ConfirmUnStake = 'ConfirmUnStake',
}
export interface IStakingScreenProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  unStakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
}
export interface IStakingProps {
  setStakingScreen: Function;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
}

export interface IUnstakingProps {
  setStakingScreen: Function;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  unStakeInput: string | number;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
}
export function StakingScreen(props: IStakingScreenProps) {
  const [stakingScreen, setStakingScreen] = useState(StakingScreenType.Staking);

  return (
    <>
      {stakingScreen === StakingScreenType.Staking && (
        <Staking
          setStakingScreen={setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          stakeInput={props.stakeInput}
          setStakeInput={props.setStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
        />
      )}
      {stakingScreen === StakingScreenType.Unstaking && (
        <Unstaking
          setStakingScreen={setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          unStakeInput={props.unStakeInput}
          setUnStakeInput={props.setUnStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
        />
      )}
    </>
  );
}

export function Staking(props: IStakingProps) {
  const handleStakeInput = async (input: string | number) => {
    if (input === '' || isNaN(Number(input))) {
      props.setStakeInput('');

      return;
    } else {
      props.setStakeInput(input);
    }
  };
  const [selectedDropDown,setSelectedDropDown]=useState('');

  return (
    <div className="flex flex-col">
      <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
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
        <div className="flex py-2 px-4 justify-between">
          <Dropdown
           Options={['one','two','three']}
           selectedText={selectedDropDown}
           onClick={setSelectedDropDown}
          />
          <div className="text-f12 text-text-400 max-w-[300px] text-center">
            Based on how much vePLY a user owns, they may be able to receive up
            to 2.5x more PLY rewards.
          </div>
        </div>
        {/* End of dropDown info */}

        {/* Start Of text and btn */}
        <div className="flex justify-between items-end py-2 px-4">
          <div className="text-f14 text-text-500">How much PNLP to stake?</div>
          <div className="flex gap-2">
            <SimpleButton text="25%" />
            <SimpleButton text="35%" />
            <SimpleButton text="50%" />
          </div>
        </div>
        {/* end of text and btn */}

        {/* Start of Wallet app section */}
        <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 rounded-2xl">
          <div className="w-[50%] flex flex-col py-3.5 px-4">
            <InputText value={props.stakeInput} onChange={handleStakeInput} />
            <div className="font-body4 text-text-400">
              ~$
              {props.lpTokenPrice
                ? Number(
                    Number(props.stakeInput) * Number(props.lpTokenPrice)
                  ).toFixed(2)
                : '0.00'}
            </div>
          </div>
          <div className="pr-5">
            <BtnWithWalletIcon text={`${props.pnlpBalance} PNLP`} />
          </div>
        </div>
        {/* end of Waller app section */}
      </div>
      {/* Button Stake */}
      <Button
        color={'primary'}
        onClick={() => {
          props.setScreen('2');
        }}
      >
        Stake
      </Button>
      {/* end of Button Stake */}

      {/* start of notification panel */}

      <div className="border mt-4 rounded-2xl flex justify-between items-center pr-2 py-1.5 border-border-500 bg-card-300">
        <div className="flex gap-2 items-center pl-4">
          <CircularImageInfo
            imageArray={[props.tokenIn.image, props.tokenOut.image]}
          />
          <span className="text-f14 text-white uppercase">
            {props.tokenIn.symbol}/{props.tokenOut.symbol}
          </span>
        </div>
        <BtnWithStakeIcon text={`${props.stakedToken} PNLP`} />
      </div>

      {/* end of notification panel */}
    </div>
  );
}
export function Unstaking(props: IUnstakingProps) {
  const handleUnStakeInput = async (input: string | number) => {
    if (input === '' || isNaN(Number(input))) {
      props.setUnStakeInput('');

      return;
    } else {
      props.setUnStakeInput(input);
    }
  };
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
      <div className="flex justify-between items-end py-2 px-4">
        <div className="text-f14 text-text-500">How much PNLP to unstake?</div>
        <div className="flex gap-2">
          <SimpleButton text="25%" />
          <SimpleButton text="35%" />
          <SimpleButton text="50%" />
        </div>
      </div>
      {/* end of text and btn */}

      {/* Start of Wallet app section */}
      <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 mb-5 rounded-2xl">
        <div className="w-[50%] flex flex-col py-3.5 px-4">
          <InputText value={props.unStakeInput} onChange={handleUnStakeInput} />
          <div className="font-body4 text-text-400">
            ~$
            {props.lpTokenPrice
              ? Number(
                  Number(props.unStakeInput) * Number(props.lpTokenPrice)
                ).toFixed(2)
              : '0.00'}
          </div>
        </div>
        <div className="pr-5">
          <BtnWithWalletIcon text={`${props.stakedToken} PNLP`} />
        </div>
      </div>
      {/* end of Waller app section */}

      {/* Button Stake */}
      <Button
        color={'primary'}
        onClick={() => {
          props.setScreen('3');
        }}
      >
        Unstake
      </Button>
      {/* end of Button Stake */}
    </div>
  );
}
