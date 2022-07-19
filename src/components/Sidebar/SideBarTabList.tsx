import Image from "next/image";
import Link from "next/link";

export interface ISingleSideBarProps {
    name:string;
    iconName?:string;
    pathName?:string;
    subMenu?:ISingleSideBarProps[] | false;
    className?:string;
    onClick?: () => void | Promise<void>;
    isMenuOpen?:boolean;
    isBottomMenu?:boolean;
}

export function SingleSideBar (props: ISingleSideBarProps) {
  if(props.pathName){
    return(
    <Link className={`flex flex-col ${props?.className}`} href={props.pathName}>
        <div className={`flex w-full justify-between py-3.5 ${!props.isBottomMenu?'px-6':''} text-gray-300 hover:text-gray-500 cursor-pointer items-center  ${!props.isBottomMenu?'hover:bg-sideBarHover':''} ${!props.isBottomMenu?'border-x-2':''} border border-transprent ${!props.isBottomMenu?'hover:border-r-primary-500':''}`} >
        <div className='flex gap-4'>
          {props.iconName && <Image src={`/assets/icon/${props.iconName}.svg`} height={'11.67px'} width={'16.66px'}  />}
          <p>{props.name}</p>
        </div>
        {props.subMenu && props.subMenu.length &&
        <Image src={props.isMenuOpen?'/assets/icon/UpArrow.svg':'/assets/icon/DownArrow.svg'} height={'8px'} width={'11px'}  />
        }
        </div>
    </Link>
    );
  }

  return (

    <div className={`flex flex-col ${props?.className}`} onClick={props.onClick} >
         <div className={`flex w-full justify-between py-3.5 ${!props.isBottomMenu?'px-6':''} text-gray-300 hover:text-gray-500 cursor-pointer items-center  ${!props.isBottomMenu?'hover:bg-sideBarHover':''} ${!props.isBottomMenu?'border-x-2':''} border border-transprent ${!props.isBottomMenu?'hover:border-r-primary-500':''}`} >

             <div className='flex gap-4'>
                {props.iconName && <Image src={`/assets/icon/${props.iconName}.svg`} height={'11.67px'} width={'16.66px'}  />}
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
              className='ml-8 border-l-2 border-borderColor'
              key={`submenu_${index}`}
              />)}
              
              </div>
              }
    </div>

  );
}
