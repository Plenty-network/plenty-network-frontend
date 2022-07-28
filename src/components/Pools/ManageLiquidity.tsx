import * as React from 'react';
import { PopUpModal } from '../Modal/popupModal';
import { InfoIconToolTip } from '../Tooltip/infoIconTooltip';

export interface IManageLiquidityProps {
    closeFn:Function;
}

export function ManageLiquidity (props: IManageLiquidityProps) {
  return (
    <PopUpModal 
    onhide={props.closeFn}
    headerChild={
    <div className='flex gap-1'>
      <p>Manage Liquidity </p>
      <InfoIconToolTip message='Hello world' />
    </div>} 
    >
        
    </PopUpModal>
  );
}
