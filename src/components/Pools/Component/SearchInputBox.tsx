import Image from 'next/image';
import * as React from 'react';
import searchImagr from '../../../assets/icon/common/searchIcon.svg'

export interface IInputSearchBoxProps {
    className?:string;
    value:string;
    onChange:Function;
}

export function InputSearchBox (props: IInputSearchBoxProps) {
  return (
    <div className={`flex py-2 my-2 px-2 bg-primary-850 mr-4 md:w-[265px] gap-4 border border-border-500/50 rounded-lg ${props.className}`}>
      <Image src={searchImagr} />
      <input 
      value={props.value}
      placeholder='Search' 
      className="text-white  text-left border-0 bg-primary-850 placeholder-text-600 font-medium2 text-f14 outline-none "
      onChange={(e)=>props.onChange(e.target.value)}/>
    </div>
  );
}
