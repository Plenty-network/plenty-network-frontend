import Image from 'next/image';
import * as React from 'react';
import { Range } from 'react-range';
import plus from '../../assets/icon/vote/plus.svg';
import minus from '../../assets/icon/vote/minus.svg'

export interface IRangeSliderProps {
}

export function RangeSlider (props: IRangeSliderProps) {
    const [sliderVal,setSliderVal]=React.useState( { values: [50] })
  return (
    <div className='flex items-center gap-[7.5px]'>
  <Image src={minus}  />      
  <Range
        step={0.1}
        min={0}
        max={100}
        values={sliderVal.values}
        onChange={(values) => setSliderVal({ values })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className='flex-1'
            style={{
                width:'96px',
                backgroundColor:'#D8DAEB'
            }}

          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className='bg-primary-500 h-1 w-2'
          />
        )}
      />
  <Image src={plus}  />
</div>
  );
}
