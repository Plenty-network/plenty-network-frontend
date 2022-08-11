import React from 'react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { ImageCircle } from './Component/CircularImageInfo';
import token from '../../assets/Tokens/plenty.png';
import token2 from '../../assets/Tokens/ctez.png';
import Button from '../Button/Button';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { AppDispatch, store } from '../../redux';
import { useDispatch } from 'react-redux';
import { walletConnection } from '../../redux/wallet/wallet';

export interface IRewardsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  tokenInAmount: string;
  tokenOutAmount: string;
  rewardToken: string;
  handleOperation: () => void;
}
export function RewardsScreen(props: IRewardsProps) {
  const walletAddress = store.getState().wallet.address;
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const harvestButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={'primary'}>
          Connect Wallet
        </Button>
      );
    } else if (
      (walletAddress &&
        props.tokenInAmount &&
        props.tokenOutAmount &&
        Number(props.tokenInAmount) === 0) ||
      Number(props.tokenOutAmount) === 0
    ) {
      return (
        <Button onClick={() => null} color={'disabled'}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button color={'primary'} onClick={props.handleOperation}>
          Harvest Rewards
        </Button>
      );
    }
  }, [props]);
  function InnerTab(
    token: any,
    text: number,
    className: string,
    tokenName: string
  ) {
    return (
      <div className="flex gap-2 items-center">
        <ImageCircle src={token} className={className} />
        {!isNaN(text) ? (
          <div className="text-f14 text-white h-5 font-medium">{text}</div>
        ) : (
          <div className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></div>
        )}

        <div
          className={clsx(
            'text-f14 ml-px h-5 font-medium',
            tokenName === 'PLY' ? 'text-text-500' : 'text-white'
          )}
        >
          {tokenName}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
        <div className="text-text-400 text-f12">Your Deposits</div>

        <div className="flex flex-col">
          {InnerTab(
            props.tokenIn.image,
            Number(props.tokenInAmount),
            '',
            props.tokenIn.symbol
          )}
          {InnerTab(
            props.tokenOut.image,
            Number(props.tokenOutAmount),
            '-mt-1',
            props.tokenOut.symbol
          )}
        </div>
      </div>

      <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
        <div className="text-text-400 text-f12">Your Rewards</div>
        <div className="flex flex-col">
          {InnerTab(token, Number(props.rewardToken), '', 'PLY')}
        </div>
      </div>

      {harvestButton}
    </div>
  );
}
