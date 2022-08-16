import * as React from 'react';
import { useAppSelector } from '../../redux';

export interface IOutlineBtnProps {
  text:string;
  onClick:Function;
  className?:string
}

export function OutlineBtn (props: IOutlineBtnProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);

  return (
    <button onClick={()=>props.onClick()} className={`bg-outineBtn hover:bg-opacity-95 py-3 px-4 border rounded-2xl hover:bg-outineBtnHover border-primary-400 ${props.className}`}>
      {props.text}
    </button>
  );
}
