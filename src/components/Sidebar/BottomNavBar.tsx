import * as React from 'react';

export interface IBottomNavigationBarProps {
}

export interface IBottomNavMenuProps {
    onClick?:Function,
    active?:boolean,
    className?:string,
}
export interface ISubMenuProps {
}
export interface ISubMenuListProps {
}
export default function BottomNavigationBar (props: IBottomNavigationBarProps) {
    const [activeSubMenu,setActiveSubMenu]=React.useState(0);
  return (
    <div className='mobile fixed bottom-0  w-screen p-0 '>
   {activeSubMenu===1 && <SubMenuList/>}
    <div className='justify-between flex w-screen' >
    <BottomNavMenu 
    onClick={()=>setActiveSubMenu(1)}
    active={activeSubMenu===1}
    />
    <BottomNavMenu onClick={()=>setActiveSubMenu(0)} />
    <BottomNavMenu onClick={()=>setActiveSubMenu(0)}/>
    <BottomNavMenu onClick={()=>setActiveSubMenu(0)}/> 
    <BottoMoreNavMenu onClick={()=>setActiveSubMenu(0)}/> 
    </div>
    </div>
  );
}



export function BottomNavMenu (props: IBottomNavMenuProps) {
  return (
    <div onClick={props.onClick?()=>{props.onClick && props.onClick()}:()=>{}} className={`${props.active?'bg-sideBarHover border-t-primary-500':'border-t-navBarBorder'} ${props.className} border-t-[1.5px] text-f10 flex-1 flex flex-col items-center text-center gap-2  p-5  hover:bg-sideBarHover hover:border-t-primary-500 `}>
      <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.6411 4.7042C13.6411 4.48138 13.5526 4.26768 13.395 4.11012C13.2375 3.95256 13.0238 3.86405 12.801 3.86405H3.06359L4.99594 1.9401C5.15415 1.78189 5.24302 1.56732 5.24302 1.34359C5.24302 1.11986 5.15415 0.905286 4.99594 0.747082C4.83774 0.588878 4.62317 0.5 4.39943 0.5C4.1757 0.5 3.96113 0.588878 3.80293 0.747082L0.442316 4.10769C0.325738 4.22584 0.246767 4.37587 0.215367 4.53885C0.183967 4.70183 0.201545 4.87046 0.265884 5.02346C0.328912 5.17689 0.435946 5.30822 0.573496 5.40092C0.711046 5.49362 0.872957 5.54352 1.03882 5.54435H12.801C13.0238 5.54435 13.2375 5.45584 13.395 5.29828C13.5526 5.14072 13.6411 4.92702 13.6411 4.7042ZM16.9345 7.74555C16.8715 7.59212 16.7644 7.46079 16.6269 7.36809C16.4893 7.27539 16.3274 7.22549 16.1616 7.22466H4.39943C4.17661 7.22466 3.96292 7.31317 3.80536 7.47073C3.6478 7.62829 3.55928 7.84199 3.55928 8.06481C3.55928 8.28763 3.6478 8.50133 3.80536 8.65889C3.96292 8.81645 4.17661 8.90496 4.39943 8.90496H14.1368L12.2044 10.8289C12.1257 10.907 12.0632 10.9999 12.0205 11.1023C11.9779 11.2047 11.9559 11.3145 11.9559 11.4254C11.9559 11.5363 11.9779 11.6461 12.0205 11.7485C12.0632 11.8509 12.1257 11.9438 12.2044 12.0219C12.2826 12.1007 12.3755 12.1632 12.4779 12.2058C12.5802 12.2485 12.69 12.2704 12.801 12.2704C12.9119 12.2704 13.0217 12.2485 13.1241 12.2058C13.2264 12.1632 13.3194 12.1007 13.3975 12.0219L16.7581 8.66132C16.8747 8.54317 16.9536 8.39314 16.985 8.23016C17.0164 8.06718 16.9988 7.89855 16.9345 7.74555Z" fill="white"/>
        </svg>
        <p>
            Swap
        </p>

    </div>
  );
}
export function BottoMoreNavMenu (props: IBottomNavMenuProps) {
    return (
      <div className='border-t-[1.5px] text-f10 flex-1 flex flex-col justify-center items-center text-center gap-2 border-t-navBarBorder p-5  hover:bg-sideBarHover hover:border-t-primary-500 '>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_4328_25645)">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 10.5C8 9.39543 8.89543 8.5 10 8.5C11.1046 8.5 12 9.39543 12 10.5C12 11.6046 11.1046 12.5 10 12.5C8.89543 12.5 8 11.6046 8 10.5Z" fill="#9D99A1"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15 10.5C15 9.39543 15.8954 8.5 17 8.5C18.1046 8.5 19 9.39543 19 10.5C19 11.6046 18.1046 12.5 17 12.5C15.8954 12.5 15 11.6046 15 10.5Z" fill="#9D99A1"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M1 10.5C1 9.39543 1.89543 8.5 3 8.5C4.10457 8.5 5 9.39543 5 10.5C5 11.6046 4.10457 12.5 3 12.5C1.89543 12.5 1 11.6046 1 10.5Z" fill="#9D99A1"/>
            </g>
            <defs>
            <clipPath id="clip0_4328_25645">
            <rect width="20" height="20" fill="white"/>
            </clipPath>
            </defs>
            </svg>
      </div>
    );
  }
export function BottomSubMenu (props: ISubMenuProps) {
  return (
    <div className='py-5 px-6 border-t border-t-navBarBorder hover:bg-sideBarHover hover:border-t-primary-500'>
          Swap
    </div>
  );
}

export function SubMenuList (props: ISubMenuListProps) {
  return (
    <div className='w-screen flex flex-col text-f12 '>
        <BottomSubMenu/>
        <BottomSubMenu/>
        <BottomSubMenu/>

    </div>
  );
}

