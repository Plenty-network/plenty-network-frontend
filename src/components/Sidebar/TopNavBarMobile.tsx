import Image from 'next/image';
import * as React from 'react';
import settingLogo from '../../assets/icon/common/settingLogo.svg';
import { ConnectWalletBtnMobile } from '../Button/ConnectWalletMobile';
import { NotificationIcon, NotiFicationType } from '../NotificationIcon';
import plentyIcon from "../../assets/icon/common/plentyIcon.svg";

export interface ITopNavBarMobileProps {
  setShowNotification: Function;
}

export function TopNavBarMobile(props: ITopNavBarMobileProps) {
  return (
    <div className='flex fixed w-screen bottomNavBarMobile px-5 h-[61px] justify-between border-b border-b-borderColor'>
         <Image src={plentyIcon} height={'22.47px'}  width='100%' />
      <div className='flex gap-3'>
      <NotificationIcon
              className="cursor-pointer hover:opacity-90"
              type={NotiFicationType.haveNotification}
              onClick={props.setShowNotification}
            />
      <ConnectWalletBtnMobile/>
      </div>
    </div>
  );
}
