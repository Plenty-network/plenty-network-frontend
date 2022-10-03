import * as React from 'react';
import { useAppSelector } from '../../redux';
import { getAllNotification } from './notificationMessageSave';
import { SingleNotification } from './SingleNotification';

export interface INotificationListProps {
}

export function NotificationList (props: INotificationListProps) {
    const walletAddress = useAppSelector((state) => state.wallet.address);
    const notificationList= getAllNotification(walletAddress);
  if(!notificationList.length){
      return (<div className='flex-1 flex flex-col p-5 justify-center items-center'>
      <div className='text-f14'>You’re all caught up</div>
      <div className='text-center text-f10 ' >This is where  you’ll see notifications about
        your Plenty transactions</div>
    </div>)
  }
  return (
    <div>
      {notificationList.map((e)=><SingleNotification key={e.currentTimeStamp} {...e} />)}
    </div>
  );
}
