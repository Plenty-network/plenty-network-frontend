import Image from "next/image";

export interface ISingleSideBarProps {
    name:string;
    iconName:string;
    pathName?:string;
    subMenu?:ISingleSideBarProps[] | false;
    className?:string;
    onClick?: () => void | Promise<void>;
    isMenuOpen?:boolean;
}

export function SingleSideBar (props: ISingleSideBarProps) {
  

  return (
    <div className={`flex flex-col ${props?.className}`} onClick={props.onClick} >
         <div className={`flex w-full justify-between py-3.5 px-6 text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-sideBarHover border-x-2 border border-transprent hover:border-r-primary-500 `} >

             <div className='flex gap-4'>
                <Image src={'/assets/icon/swap.svg'} height={'11.67px'} width={'16.66px'}  />
                <p>{props.name}</p>
             </div>
             {props.subMenu && props.subMenu.length &&
             <Image src={props.isMenuOpen?'/assets/icon/UpArrow.svg':'/assets/icon/DownArrow.svg'} height={'8px'} width={'11px'}  />
             }

             
    </div>
    {props.subMenu && props.isMenuOpen && props.subMenu.length && 
             
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
