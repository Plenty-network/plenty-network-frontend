import Image from 'next/image';
import * as React from 'react';
import walletNotConnected from '../../../assets/icon/pools/walletNotConnected.svg'
import noContentAvailble from '../../../assets/icon/pools/noContentAvailable.svg'

import { useAppDispatch } from '../../../redux';
import { walletConnection } from '../../../redux/wallet/wallet';
import { OutlineBtn } from '../../Button/OutlineButtonCommon';
export interface IWalletNotConnectedProps {
}

export function NoContentAvailable (props: IWalletNotConnectedProps) {
  return (<div className='flex justify-center items-center mt-2 gap-5 flex-col' >
       <Image src={noContentAvailble} />
       <OutlineBtn text='View Pools' className='w-max' onClick={()=>{}} />
      </div> );
}
export function  WalletNotConnected (props: IWalletNotConnectedProps) {
  const dispatch = useAppDispatch();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
    return (
      <div className='flex justify-center items-center mt-2 gap-5 flex-col' >
       <Image src={walletNotConnected} />
       <OutlineBtn text='Connect wallet' className='w-max' onClick={connectTempleWallet} />
      </div>
    );
  }