import Image from 'next/image';
import * as React from 'react';
import { Range,getTrackBackground } from 'react-range';
import plus from '../../assets/icon/vote/plus.svg';
import minus from '../../assets/icon/vote/minus.svg'

export interface IRangeSliderProps {
}

export function RangeSlider (props: IRangeSliderProps) {
    const [sliderVal,setSliderVal]=React.useState(50)
  return (
      <div className='flex gap-3'>
    <div className='flex items-center gap-[7.5px]'>
  <Image src={minus} className='cursor-pointer' onClick={()=>setSliderVal((oldValue)=> oldValue-10>0?(oldValue-10)%100:0)}  />      
  <Range
        step={0.1}
        min={0}
        max={100}
        values={[sliderVal]}
        onChange={(values) => setSliderVal(values[0])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className='flex-1 relative w-[96px] h-[2px] bg-text-255'
            style={{
                borderRadius: "4px",
                  background: getTrackBackground({
                    values: [sliderVal],
                    colors: ["#7E4ACC", "#D8DAEB"],
                    min: 0,
                    max: 100
                  }),
                }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className='bg-primary-500 h-3 w-3 rounded-full border-2 border-white'
          />
        )}
      />
  <Image src={plus} className='cursor-pointer' onClick={()=>setSliderVal((oldValue)=> oldValue+10<100?(oldValue+10):100)}  />
</div>
<div className='bg-primary-500/10 border border-primary-500 py-[9px] text-center h-[38px] w-[48px] rounded-lg text-f12 '>
{sliderVal.toFixed(0)}%
</div>
</div>
  );
}
