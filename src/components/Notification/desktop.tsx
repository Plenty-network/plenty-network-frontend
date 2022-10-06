import * as React from 'react';
import { NotificationList } from './NotificationList';
import { removeAllNotification } from './notificationMessageSave';

export interface INotificationBarProps {
  onhide: Function;
}

export default function NotificationBar(props: INotificationBarProps) {
  const [isClose, setIsClose] = React.useState(false);
  const clickedInModal = (e: any) => {
    try {
      if (e.target.id === 'modal_outer') {
        closeModalFunction();
      }
    } catch (e) { }
  };
  const closeModalFunction = () => {
    setIsClose(true);
    setTimeout(() => {
      props.onhide && props.onhide();
    }, 300);
  }
  const clearNotification=()=>{
    removeAllNotification();
    closeModalFunction();
  }
  return (
    <div
      onClick={clickedInModal}
      id="modal_outer"
      className={`fixed z-50 w-screen h-screen   ${isClose ? 'fade-out-3' : 'fade-in-3'
        }`}>
      <div className='absolute top-[3.8rem] right-[14.6rem]'>
        <div className='   relative 
       w-[364px] 
       h-[544px] 
       bg-sideBar
       rounded-[4px]
       flex 
       flex-col
       max-w-[460px]
       '
        >
          <div className='absolute bg-popUpNotificationHeader z-10 rotate-45 w-8 h-8 right-[13px] -top-[2px]'>
              
          </div>
          <div className='bg-popUpNotificationHeader h-[44px] rounded-t-[4px] z-20 flex justify-between font-semibold items-center px-4 !py-[13px] text-f14'>
            <p>Notification</p>
            <p  onClick={clearNotification} className='cursor-pointer'>Clear</p>
          </div>
          {/*  */}
          <NotificationList/>
        </div>
      </div>
    </div>
  );
}
