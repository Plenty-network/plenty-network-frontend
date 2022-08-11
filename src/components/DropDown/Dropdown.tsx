import Image from 'next/image';
import * as React from 'react';
import vectorIcon from '../../assets//icon/common/vector.svg'
import { useOutsideClick } from '../../utils/outSideClickHook';

export interface IDropdownProps {
    Options:Array<string>;
    onClick:Function;
    selectedText:string;
    className?:string  
}

export function Dropdown (props: IDropdownProps) {
    const [isDropDownActive,setIsDropDownActive]=React.useState(false);
    const reff=React.useRef(null)
     useOutsideClick(reff,()=>{setIsDropDownActive(false)});
  return (
    <div className={`relative min-w-[100px] md:min-w-[150px] ${props.className}`} ref={reff} >
      <div className='bg-background-100/25 cursor-pointer flex gap-4 py-2 px-3 justify-between border border-text-700 rounded-lg' onClick={()=> setIsDropDownActive(true) }>
        < p className='text-text-600 flex gap-1'>
            {(props.selectedText && props.selectedText.length)? <span>{props.selectedText}</span> :<><span className='hidden md:block' >Select</span> <span>No selection</span></>}
        </p>
        <Image src={vectorIcon} className={!isDropDownActive ? 'rotate-180' : 'rotate-0'} />
        
      </div>
      {isDropDownActive && <div className='absolute mt-2 w-full bg-card-500 border-border-500 border rounded-lg flex flex-col gap-1'>
        {props.Options.map((text,i)=>(
            <Options onClick={props.onClick} key={`${text}_${i}`} text={text}/>
        ))}
      </div>}
    </div>
  );

    function Options(props:{onClick:Function,text:string}) {
        return <div onClick={()=>{props.onClick(props.text); setIsDropDownActive(false)} } className='hover:bg-muted-500 px-2 py-3.5 cursor-pointer'>
            {props.text}
        </div>;
    }
}
