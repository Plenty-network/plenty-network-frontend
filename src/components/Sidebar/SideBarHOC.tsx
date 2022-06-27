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
      <div  style={{marginTop:'0px',marginLeft:'240px',width: 'calc(100% - 240px)'}} >
        <div className=' overflow-x-hidden h-screen px-3 py-6 z-0 overflow-y-auto' style={{paddingTop:'64px'}}>
        {props.children}
        </div>
       
      </div>
    </div>
    </div>
    </>
  );
}
