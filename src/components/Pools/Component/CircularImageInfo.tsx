import Image from "next/image";
import * as React from "react";


export interface ICircularImageInfoProps {
  imageArray?: Array<any>;
  className?:string;
  isSecoundIconBorder?:boolean;
}

export function CircularImageInfo(props: ICircularImageInfoProps) {
  const { className='' } =props;
  
  return (
    <div className={`pl-1 flex flex-row ${className}`} >
     {props.imageArray?.map((token,i)=>{ 
    if(props.isSecoundIconBorder){
      return (<ImageCircle  key={`CircularImageInfo_${i}`} className={`border-[0.94px] border-muted-235 rounded-full z-${i}`} src={token} />)
    }
     return (<ImageCircle  key={`CircularImageInfo_${i}`} src={token} />)
     })}
    </div>
  );
}

export interface IImageCircleProps {
  src?: any;
  width?: string;
  height?: string;
  className?:string;
}

export function ImageCircle(props: IImageCircleProps) {
  const {className=''} =props;
  return (
    <span className={`w-[28px] h-[28px] -ml-1 ${className}`}>
      <Image src={props.src} width={"28px"} height={"28px"} />
    </span>
  );
}
