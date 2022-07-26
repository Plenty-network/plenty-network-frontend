import Image from 'next/image';
import * as React from 'react';
import { ConnectWalletBtnDeskTop } from '../Button/connectWalletDesktop';

export interface ITopNavBarProps {
  setShowNotification: Function;
}
export interface IIconBTNProps {
  isVerticalline: boolean;
  onClick?: Function;
}

export function IconBTN(props: IIconBTNProps) {
  return (
    <div
      className="flex items-center"
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <Image
        src={
          props.isVerticalline
            ? '/assets/icon/verticalline.svg'
            : '/assets/icon/bellicon.svg'
        }
        height={'26px'}
        width={'26px'}
      />
    </div>
  );
}

export function TopNavBar(props: ITopNavBarProps) {
  return (
    <nav className="hidden md:flex border-b border-b-borderColor w-screen fixed h-16 items-center shadow  justify-between px-10 topNavblurEffect z-50">
      <div>
        <Image
          src="/assets/icon/plentyIcon.svg"
          height={'22.47px'}
          width="100%"
        />
      </div>
      <div className="flex flex-row gap-7 ">
        <div className="flex flex-row gap-3.5 ">
          <IconBTN isVerticalline={false} onClick={props.setShowNotification} />
          <div className="my-1 flex items-center">
            <IconBTN isVerticalline={true} />
          </div>
          <IconBTN isVerticalline={false} />
        </div>
        <ConnectWalletBtnDeskTop  />
      </div>
    </nav>
  );
}
