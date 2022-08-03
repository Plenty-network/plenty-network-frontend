import Image from 'next/image';
import * as React from 'react';
import settingLogo from '../../assets/icon/common/settingLogo.svg';
import { ConnectWalletBtnMobile } from '../Button/ConnectWalletMobile';

export interface ITopNavBarMobileProps {
  setShowNotification:Function,
}

export function TopNavBarMobile (props: ITopNavBarMobileProps) {
  return (
    <div className='mobile-flex  fixed w-screen bottomNavBarMobile px-5 py-5 justify-between border-b border-b-borderColor'>
         <Image src='/assets/icon/plentyIcon.svg' height={'22.47px'}  width='100%' />
      <div className='flex gap-3'>
      <Image src={settingLogo} width={'20px'} height={'20px'} />
      <ConnectWalletBtnMobile/>
      </div>
    </div>
  );
}
