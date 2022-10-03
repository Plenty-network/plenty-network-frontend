import * as React from 'react';
import { NotificationList } from './NotificationList';

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
  return (
    <div
      onClick={clickedInModal}
      id="modal_outer"
      className={`fixed z-50 w-screen h-screen topNavblurEffect flex items-center justify-center ${isClose ? 'fade-out-3' : 'fade-in-3'
        }`}>
      <div>
        <div className='broder   relative border-popUpNotification
       w-[calc(100vw_-_38px)] 
       h-[576px] 
       bg-sideBar
       bord
       rounded-md
       border
       flex 
       flex-col
       max-w-[460px]
       '
        >
          <div className='bg-popUpNotificationHeader py-4 px-3'>Notification</div>
          <NotificationList/>
        </div>
        <div className='flex justify-end '>
          <div className='pt-2 pr-2 cursor-pointer hover:opacity-90' onClick={closeModalFunction}>Clear All</div>
        </div>
      </div>
    </div>
  );
}
