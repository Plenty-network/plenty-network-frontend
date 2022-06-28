import React from 'react';
import BottomNavigationBar from './BottomNavBar';
import { SideBar } from './Sidebar';
import { TopNavBar } from './TopNavBar';
import { TopNavBarMobile } from './TopNavBarMobile';

export interface ISideBarHOCProps {
    children: React.ReactNode
}

export function SideBarHOC (props: ISideBarHOCProps) {
  return (
    <>
    <div className='cicle_animation'>
      <div className='circle1'></div>
      <div className='circle2'></div>
      <div className='circle2'></div>
    </div>
    <div className="flex flex-no-wrap flex-col">
      <TopNavBar/>
      <TopNavBarMobile/>
      <div className="flex flex-no-wrap">
      <SideBar/>
      <div className='mt-0 md:ml-[240px] md:w-[calc(100%_-_240px)] w-full'   >
        <div className=' overflow-x-hidden h-screen px-3 py-6 z-0 overflow-y-auto md:pt-[64px]' >
        {props.children}
        </div>
       
      </div>
    </div>
    <BottomNavigationBar/>
    </div>
    </>
  );
}
