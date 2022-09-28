import React, { useRef, useState } from 'react';
import { isMobile,isTablet } from 'react-device-detect';
import { NotificationBar } from '../Notification';
import BottomNavigationBar from './BottomNavBar';
import { SideBar } from './Sidebar';
import { TopNavBar } from './TopNavBar';
import { TopNavBarMobile } from './TopNavBarMobile';

export interface ISideBarHOCProps {
  children: any;
  makeTopBarScroll?:boolean
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
          <div className="mt-0 lg:ml-[240px] md:w-[calc(100%_-_240px)] w-full mb-12 md:static absolute h-[calc(100%_-_121px)] md:mb-0">
            <div className={`overflow-x-hidden h-screen   z-0  ${props.makeTopBarScroll || true?'static overflow-y-auto pt-[64px]':'md:absolute fixed overflow-y-hidden top-16 !m-0  h-[calc(100%_-_121px)] md:h-[calc(100%_-_64px)] md:w-[calc(100%_-_240px)] w-full'}`}>
              {props.children}
            </div>
          </div>
        </div>
       {(isMobile || isTablet) &&<BottomNavigationBar />}
       {(isMobile || isTablet) && <TopNavBarMobile setShowNotification={showNotificationClick} />}
      </div>
    </>
  );
}
