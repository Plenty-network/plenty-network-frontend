import Image from 'next/image';
import * as React from 'react';

export interface ISideBarProps {
}

export interface ISingleSideBarProps {
    name:string;
    iconName:string;
    pathName?:string;
    subMenu?:ISingleSideBarProps[] | false;
    className?:string;
}

export function SingleSideBar (props: ISingleSideBarProps) {
  

  return (
    <div className={`flex flex-col ${props?.className}`} >
         <div className={`flex w-full justify-between py-3.5 px-6 text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-sideBarHover border-x-2 border border-transprent hover:border-r-primary-500 `} >

             <div className='flex gap-4'>
                <Image src={'/assets/icon/swap.svg'} height={'11.67px'} width={'16.66px'}  />
                <p>{props.name}</p>
             </div>
             {props.subMenu && props.subMenu.length &&
             <Image src={'/assets/icon/DownArrow.svg'} height={'8px'} width={'11px'}  />
             }

             
    </div>
    {props.subMenu && props.subMenu.length && 
             
             <div>
             {props.subMenu.map((submenuItem,index)=><SingleSideBar
              name={submenuItem.name}
              iconName={submenuItem.iconName}
              className='ml-4 border-l-2 border-muted-border'
              key={`submenu_${index}`}
              />)}
              
              </div>
              }
    </div>

  );
}


export interface IHrefIconProps {
   name:string;
   href:string;
   iconName:string;
}

export function HrefIcon (props: IHrefIconProps) {
  return (
    <div>
          <a 
          href={props.href}
          target='_blank'
          className="flex w-full justify-between py-3.5 px-6 text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-sideBarHover border-x-2 border border-transprent hover:border-r-primary-500" >
             <div className='flex gap-4'>
             <Image src={`/assets/icon/${props.iconName}.svg`} height={'11.67px'} width={'16.66px'}  />
             <p>{props.name}</p>
             </div>
             <Image src={'/assets/icon/HrefIcon.svg'} height={'11.67px'} width={'16.66px'}  />

          </a>
    </div>
  );
}

const FooterMenu:Array<IHrefIconProps>=[
    {
        name:'Analytic',
        iconName:'VectorfooterMenu',
        href:'https://google.com'
    },
    {
        name:'Docs',
        iconName:'VectorfooterMenu-1',
        href:'https://google.com'
    },
    {
        name:'Feedback',
        iconName:'VectorfooterMenu-2',
        href:'https://google.com'
    }
]

const MainMenu:Array<ISingleSideBarProps>=[
    {
        name:'swap',
        iconName:'swap',
        pathName:'./limk',
        subMenu:[
            {
                name:'swap',
                iconName:'swap',
                pathName:'./limk',
            },
            {
                name:'swap',
                iconName:'swap',
                pathName:'./limk',
            }
        ]
    },
    {
        name:'Earn',
        iconName:'swap',
        pathName:'./limk',
    }
]

export function SideBar (props: ISideBarProps) {
  return (
    
    <div className="fixed sm:relative text-f14 bg-sideBar shadow  " style={{height:'calc(100vh - 64px)',width: '240px',marginTop:'64px'}} >
                 <div className='flex-col justify-between h-full flex overflow-y-auto'>
                    <div className=" border-muted-border border-b-2 ">
                        {MainMenu.map((menuItem,index)=>
                        <SingleSideBar
                          name={menuItem.name}
                          iconName={menuItem.iconName}
                          key={`menuItem${index}`}
                          subMenu={menuItem.subMenu?menuItem.subMenu:false}
                        />)}
                    </div>
                    

                    <div >
                        <div className=" border-muted-border border-b-2 border-t-2">
                        {FooterMenu.map((e,i)=><HrefIcon
                          name={e.name}
                          href={e.href}
                          key={`footer_${i}`}
                          iconName={e.iconName}
                        />)}
                        </div>
                        <div className="px-8 border-t border-gray-700">
                        <ul className="w-full flex items-center justify-between bg-gray-800">
                            <li className="cursor-pointer text-white pt-5 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bell" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                                    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                                </svg>
                            </li>
                            <li className="cursor-pointer text-white pt-5 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-messages" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                                    <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                                </svg>
                            </li>
                            <li className="cursor-pointer text-white pt-5 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <circle cx={12} cy={12} r={3} />
                                </svg>
                            </li>
                            <li className="cursor-pointer text-white pt-5 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-archive" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <rect x={3} y={4} width={18} height={4} rx={2} />
                                    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
                                    <line x1={10} y1={12} x2={14} y2={12} />
                                </svg>
                            </li>
                        </ul>
                        </div>
                        
                    </div>
                </div>
                </div>
  );
}
