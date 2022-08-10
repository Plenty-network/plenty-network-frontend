import * as React from 'react';
import { Position, ToolTip } from '../../Tooltip/TooltipAdvanced';

export interface IPoolsTextProps {
    text:String;
}
export interface IPoolsTextWithTooltipProps extends IPoolsTextProps  {
    token1:string;
    token2:string;
}

export function PoolsText (props: IPoolsTextProps) {
  return (
    <div className='text-f14 text-white cursor-pointer'>
      {props.text}
    </div>
  );
}
export function PoolsTextWithTooltip (props: IPoolsTextWithTooltipProps) {
    return (
      <ToolTip
      position={Position.top}
      toolTipChild={<div>
          <div className='text-text-500 text-f14 font-normal flex gap-1' >
              <div className='text-white font-medium pr-1'>{props.token1}</div>
              <div>CTEZ</div>
          </div>
          <div className='text-text-500 text-f14 font-normal flex gap-1' >
              <div className='text-white font-medium pr-1'>{props.token2}</div>
             <div>XTZ</div>
          </div>
      </div>}
      >
          <PoolsText
            text={props.text}
          />   
      </ToolTip>
    );
  }