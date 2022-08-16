import * as React from 'react';
import { Position, ToolTip } from '../../Tooltip/TooltipAdvanced';
import { BigNumber } from 'bignumber.js'

export interface IPoolsTextProps {
    text:String | BigNumber;
}
export interface IPoolsTextWithTooltipProps extends IPoolsTextProps  {
    token1:string;
    token2:string;
    token1Name:string;
    token2Name:string;
}

export function PoolsText (props: IPoolsTextProps) {
  return (
    <div className='text-f14 text-white cursor-pointer'>
      {props.text.toString()}
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
              <div>{props.token1Name}</div>
          </div>
          <div className='text-text-500 text-f14 font-normal flex gap-1' >
              <div className='text-white font-medium pr-1'>{props.token2}</div>
             <div>{props.token2Name}</div>
          </div>
      </div>}
      >
          <PoolsText
            text={props.text}
          />   
      </ToolTip>
    );
  }