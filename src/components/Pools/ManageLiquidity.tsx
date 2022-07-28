import * as React from 'react';
import { PopUpModal } from '../Modal/popupModal';
import { VideoModal } from '../Modal/videoModal';
import { InfoIconToolTip } from '../Tooltip/InfoIconTooltip';
import { ActiveLiquidity, ManageLiquidityHeader } from './ManageLiquidityHeader';
import playBtn from  '../../assets/icon/common/playBtn.svg'
import Image from 'next/image';


export interface IManageLiquidityProps {
    closeFn:Function;
}

export function ManageLiquidity (props: IManageLiquidityProps) {
  const [showVideoModal,setShowVideoModal]=React.useState(false);
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(ActiveLiquidity.Liquidity);

  return (
      <>
    
    <PopUpModal 
    onhide={props.closeFn}
    className='w-[620px] max-w-none'
    headerChild={
    <div className='flex gap-1'>
      <p>Manage Liquidity </p>
      <InfoIconToolTip message='Hello world' />
    </div>} 
    footerChild={
    <div className='flex justify-center items-center gap-4'>
      <p className='text-f16 text-text-150' >Add liquidity, stake, and earn PLY</p>
      <Image className='cursor-pointer hover:opacity-90' onClick={()=>setShowVideoModal(true)} src={playBtn} />
    </div>
  }
    >
      <ManageLiquidityHeader className='mt-5 mb-6' activeStateTab={activeState} setActiveStateTab={setActiveState} />

     {activeState=== ActiveLiquidity.Liquidity && <div className='h-52'>
     Liquidity
     </div> }
     {activeState=== ActiveLiquidity.Rewards && <div className='h-52'>
     Rewards
     </div> }
     {activeState=== ActiveLiquidity.Staking && <div className='h-52'>
     Staking
     </div> }

     </PopUpModal>  
     {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={'Bh5zuEI4M9o'} />}
     </>
  );
}
