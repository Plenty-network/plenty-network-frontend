import * as React from 'react';

export interface IOutlineBtnProps {
}

export function OutlineBtn (props: IOutlineBtnProps) {
  return (
    <button className='bg-outineBtn hover:bg-opacity-95 py-3 px-4 border rounded-2xl hover:bg-outineBtnHover border-primary-400'>
      Connect wallet
    </button>
  );
}
