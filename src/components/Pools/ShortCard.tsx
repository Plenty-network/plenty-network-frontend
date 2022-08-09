import * as React from 'react';
import { ShortCardHeader } from './ShortCardHeader';
import { ShortCardList } from './ShortCardList';

export interface IShortCardProps {
    className?:string;
}

export function ShortCard (props: IShortCardProps) {
  return (<>
     <div className={`w-full ${props.className}`}>
      <table className='w-full flex flex-col gap-3'>
        <thead>
      <ShortCardHeader/>
      </thead>
      <tbody className='w-full flex flex-col gap-1'>
      {Array(10).fill(1).map((_,i)=><ShortCardList className='slideFromTop' key={`poolslist${i}`}/>)}
      </tbody>
      </table>
     </div>
    </>);
}
