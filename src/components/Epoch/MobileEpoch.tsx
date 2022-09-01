import Image from 'next/image';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import vectorDown from "../../assets/icon/common/vector.svg";
import { AppDispatch, store } from '../../redux';
import { setSelectedEpoch } from '../../redux/epoch/epoch';


export interface IMobileEpochProps {
}

export function MobileEpoch (props: IMobileEpochProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const epochData = store.getState().epoch.epochData;
  const currentEpoch = store.getState().epoch.currentEpoch;
  const selectedEpoch = store.getState().epoch.selectedEpoch;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className=' '>
      <div className={`flex justify-between cursor-pointer py-2 px-5 ${currentEpoch.isCurrent?'bg-primary-700':''}`}   onClick={() => setIsDropDownActive(!isDropDownActive)}>
          <span>
          Epoch {currentEpoch.epochNumber} (current)
          </span>
          <Image
              className={isDropDownActive?"rotate-180":"rotate-0"}
              src={vectorDown}  
            />
      </div>
      {isDropDownActive && <>
           {epochData.map((epoch,i)=><EpochOptions text={epoch.epochNumber} onClick={()=>{  
            dispatch(setSelectedEpoch(epoch));
            setIsDropDownActive(false);
           }} isActive={epoch.isCurrent}/>)}
      </>}
    </div>
  );
}

export interface IEpochOptionsProps {
    text:string | number;
    onClick:Function;
    isActive:boolean;
}

export function EpochOptions (props: IEpochOptionsProps) {
  return (
    <div className={`flex justify-between cursor-pointer py-2 px-5 ${props.isActive?'bg-primary-700':''}`} onClick={props.onClick?()=>props.onClick():()=>{}} >
      Epoch {props.text}
    </div>
  );
}

