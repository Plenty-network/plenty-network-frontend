import React from 'react';
import { SideBar } from './Sidebar';
import { TopNavBar } from './TopNavBar';

export interface ISideBarHOCProps {
    children: React.ReactNode
}

export function SideBarHOC (props: ISideBarHOCProps) {
  return (
    <div className="flex flex-no-wrap flex-col">
      <TopNavBar/>
      <div className="flex flex-no-wrap">
      <SideBar/>
      <div  style={{marginTop:'64px',marginLeft:'240px',width: 'calc(100% - 240px)'}} >
        <div className='overflow-y-auto overflow-x-hidden px-3 py-6 z-0'>
        {props.children}
        </div>
       
      </div>
    </div>
    </div>
  );
}
