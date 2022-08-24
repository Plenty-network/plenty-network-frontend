import * as React from 'react';
import { RangeSlider } from '../RangeSlider';

export interface IMyVotesProps {
}

export function MyVotes (props: IMyVotesProps) {
  return (
    <div className='flex'>
       <RangeSlider/>
    </div>
  );
}
