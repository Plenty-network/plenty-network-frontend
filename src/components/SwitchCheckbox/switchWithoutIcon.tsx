import * as React from 'react';
export interface ISwitchProps {
    name?:string;
}

export function Switch (props: ISwitchProps) {
  return (
    <div className='switchWithoutIcon'>
    <input type="checkbox" id="switch" /><label htmlFor="switch">{props.name?props.name:'toggle'}</label>
    </div>


  );
}
