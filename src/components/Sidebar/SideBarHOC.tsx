import React, { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { NotificationBar } from '../Notification';
import BottomNavigationBar from './BottomNavBar';
import { SideBar } from './Sidebar';
import { TopNavBar } from './TopNavBar';
import { TopNavBarMobile } from './TopNavBarMobile';

export interface ISideBarHOCProps {
  children: any;
}

export function SideBarHOC(props: ISideBarHOCProps) {
  const [showNotification, setShowNotification] = useState(false);
  const showNotificationClick = () => {
    setShowNotification(!showNotification);
  };
  const [showPopupModal, setShowPopupModal] = useState(false);
  const showPopupModalClick = () => {
    setShowPopupModal(!showPopupModal);
  };
  return (
    <>
      {/* <div className="cicle_animation">
        <div className="circle"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
      </div> */}
      <div className="flex flex-no-wrap flex-col">
        {!isMobile && <TopNavBar setShowNotification={showNotificationClick} />}   
        {showNotification && <NotificationBar  onhide={()=>{setShowNotification(false)}}/>}
        <div className="flex flex-no-wrap">
          {!isMobile && <SideBar />}
          <div className="mt-0 md:ml-[240px] md:w-[calc(100%_-_240px)] w-full mb-12 md:mb-0">
            <div className=" overflow-x-hidden h-screen  py-6 z-0 overflow-y-auto pt-[64px] md:pt-[64px]">
              {props.children}
            </div>
          </div>
        </div>
       {isMobile &&<BottomNavigationBar />}
       {isMobile && <TopNavBarMobile setShowNotification={showNotificationClick} />}
      </div>
    </>
  );
}
