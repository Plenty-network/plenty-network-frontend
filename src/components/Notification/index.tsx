import * as React from 'react';

export interface INotificationBarProps {
}

export function NotificationBar (props: INotificationBarProps) {
  return (
    <div className='fixed z-30 w-screen h-screen topNavblurEffect flex items-center justify-center '>
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
       '
       >
    <div className='bg-popUpNotificationHeader py-4 px-3'>Notification</div>
    <div className='flex-1 flex flex-col p-5 justify-center items-center'>
    <div className='text-f14'>You’re all caught up</div>
    <div className='text-center text-f10 border-b border-b-navBarBorder' >This is where  you’ll see notifications about
your Plenty transactions</div>
  <div className='text-primary-200 text-f10'>Swap your assets</div>
    </div>
      </div>
      <div className='flex justify-end '>
          <div className='pt-2 pr-2 cursor-pointer hover:opacity-90'>Clear All</div>
       </div>
     </div>
    </div>
  );
}
