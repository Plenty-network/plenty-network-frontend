import Image from 'next/image';
import * as React from 'react';
import epoachIcon from '../../assets/icon/common/epochTimeIcon.svg'
import { InfoIconToolTip } from '../Tooltip/InfoIconTooltip';
import vectorDown from '../../assets/icon/common/vector.svg'
import { useCountdown } from '../../hooks/useCountDown';

export interface IEpochProps {
}

export function Epoch (props: IEpochProps) {
  const [days, hours, minutes, seconds] =useCountdown(1661660842871);
  return (
    <div className='flex gap-[10px] p-[14px]'>
      <Image src={epoachIcon} />
      <div className='flex flex-col gap-[6px]'>
          <div className='flex gap-1'>
              <p className='text-text-250 text-f12'>Epoch <span className='text-white'>23</span></p>
              <InfoIconToolTip message='Epoch lipsum' />
          </div>
          <div className='flex gap-2 text-f12 text-white font-semibold cursor-pointer'>
             <span className='flex gap-2'>
                <span>{days} d</span>
                 :
                <span>{hours} h</span>
                 :
                <span>{minutes} m</span>
                 :
                <span>{seconds} s</span>
             </span>
             <Image className='rotate-180' src={vectorDown} />
          </div>
      </div>
    </div>
  );
}
