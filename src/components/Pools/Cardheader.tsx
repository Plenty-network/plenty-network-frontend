import * as React from 'react';

export interface ICardHeaderProps {
    className?:string
}

export function CardHeader (props: ICardHeaderProps) {
  return (
    <div className={`${props.className} flex  items-center border-b border-b-borderCommon  bg-cardBackGround`}>
        <div className='w-[113px] text-f16 text-center py-4 border-b border-b-primary-500 text-white'>
           All
        </div>
        <div className='w-[113px] text-f16 text-center py-4 text-navBarMuted'>
           Stable
        </div>
        <div className='w-[113px] text-f16 text-center py-4 text-navBarMuted'>
        Volatile 
        </div>
        <div className='w-[113px] text-f16 text-center py-4 text-navBarMuted'>   
        My pools
        </div>
    </div>
  );
}
