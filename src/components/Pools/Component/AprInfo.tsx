import Image from 'next/image';
import * as React from 'react';
import subtractSvg from '../../../assets/icon/pools/subtract.svg'
import { Position, ToolTip } from '../../Tooltip/TooltipAdvanced';
export interface IAprInfoProps {
}

export function AprInfo (props: IAprInfoProps) {
  return (
    <div className='flex gap-2 '>
        <ToolTip
         position={Position.top}
         toolTipChild={<p>Previous week: <span className='font-semibold'>3.48 %</span></p>}
        >
      <div className='bg-muted-200 border text-f14 cursor-pointer text-white border-border-500 rounded-lg py-[3px] px-2 '>
      2.45%
      </div>
      </ToolTip>
      <Image src={subtractSvg}/>
      <ToolTip
         message='Hello'
         position={Position.top}
        >
      <div className='text-f14 cursor-pointer text-white py-[3px] px-2 '>
      2.45%
      </div>
      </ToolTip>
    </div>
  );
}
