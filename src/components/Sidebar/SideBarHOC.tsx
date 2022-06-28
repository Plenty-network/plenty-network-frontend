import React from 'react';
import { SideBar } from './Sidebar';
import { TopNavBar } from './TopNavBar';

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
      <div className="flex flex-no-wrap">
      <SideBar/>
      <div className='mt-0 md:ml-[240px] md:w-[calc(100%_-_240px)] w-full'   >
        <div className=' overflow-x-hidden h-screen px-3 py-6 z-0 overflow-y-auto' style={{paddingTop:'64px'}}>
        {props.children}
        </div>
       
      </div>
    </div>
    </div>
    </>
  );
}
