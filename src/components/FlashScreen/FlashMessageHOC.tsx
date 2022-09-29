import * as React from 'react';
import { useStateAnimate } from '../../hooks/useAnimateUseState';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setFlashMessage } from '../../redux/flashMessage/action';
import { FlashMessage, Flashtype } from './index';
const FLASH_MESSAGE_SHOW_TIME=5000;
export interface IFlashMessageHOCProps {
}

export function FlashMessageHOC (props: IFlashMessageHOCProps) {
    const dispatch = useAppDispatch();
    const flashMessage = useAppSelector((state) => state.flashMessage.isLoading);
    const [isFlashVisiable,setIsFlashVisiable,animationState]=useStateAnimate(false,300);
    let timeOutTimer:any=null;
   React.useEffect(()=>{
    timeOutTimer &&  clearTimeout(timeOutTimer);
     if(flashMessage){
        timeOutTimer = setTimeout(()=>{
           dispatch(setFlashMessage(false));
        },FLASH_MESSAGE_SHOW_TIME);    
     }else{
        timeOutTimer &&  clearTimeout(timeOutTimer);
     }
     setIsFlashVisiable(flashMessage)
   },[flashMessage]) 
 if(isFlashVisiable){
  return (
    <div className='absolute right-2 md:bottom-10 bottom-[77px] z-50'>
      <FlashMessage onClick={()=>{}} className={!animationState?'slide-out-blurred-top':''} flashType={Flashtype.Warning} onCloseClick={()=>{dispatch(setFlashMessage(false))}} />
    </div>
  );
 }
 return <></>;
}
